from fastapi import APIRouter
from backend.data.generator import generate_synthetic_data
from backend.config import get_ai_status, STORE_NAME, STORE_CATEGORY, STORE_CITY, STORE_UPI, STORE_SOUNDBOX_ID
from backend.data.database import get_db_connection

router = APIRouter(prefix="/api/demo", tags=["Demo & System State"])

@router.post("/reset")
def reset_demo_data():
    count = generate_synthetic_data(num_days=90, force=True)
    return {
        "success": True,
        "message": f"Demo data successfully regenerated with {count} realistic transactions.",
        "merchant": STORE_NAME,
        "transaction_count": count
    }

@router.get("/status")
def get_system_status():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM transactions")
    txn_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM inventory")
    inv_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM campaigns")
    cmp_count = cursor.fetchone()[0]
    conn.close()

    return {
        "store_profile": {
            "name": STORE_NAME,
            "category": STORE_CATEGORY,
            "city": STORE_CITY,
            "upi_id": STORE_UPI,
            "soundbox_id": STORE_SOUNDBOX_ID
        },
        "ai_engine": get_ai_status(),
        "database_metrics": {
            "transactions_count": txn_count,
            "inventory_products_count": inv_count,
            "saved_campaigns_count": cmp_count
        },
        "mode": "Hackathon Demonstration (Synthetic Data - Sandbox Mode)"
    }

@router.get("/scenario")
def get_judge_demo_scenario():
    return {
        "scenario_title": "3-Minute Live Judge Demo: Diagnosing Declining Sales & Taking Action",
        "story": "Sharma General Store owner notices a ~12.8% drop in weekly sales and asks Dukaan Saathi AI to investigate the cause and recommend a solution.",
        "steps": [
            {
                "step_number": 1,
                "step_title": "Overview Dashboard Inspection",
                "description": "Inspect the 7-day dashboard. Observe total sales at ₹71,840 (-12.8% vs prior week) with transactions down by 47 orders.",
                "action_target": "dashboard",
                "highlight_metric": "Weekly Sales Dip: -12.8%"
            },
            {
                "step_number": 2,
                "step_title": "Ask AI Copilot for Root Cause",
                "description": "Click the suggested question chip: 'Why did my sales decrease this week?'. Watch the AI execute comparison tools.",
                "action_target": "copilot",
                "suggested_query": "Why did my sales decrease this week?"
            },
            {
                "step_number": 3,
                "step_title": "Explainable Analysis Revealed",
                "description": "Dukaan Saathi identifies that the dip is concentrated in Evening Hours (5:30-8:30 PM) for Snacks & Dairy, and points to 35 inactive regular shoppers.",
                "action_target": "copilot_results"
            },
            {
                "step_number": 4,
                "step_title": "Multilingual Campaign Generation",
                "description": "Click 'Draft Evening Combo Campaign'. Switch language to Hindi or Telugu to preview localized WhatsApp copy.",
                "action_target": "campaign_studio"
            },
            {
                "step_number": 5,
                "step_title": "Save Draft & Simulate Reorder",
                "description": "Save the campaign to demo storage. Check Inventory Assistant to restock low-running Fortune Sunflower Oil.",
                "action_target": "inventory"
            }
        ]
    }
