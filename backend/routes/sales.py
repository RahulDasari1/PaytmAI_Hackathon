from fastapi import APIRouter, Query
from typing import Optional
from backend.services.analytics import (
    get_dashboard_summary,
    get_sales_trends,
    get_category_performance,
    get_payment_breakdown,
    get_peak_hours,
    compare_sales_periods
)

router = APIRouter(prefix="/api/sales", tags=["Sales Analytics"])

@router.get("/analytics")
def get_analytics(range_key: str = Query("7d")):
    summary = get_dashboard_summary(range_key)
    trends = get_sales_trends(range_key)
    categories = get_category_performance(range_key)
    payments = get_payment_breakdown(range_key)
    peaks = get_peak_hours(range_key)

    return {
        "summary": summary,
        "trends": trends,
        "categories": categories,
        "payments": payments,
        "peaks": peaks
    }

@router.get("/hourly")
def get_hourly(range_key: str = Query("7d")):
    return get_peak_hours(range_key)

@router.get("/compare")
def compare_periods(
    p1_start: str = Query("2026-10-21"),
    p1_end: str = Query("2026-10-28"),
    p2_start: str = Query("2026-10-14"),
    p2_end: str = Query("2026-10-21")
):
    return compare_sales_periods(p1_start, p1_end, p2_start, p2_end)
