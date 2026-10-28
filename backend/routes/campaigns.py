from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from backend.services.campaign_service import (
    list_campaigns,
    save_campaign,
    generate_campaign_draft,
    delete_campaign
)

router = APIRouter(prefix="/api/campaigns", tags=["Marketing Campaigns"])

class GenerateDraftRequest(BaseModel):
    objective: Optional[str] = "WIN_BACK_INACTIVE"
    audience_segment: Optional[str] = "Inactive Customers (Last 14+ Days)"
    offer_type: Optional[str] = "FLAT_DISCOUNT"
    language: Optional[str] = "en"
    channel: Optional[str] = "WhatsApp"

class SaveCampaignRequest(BaseModel):
    id: Optional[str] = None
    name: str
    objective: str
    audience_segment: str
    offer_type: str
    channel: str
    language: str
    message_copy: str
    offer_details: Optional[str] = ""
    suggested_timing: Optional[str] = ""
    rationale: Optional[str] = ""
    status: Optional[str] = "DRAFT"
    target_customer_count: Optional[int] = 35

@router.get("")
def get_campaigns():
    return list_campaigns()

@router.post("/generate")
def generate_draft(req: GenerateDraftRequest):
    return generate_campaign_draft(
        req.objective,
        req.audience_segment,
        req.offer_type,
        req.language,
        req.channel
    )

@router.post("")
def create_or_update_campaign(req: SaveCampaignRequest):
    return save_campaign(req.model_dump())

@router.delete("/{campaign_id}")
def remove_campaign(campaign_id: str):
    return delete_campaign(campaign_id)
