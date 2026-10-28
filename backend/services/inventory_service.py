import sqlite3
import pandas as pd
from datetime import datetime
from typing import List, Dict, Any, Optional
from backend.data.database import get_db_connection

def get_inventory_status(filter_urgency: Optional[str] = None, filter_category: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db_connection()

    # Load products
    inventory_df = pd.read_sql_query("SELECT * FROM inventory", conn)

    # Compute daily sales velocity over the past 30 days from transactions
    txns_df = pd.read_sql_query("""
        SELECT product_name, quantity, status
        FROM transactions
        WHERE status = 'SUCCESS'
    """, conn)
    conn.close()

    if inventory_df.empty:
        return []

    # Map velocity per product
    product_sales = {}
    if not txns_df.empty:
        # Transactions span 90 days, let's take past 30 days equivalent
        counts = txns_df.groupby("product_name")["quantity"].sum()
        for prod_name, total_qty in counts.items():
            # Estimate daily velocity
            daily_vel = round(float(total_qty) / 90.0, 1)
            product_sales[prod_name] = max(daily_vel, 0.4)

    items = []
    for _, row in inventory_df.iterrows():
        sku = row["sku"]
        name = row["name"]
        cat = row["category"]
        curr_stock = int(row["current_stock"])
        min_thresh = int(row["min_threshold"])
        reorder_qty = int(row["suggested_reorder_qty"])
        unit_cost = float(row["unit_cost"])
        unit_price = float(row["unit_price"])
        supplier = row["supplier_name"]
        last_reorder = row["last_reordered_at"] or "N/A"

        daily_velocity = product_sales.get(name, 1.2)
        days_remaining = round(curr_stock / daily_velocity, 1) if daily_velocity > 0 else 99.0

        # Determine Priority / Urgency
        if curr_stock <= int(min_thresh * 0.5) or days_remaining <= 3.0:
            priority = "CRITICAL"
            why = f"High stockout risk! Selling at ~{daily_velocity} units/day. Only {days_remaining} days of supply left before stock runs out."
        elif curr_stock <= min_thresh or days_remaining <= 7.0:
            priority = "LOW_STOCK"
            why = f"Stock is below recommended safety threshold of {min_thresh} units. Estimated {days_remaining} days remaining."
        else:
            priority = "HEALTHY"
            why = f"Healthy inventory level. Sufficient for ~{days_remaining} days at standard demand."

        # Filter if requested
        if filter_urgency and filter_urgency != "ALL" and priority != filter_urgency:
            continue
        if filter_category and filter_category != "ALL" and cat != filter_category:
            continue

        items.append({
            "sku": sku,
            "name": name,
            "category": cat,
            "current_stock": curr_stock,
            "min_threshold": min_thresh,
            "daily_sales_velocity": daily_velocity,
            "estimated_days_remaining": days_remaining,
            "suggested_reorder_qty": reorder_qty,
            "priority": priority,
            "unit_cost": unit_cost,
            "unit_price": unit_price,
            "estimated_reorder_cost": round(reorder_qty * unit_cost, 2),
            "supplier_name": supplier,
            "last_reordered_at": last_reorder,
            "why_recommendation": why
        })

    # Sort so CRITICAL is first, then LOW_STOCK, then HEALTHY
    priority_order = {"CRITICAL": 0, "LOW_STOCK": 1, "HEALTHY": 2}
    return sorted(items, key=lambda x: (priority_order.get(x["priority"], 3), x["estimated_days_remaining"]))

def simulate_reorder(sku: str, quantity: Optional[int] = None) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM inventory WHERE sku = ?", (sku,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return {"success": False, "message": f"Product SKU {sku} not found"}

    reorder_qty = quantity if quantity and quantity > 0 else int(row["suggested_reorder_qty"])
    new_stock = int(row["current_stock"]) + reorder_qty
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    cursor.execute("""
        UPDATE inventory
        SET current_stock = ?, last_reordered_at = ?
        WHERE sku = ?
    """, (new_stock, now_str, sku))

    conn.commit()
    conn.close()

    return {
        "success": True,
        "sku": sku,
        "product_name": row["name"],
        "added_quantity": reorder_qty,
        "new_stock": new_stock,
        "supplier_name": row["supplier_name"],
        "message": f"Simulated purchase order placed with {row['supplier_name']} for {reorder_qty} units of {row['name']}. Stock updated to {new_stock} units."
    }
