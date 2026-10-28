from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import Optional
from backend.services.inventory_service import get_inventory_status, simulate_reorder

router = APIRouter(prefix="/api/inventory", tags=["Inventory Assistant"])

class ReorderRequest(BaseModel):
    sku: str
    quantity: Optional[int] = None

@router.get("")
def list_inventory(
    urgency: Optional[str] = Query("ALL"),
    category: Optional[str] = Query("ALL")
):
    return get_inventory_status(urgency, category)

@router.post("/reorder")
def reorder_product(req: ReorderRequest):
    return simulate_reorder(req.sku, req.quantity)
