from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from backend.services.copilot_service import run_copilot_query

router = APIRouter(prefix="/api/copilot", tags=["AI Copilot"])

class ChatRequest(BaseModel):
    query: str
    language: Optional[str] = "en"

SUGGESTIONS = {
    "en": [
        "Why did my sales decrease this week?",
        "Which products should I promote?",
        "When is my shop busiest?",
        "How can I bring back inactive customers?",
        "What should I stock more of?",
        "Create a weekend promotional campaign",
        "Summarize my business performance",
        "Explain my business performance in Hindi"
    ],
    "hi": [
        "इस सप्ताह मेरी बिक्री क्यों घटी?",
        "मुझे कौन से उत्पाद प्रमोट करने चाहिए?",
        "दुकान में सबसे ज्यादा भीड़ कब होती है?",
        "पुराने ग्राहकों को वापस कैसे लाएं?",
        "कौन सा सामान तुरंत मंगाना चाहिए?",
        "वीकेंड के लिए एक नया ऑफर बनाएं",
        "मेरे व्यापार का पूरा सारांश बताएं"
    ],
    "te": [
        "ఈ వారం నా విక్రయాలు ఎందుకు తగ్గాయి?",
        "నేను ఏ ఉత్పత్తులను ప్రమోట్ చేయాలి?",
        "నా దుకాణం ఎప్పుడు అత్యధిక రద్దీగా ఉంటుంది?",
        "పాత కస్టమర్లను తిరిగి ఎలా రప్పించాలి?",
        "నేను వెంటనే ఏ స్టాక్ ఆర్డర్ చేయాలి?",
        "వీకెండ్ ప్రత్యేక ప్రచారాన్ని సృష్టించండి",
        "నా వ్యాపార సమగ్ర నివేదిక ఇవ్వండి"
    ]
}

@router.post("/chat")
def chat(request: ChatRequest):
    return run_copilot_query(request.query, request.language)

@router.get("/suggestions")
def get_suggestions(language: str = "en") -> List[str]:
    return SUGGESTIONS.get(language, SUGGESTIONS["en"])
