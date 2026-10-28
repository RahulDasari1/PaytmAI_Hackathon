from fastapi import APIRouter, Query
from backend.services.analytics import get_customer_insights

router = APIRouter(prefix="/api/customers", tags=["Customer Insights"])

@router.get("/insights")
def get_insights(range_key: str = Query("30d")):
    return get_customer_insights(range_key)
