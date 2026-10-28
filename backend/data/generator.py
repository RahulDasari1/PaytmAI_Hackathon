import random
from datetime import datetime, timedelta
import sqlite3
from backend.data.database import get_db_connection

PRODUCTS_CATALOG = [
    # Groceries & Staples
    {"sku": "GRO-ATT-001", "name": "Aashirvaad Superior MP Sharbati Atta 5kg", "category": "Groceries & Staples", "cost": 210, "price": 245, "stock": 24, "min_stock": 15, "reorder_qty": 30, "supplier": "ITC Wholesale Distributor"},
    {"sku": "GRO-RIC-002", "name": "India Gate Basmati Rice Feast Rozzana 5kg", "category": "Groceries & Staples", "cost": 360, "price": 420, "stock": 18, "min_stock": 10, "reorder_qty": 20, "supplier": "KRBL Logistics"},
    {"sku": "GRO-DAL-003", "name": "Tata Sampann Unpolished Toor Dal 1kg", "category": "Groceries & Staples", "cost": 140, "price": 165, "stock": 35, "min_stock": 20, "reorder_qty": 40, "supplier": "Tata Consumer Direct"},
    {"sku": "GRO-OIL-004", "name": "Fortune Sunlite Refined Sunflower Oil 1L", "category": "Groceries & Staples", "cost": 122, "price": 145, "stock": 6, "min_stock": 20, "reorder_qty": 48, "supplier": "Adani Wilmar Agency"},
    {"sku": "GRO-SLT-005", "name": "Tata Salt Vacuum Evaporated Iodised 1kg", "category": "Groceries & Staples", "cost": 22, "price": 28, "stock": 50, "min_stock": 25, "reorder_qty": 60, "supplier": "Tata Consumer Direct"},
    {"sku": "GRO-SUG-006", "name": "Madhur Pure & Hygienic Sugar 1kg", "category": "Groceries & Staples", "cost": 44, "price": 52, "stock": 40, "min_stock": 20, "reorder_qty": 50, "supplier": "Shree Renuka Sugars"},

    # Dairy & Bakery
    {"sku": "DAI-MLK-001", "name": "Amul Taaza Homogenised Toned Milk 500ml", "category": "Dairy & Bakery", "cost": 27, "price": 32, "stock": 12, "min_stock": 30, "reorder_qty": 60, "supplier": "Amul Delhi NCR Depot"},
    {"sku": "DAI-BRD-002", "name": "Harvest Gold White Bread 400g", "category": "Dairy & Bakery", "cost": 34, "price": 42, "stock": 8, "min_stock": 15, "reorder_qty": 25, "supplier": "Harvest Gold NCR Daily"},
    {"sku": "DAI-BTR-003", "name": "Amul Pasteurised Butter 100g", "category": "Dairy & Bakery", "cost": 49, "price": 58, "stock": 22, "min_stock": 15, "reorder_qty": 30, "supplier": "Amul Delhi NCR Depot"},
    {"sku": "DAI-CUR-004", "name": "Mother Dairy Classic Dahi 400g", "category": "Dairy & Bakery", "cost": 36, "price": 45, "stock": 14, "min_stock": 20, "reorder_qty": 30, "supplier": "Mother Dairy Fruit & Veg"},
    {"sku": "DAI-PAN-005", "name": "Amul Malai Fresh Paneer 200g", "category": "Dairy & Bakery", "cost": 76, "price": 92, "stock": 15, "min_stock": 12, "reorder_qty": 25, "supplier": "Amul Delhi NCR Depot"},

    # Snacks & Beverages
    {"sku": "SNK-MAG-001", "name": "Maggi 2-Minute Masala Noodles 4-Pack", "category": "Snacks & Beverages", "cost": 46, "price": 56, "stock": 9, "min_stock": 25, "reorder_qty": 50, "supplier": "Nestle India Wholesale"},
    {"sku": "SNK-BIS-002", "name": "Britannia Good Day Butter Cookies 200g", "category": "Snacks & Beverages", "cost": 28, "price": 35, "stock": 32, "min_stock": 20, "reorder_qty": 40, "supplier": "Britannia Direct"},
    {"sku": "SNK-NAM-003", "name": "Haldiram's Nagpur Aloo Bhujia 400g", "category": "Snacks & Beverages", "cost": 92, "price": 115, "stock": 28, "min_stock": 15, "reorder_qty": 30, "supplier": "Haldiram Snacks Ltd"},
    {"sku": "SNK-COL-004", "name": "Thums Up Charged Carbonated Can 330ml", "category": "Snacks & Beverages", "cost": 32, "price": 40, "stock": 36, "min_stock": 24, "reorder_qty": 48, "supplier": "Hindustan Coca-Cola"},
    {"sku": "SNK-TEA-005", "name": "Brooke Bond Red Label Tea 250g", "category": "Snacks & Beverages", "cost": 115, "price": 138, "stock": 19, "min_stock": 15, "reorder_qty": 25, "supplier": "Hindustan Unilever Ltd"},

    # Personal & Home Care
    {"sku": "PER-DET-001", "name": "Surf Excel Quick Wash Detergent Powder 1kg", "category": "Personal & Home Care", "cost": 118, "price": 142, "stock": 26, "min_stock": 15, "reorder_qty": 30, "supplier": "Hindustan Unilever Ltd"},
    {"sku": "PER-SOP-002", "name": "Dettol Original Germ Protection Soap 3x100g", "category": "Personal & Home Care", "cost": 96, "price": 118, "stock": 21, "min_stock": 15, "reorder_qty": 30, "supplier": "Reckitt Benckiser NCR"},
    {"sku": "PER-PAS-003", "name": "Colgate Strong Teeth Dental Paste 150g", "category": "Personal & Home Care", "cost": 84, "price": 105, "stock": 30, "min_stock": 18, "reorder_qty": 36, "supplier": "Colgate-Palmolive India"}
]

PAYMENT_METHODS = ["Paytm QR (UPI)", "Paytm Soundbox (UPI)", "Paytm Card POS", "Cash", "Netbanking"]
PAYMENT_WEIGHTS = [0.46, 0.30, 0.08, 0.14, 0.02]

def generate_synthetic_data(num_days: int = 90, force: bool = False):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if data already exists
    cursor.execute("SELECT COUNT(*) FROM transactions")
    count = cursor.fetchone()[0]
    if count > 0 and not force:
        conn.close()
        return count

    # Clear existing tables if force
    cursor.execute("DELETE FROM transactions")
    cursor.execute("DELETE FROM inventory")
    cursor.execute("DELETE FROM campaigns")
    cursor.execute("DELETE FROM chat_messages")

    # Insert Products into Inventory
    for p in PRODUCTS_CATALOG:
        cursor.execute("""
            INSERT INTO inventory (sku, name, category, current_stock, unit_cost, unit_price, min_threshold, suggested_reorder_qty, supplier_name, last_reordered_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            p["sku"], p["name"], p["category"], p["stock"], p["cost"], p["price"],
            p["min_stock"], p["reorder_qty"], p["supplier"], (datetime.now() - timedelta(days=random.randint(4, 18))).strftime("%Y-%m-%d")
        ))

    # Base reference date: today (2026-10-28)
    base_date = datetime(2026, 10, 28, 21, 30, 0)
    start_date = base_date - timedelta(days=num_days)

    # Customer base: 220 distinct customers
    customer_pool = [f"CUST_{1000 + i}" for i in range(220)]
    
    # 40 Loyal regulars, 120 regular buyers, 60 occasional
    loyal_customers = customer_pool[:40]
    regular_customers = customer_pool[40:160]
    occasional_customers = customer_pool[160:]

    # 35 customers designated to become "inactive" in the last 18 days
    churning_customers = regular_customers[60:95]

    transactions = []
    txn_seq = 10001

    for day_offset in range(num_days):
        current_day = start_date + timedelta(days=day_offset)
        day_str = current_day.strftime("%Y-%m-%d")
        is_weekend = current_day.weekday() in (5, 6) # Saturday, Sunday
        days_from_end = num_days - day_offset # 1 is today, 7 is 7 days ago

        # Determine daily transaction target
        base_txn_count = random.randint(52, 68) if is_weekend else random.randint(44, 56)

        # Seeded Dip scenario: in the last 7 days (days_from_end <= 7), sales dip by ~12-14%
        is_recent_dip_week = (days_from_end <= 7)
        if is_recent_dip_week:
            base_txn_count = int(base_txn_count * 0.88)

        # Generate hours distributed between 07:30 and 22:00
        # Peaks: 08:30 - 11:00 (morning milk/breakfast/groceries), 17:30 - 21:00 (evening snacks/dinner)
        for _ in range(base_txn_count):
            # Select customer
            # If recent dip week, churning customers do NOT visit
            if is_recent_dip_week:
                eligible_customers = loyal_customers + [c for c in regular_customers if c not in churning_customers] + occasional_customers
            elif days_from_end <= 20 and random.random() < 0.6:
                # Started slowing down 2-3 weeks ago
                eligible_customers = [c for c in customer_pool if c not in churning_customers[:15]]
            else:
                eligible_customers = customer_pool

            cust_id = random.choice(eligible_customers)

            # Hour weighting
            hour_rand = random.random()
            if hour_rand < 0.32: # Morning peak
                hour = random.choice([8, 9, 10])
                minute = random.randint(0, 59)
            elif hour_rand < 0.52: # Afternoon lull
                hour = random.choice([12, 13, 14, 15, 16])
                minute = random.randint(0, 59)
            elif hour_rand < 0.90: # Evening peak
                hour = random.choice([17, 18, 19, 20])
                minute = random.randint(0, 59)
                # Seeded Dip: in recent week, evening footfall drops significantly due to road construction
                if is_recent_dip_week and random.random() < 0.35:
                    continue # Skip this transaction to simulate drop in evening footfall
            else: # Night closing
                hour = random.choice([21])
                minute = random.randint(0, 45)

            txn_time = datetime(current_day.year, current_day.month, current_day.day, hour, minute, random.randint(0, 59))

            # Select product based on time of day
            if hour in [8, 9, 10]:
                prod_choices = [p for p in PRODUCTS_CATALOG if p["category"] in ["Dairy & Bakery", "Groceries & Staples"]]
            elif hour in [17, 18, 19, 20]:
                prod_choices = [p for p in PRODUCTS_CATALOG if p["category"] in ["Snacks & Beverages", "Dairy & Bakery", "Groceries & Staples"]]
            else:
                prod_choices = PRODUCTS_CATALOG

            product = random.choice(prod_choices)
            qty = 1 if product["price"] > 150 else random.choices([1, 2, 3], weights=[0.70, 0.22, 0.08])[0]
            amount = round(product["price"] * qty, 2)

            # Basket addition: ~30% of time customers buy a second complementary item
            if random.random() < 0.32:
                secondary_prod = random.choice([p for p in PRODUCTS_CATALOG if p["sku"] != product["sku"]])
                amount += secondary_prod["price"]

            # Payment method
            payment_method = random.choices(PAYMENT_METHODS, weights=PAYMENT_WEIGHTS)[0]

            # Status: 98% SUCCESS, 1.2% FAILED, 0.8% REFUNDED
            status = random.choices(["SUCCESS", "FAILED", "REFUNDED"], weights=[0.98, 0.012, 0.008])[0]

            txn_id = f"TXN_{txn_time.strftime('%Y%m%d')}_{txn_seq}"
            txn_seq += 1

            transactions.append((
                txn_id,
                txn_time.isoformat(),
                amount,
                product["category"],
                product["name"],
                qty,
                payment_method,
                cust_id,
                status
            ))

    # Bulk insert transactions
    cursor.executemany("""
        INSERT INTO transactions (transaction_id, timestamp, amount, category, product_name, quantity, payment_method, customer_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, transactions)

    # Seed Initial Campaigns
    initial_campaigns = [
        (
            "CMP_1001",
            "Diwali Festive Grocery Dhamaka",
            "Festival Sales Boost",
            "All Regular Customers",
            "Flat 10% OFF above ₹999",
            "WhatsApp",
            "en",
            "Namaste! Celebrate this festival with Sharma General Store. Get Flat 10% OFF on all grocery orders above ₹999 this weekend. Use code DIWALI10 at checkout or show this message at billing counter! Valid till Sunday.",
            "Flat 10% OFF on purchases over ₹999",
            "Friday 6:00 PM",
            "Historically drives a 22% increase in basket size over festival weekends.",
            "COMPLETED",
            142,
            (base_date - timedelta(days=22)).isoformat()
        ),
        (
            "CMP_1002",
            "Chai & Snacks Evening Combo",
            "Win-back Inactive Evening Shoppers",
            "Inactive Customers (Last 14+ Days)",
            "Buy Tea Get Biscuits at 50% OFF",
            "WhatsApp",
            "hi",
            "नमस्ते जी! शर्मा जनरल स्टोर से आपके लिए खास ऑफर। आज शाम चाय पत्ती के साथ गुड डे बिस्किट पर पाएं 50% की सीधी छूट! कोड: CHAI50। दुकान पर पधारें या पेटीएम से ऑर्डर करें।",
            "Buy Brooke Bond Tea, get Good Day Biscuits at 50% off",
            "Daily 5:30 PM",
            "Targeting the 35 inactive evening footfall shoppers to recover lost tea-time transactions.",
            "DRAFT",
            35,
            (base_date - timedelta(days=1)).isoformat()
        )
    ]

    cursor.executemany("""
        INSERT INTO campaigns (id, name, objective, audience_segment, offer_type, channel, language, message_copy, offer_details, suggested_timing, rationale, status, target_customer_count, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, initial_campaigns)

    conn.commit()
    conn.close()
    return len(transactions)

if __name__ == "__main__":
    count = generate_synthetic_data(force=True)
    print(f"Generated {count} synthetic transactions.")
