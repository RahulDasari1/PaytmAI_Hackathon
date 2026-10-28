import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "dukaan_saathi.db"

# Load .env file
load_dotenv(BASE_DIR.parent / ".env")

# Settings
STORE_NAME = os.getenv("STORE_NAME", "Sharma General Store")
STORE_CATEGORY = os.getenv("STORE_CATEGORY", "Kirana & Daily Needs")
STORE_CITY = os.getenv("STORE_CITY", "Noida, Uttar Pradesh")
STORE_UPI = os.getenv("STORE_UPI", "sharmastore@paytm")
STORE_SOUNDBOX_ID = os.getenv("STORE_SOUNDBOX_ID", "PSB-99214-NOIDA")

# AI API Keys (Optional - provider-agnostic fallback works seamlessly without keys)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "")

# LLM Provider detection
def get_ai_status():
    if GEMINI_API_KEY:
        return {"mode": "gemini", "active": True, "label": "Gemini AI (Connected)", "model": "gemini-1.5-flash"}
    elif OPENAI_API_KEY:
        return {"mode": "openai", "active": True, "label": "OpenAI (Connected)", "model": "gpt-4o-mini"}
    elif SARVAM_API_KEY:
        return {"mode": "sarvam", "active": True, "label": "Sarvam AI (Connected)", "model": "sarvam-2b"}
    else:
        return {"mode": "deterministic_fallback", "active": True, "label": "Deterministic AI Engine (Local)", "model": "Local Business Analytics Engine v1.0"}
