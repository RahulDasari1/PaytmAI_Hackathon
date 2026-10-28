from fastapi import APIRouter, Query
from typing import Optional
from backend.services.analytics import (
    get_dashboard_summary,
    get_sales_trends,
    get_payment_breakdown,
    get_category_performance,
    get_product_performance,
    get_business_recommendations
)
from backend.data.database import get_db_connection

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_summary(
    range_key: str = Query("7d", description="today, 7d, 30d, or custom"),
    start: Optional[str] = None,
    end: Optional[str] = None
):
    return get_dashboard_summary(range_key, start, end)

@router.get("/trends")
def get_trends(
    range_key: str = Query("7d"),
    start: Optional[str] = None,
    end: Optional[str] = None
):
    return get_sales_trends(range_key, start, end)

@router.get("/payments")
def get_payments(range_key: str = Query("7d")):
    return get_payment_breakdown(range_key)

@router.get("/categories")
def get_categories(range_key: str = Query("7d")):
    return get_category_performance(range_key)

@router.get("/products")
def get_products(range_key: str = Query("7d"), limit: int = 8):
    return get_product_performance(range_key, limit)

@router.get("/recommendations")
def get_recommendations():
    return get_business_recommendations()

@router.get("/recent-transactions")
def get_recent_transactions(limit: int = 8):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT transaction_id, timestamp, amount, category, product_name, quantity, payment_method, customer_id, status
        FROM transactions
        ORDER BY timestamp DESC
        LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "transaction_id": r["transaction_id"],
            "timestamp": r["timestamp"],
            "amount": r["amount"],
            "category": r["category"],
            "product_name": r["product_name"],
            "quantity": r["quantity"],
            "payment_method": r["payment_method"],
            "customer_id": r["customer_id"],
            "status": r["status"]
        })
    return result
