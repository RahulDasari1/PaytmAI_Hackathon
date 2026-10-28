import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from backend.data.database import get_db_connection

TEMPLATES = {
    "en": {
        "WIN_BACK_INACTIVE": {
            "title": "We Miss You at Sharma General Store!",
            "message": "Namaste {customer_name}! We haven't seen you recently at Sharma General Store. To welcome you back, enjoy Flat ₹50 OFF on your next grocery order above ₹499! Show this message or use code COMEBACK50 at counter. Valid till Sunday.",
            "rationale": "Directly targets customers who haven't visited in 14+ days with an attractive ticket-size threshold.",
            "timing": "Friday or Saturday 11:00 AM",
            "est_reach": 35,
            "est_conv": "18% - 25% (6 to 9 repeat visits)"
        },
        "EVENING_FOOTFALL_BOOST": {
            "title": "Evening Chai & Snacks Combo Offer",
            "message": "Special Evening Deal at Sharma General Store! Buy any Tea/Coffee packet (250g+) between 5 PM - 8 PM and get Good Day Cookies at 50% OFF! Pay via Paytm QR/Soundbox for instant rewards. Valid today!",
            "rationale": "Specifically combats the observed 24% dip in evening footfall by bundling high-demand evening staples.",
            "timing": "Daily at 4:30 PM",
            "est_reach": 85,
            "est_conv": "22% - 30% (18 to 25 combo purchases)"
        },
        "REPEAT_PURCHASES": {
            "title": "Weekend Grocery Savings Dhamaka",
            "message": "Hello valued customer! Shop your weekly grocery essentials this weekend at Sharma General Store and get Flat 8% OFF on bill above ₹799. Quick billing with Paytm Soundbox! Valid Saturday & Sunday.",
            "rationale": "Incentivizes larger grocery basket sizes during regular weekend replenishment cycles.",
            "timing": "Saturday 9:00 AM",
            "est_reach": 120,
            "est_conv": "20% - 28% (24 to 34 orders)"
        },
        "PRODUCT_PROMOTION": {
            "title": "Fresh Paneer & Dairy Morning Offer",
            "message": "Good morning! Fresh Amul Paneer (200g) and Mother Dairy Dahi just arrived at Sharma General Store. Grab 10% OFF on dairy bundles before 11 AM today. Scan Paytm QR for zero-wait checkout!",
            "rationale": "Capitalizes on morning peak traffic to clear perishable fresh dairy stock quickly.",
            "timing": "Morning 8:00 AM",
            "est_reach": 95,
            "est_conv": "25% - 35% (24 to 33 dairy bundles)"
        }
    },
    "hi": {
        "WIN_BACK_INACTIVE": {
            "title": "शर्मा जनरल स्टोर - हम आपको मिस कर रहे हैं!",
            "message": "नमस्ते जी! काफी दिनों से आप शर्मा जनरल स्टोर नहीं पधारे। आपके स्वागत के लिए ₹499 से अधिक की खरीदारी पर पाएं फ्लैट ₹50 की सीधी छूट! बिलिंग काउंटर पर यह संदेश दिखाएं या कोड COMEBACK50 बताएं। ऑफर रविवार तक वैध।",
            "rationale": "14+ दिनों से न आने वाले ग्राहकों को दोबारा आकर्षित करने के लिए प्रभावी संदेश।",
            "timing": "शुक्रवार या शनिवार सुबह 11:00 बजे",
            "est_reach": 35,
            "est_conv": "18% - 25% (6 से 9 ग्राहक वापसी)"
        },
        "EVENING_FOOTFALL_BOOST": {
            "title": "शाम की चाय और स्नैक्स स्पेशल कॉम्बो",
            "message": "नमस्ते! शर्मा जनरल स्टोर का शाम का खास ऑफर। आज शाम 5 से 8 बजे के बीच चाय पत्ती (250g) की खरीद पर गुड डे बिस्किट पर पाएं 50% की छूट! पेटीएम साउंडबॉक्स से तुरंत भुगतान करें। पधारें आज ही!",
            "rationale": "शाम के समय कम हुई बिक्री को चाय और स्नैक्स के आकर्षक कॉम्बो से तुरंत गति देने के लिए।",
            "timing": "प्रतिदिन शाम 4:30 बजे",
            "est_reach": 85,
            "est_conv": "22% - 30% (18 से 25 कॉम्बो बिक्री)"
        },
        "REPEAT_PURCHASES": {
            "title": "वीकेंड किराना बचत धमाका",
            "message": "नमस्ते ग्राहक महोदय! इस वीकेंड शर्मा जनरल स्टोर से किराना सामान खरीदें और ₹799 से ऊपर के बिल पर पाएं फ्लैट 8% की छूट। पेटीएम से आसान और तेज़ भुगतान!",
            "rationale": "वीकेंड पर ग्राहकों की बास्केट साइज़ बढ़ाने के लिए कारगर योजना।",
            "timing": "शनिवार सुबह 9:00 बजे",
            "est_reach": 120,
            "est_conv": "20% - 28% (24 से 34 ऑर्डर्स)"
        },
        "PRODUCT_PROMOTION": {
            "title": "ताज़ा पनीर और डेयरी मॉर्निंग ऑफर",
            "message": "सुप्रभात! शर्मा जनरल स्टोर पर ताज़ा अमूल पनीर और मदर डेयरी दही उपलब्ध है। सुबह 11 बजे से पहले डेयरी कॉम्बो पर पाएं 10% की छूट। पेटीएम क्यूआर स्कैन करें!",
            "rationale": "सुबह की खरीदारी के समय डेयरी उत्पादों की बिक्री में तेज़ी लाने के लिए।",
            "timing": "सुबह 8:00 बजे",
            "est_reach": 95,
            "est_conv": "25% - 35% (24 से 33 बिक्री)"
        }
    },
    "te": {
        "WIN_BACK_INACTIVE": {
            "title": "శర్మ జనరల్ స్టోర్ - మిమ్మల్ని మిస్ అవుతున్నాము!",
            "message": "నమస్కారం! చాలా రోజులుగా మీరు శర్మ జనరల్ స్టోర్‌ను సందర్శించలేదు. మీ పునఃస్వాగతం కోసం ₹499 పైబడిన కొనుగోళ్లపై ఫ్లాట్ ₹50 రాయితీ పొందండి! కౌంటర్ వద్ద ఈ సందేశాన్ని చూపించండి లేదా కోడ్ COMEBACK50 చెప్పండి. ఆఫర్ ఆదివారం వరకు మాత్రమే.",
            "rationale": "14+ రోజులుగా రాని పాత కస్టమర్లను తిరిగి దుకాణానికి రప్పించడానికి అనువైన ఆఫర్.",
            "timing": "శుక్రవారం లేదా శనివారం ఉదయం 11:00 గంటలకు",
            "est_reach": 35,
            "est_conv": "18% - 25% (6 నుండి 9 మంది కస్టమర్లు)"
        },
        "EVENING_FOOTFALL_BOOST": {
            "title": "సాయంత్రం టీ & స్నాక్స్ కాంబో ఆఫర్",
            "message": "శర్మ జనరల్ స్టోర్ ప్రత్యేక సాయంత్రం ఆఫర్! ఈరోజు సాయంత్రం 5 నుండి 8 గంటల మధ్య టీ పౌడర్ (250గ్రా) కొనుగోలుపై గుడ్ డే బిస్కెట్ ప్యాకెట్‌పై 50% తగ్గింపు పొందండి! పేటీఎం సౌండ్‌బాక్స్ ద్వారా చెల్లించండి.",
            "rationale": "సాయంత్రపు స్నాక్స్ మరియు టీ విక్రయాలను వేగవంతం చేయడానికి రూపొందించిన ప్రత్యేక కాంబో.",
            "timing": "ప్రతిరోజూ సాయంత్రం 4:30 గంటలకు",
            "est_reach": 85,
            "est_conv": "22% - 30% (18 నుండి 25 కాంబోలు)"
        },
        "REPEAT_PURCHASES": {
            "title": "వీకెండ్ కిరాణా సేవింగ్స్ ధమాకా",
            "message": "నమస్కారం! ఈ వీకెండ్ శర్మ జనరల్ స్టోర్‌లో ₹799 కంటే ఎక్కువ కొనుగోలుపై ఫ్లాట్ 8% తగ్గింపు పొందండి. పేటీఎం క్యూఆర్ కోడ్‌తో సులభంగా చెల్లించండి!",
            "rationale": "వారాంతపు పెద్ద ఆర్డర్ల కోసం కస్టమర్లను ప్రోత్సహించే ఆఫర్.",
            "timing": "శనివారం ఉదయం 9:00 గంటలకు",
            "est_reach": 120,
            "est_conv": "20% - 28% (24 నుండి 34 ఆర్డర్లు)"
        },
        "PRODUCT_PROMOTION": {
            "title": "తాజా పనీర్ మరియు డైరీ ఉదయపు ఆఫర్",
            "message": "శుభోదయం! శర్మ జనరల్ స్టోర్‌లో తాజా అమూల్ పనీర్ మరియు డెయిరీ ఉత్పత్తులపై ఉదయం 11 గంటల లోపు 10% తగ్గింపు లభించును. పేటీఎం క్యూఆర్ ద్వారా క్షణాల్లో చెల్లించండి!",
            "rationale": "ఉదయపు వేళల్లో డైరీ ఉత్పత్తుల అమ్మకాలను పెంచడానికి అనుకూలం.",
            "timing": "ఉదయం 8:00 గంటలకు",
            "est_reach": 95,
            "est_conv": "25% - 35% (24 నుండి 33 ప్యాకెట్లు)"
        }
    }
}

def generate_campaign_draft(
    objective: str = "WIN_BACK_INACTIVE",
    audience_segment: str = "Inactive Customers (Last 14+ Days)",
    offer_type: str = "FLAT_DISCOUNT",
    language: str = "en",
    channel: str = "WhatsApp"
) -> Dict[str, Any]:
    lang_key = language if language in ["en", "hi", "te"] else "en"
    obj_key = objective if objective in TEMPLATES[lang_key] else "WIN_BACK_INACTIVE"

    tpl = TEMPLATES[lang_key][obj_key]

    campaign_id = f"CMP_{uuid.uuid4().hex[:6].upper()}"

    return {
        "id": campaign_id,
        "name": tpl["title"],
        "objective": objective,
        "audience_segment": audience_segment,
        "offer_type": offer_type,
        "channel": channel,
        "language": lang_key,
        "message_copy": tpl["message"],
        "offer_details": f"Offer matching objective '{objective}' for {audience_segment}",
        "suggested_timing": tpl["timing"],
        "rationale": tpl["rationale"],
        "target_customer_count": tpl["est_reach"],
        "estimated_conversion_estimate": tpl["est_conv"],
        "status": "DRAFT",
        "created_at": datetime.now().isoformat(),
        "disclaimer": "Draft copy generated for merchant review. Label: Simulation Mode. No real SMS/WhatsApp messages will be transmitted."
    }

def list_campaigns() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM campaigns ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r["id"],
            "name": r["name"],
            "objective": r["objective"],
            "audience_segment": r["audience_segment"],
            "offer_type": r["offer_type"],
            "channel": r["channel"],
            "language": r["language"],
            "message_copy": r["message_copy"],
            "offer_details": r["offer_details"],
            "suggested_timing": r["suggested_timing"],
            "rationale": r["rationale"],
            "status": r["status"],
            "target_customer_count": r["target_customer_count"],
            "created_at": r["created_at"]
        })
    return result

def save_campaign(campaign_data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()

    cid = campaign_data.get("id") or f"CMP_{uuid.uuid4().hex[:6].upper()}"
    name = campaign_data.get("name", "Untitled Campaign")
    objective = campaign_data.get("objective", "General Promotion")
    audience = campaign_data.get("audience_segment", "All Regular Customers")
    offer_type = campaign_data.get("offer_type", "Standard Discount")
    channel = campaign_data.get("channel", "WhatsApp")
    language = campaign_data.get("language", "en")
    message = campaign_data.get("message_copy", "")
    offer_details = campaign_data.get("offer_details", "")
    timing = campaign_data.get("suggested_timing", "Immediate")
    rationale = campaign_data.get("rationale", "Generated by Dukaan Saathi AI")
    status = campaign_data.get("status", "ACTIVE")
    target_count = campaign_data.get("target_customer_count", 35)
    created_at = campaign_data.get("created_at") or datetime.now().isoformat()

    cursor.execute("""
        INSERT OR REPLACE INTO campaigns (
            id, name, objective, audience_segment, offer_type, channel, language,
            message_copy, offer_details, suggested_timing, rationale, status,
            target_customer_count, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        cid, name, objective, audience, offer_type, channel, language,
        message, offer_details, timing, rationale, status,
        target_count, created_at
    ))

    conn.commit()
    conn.close()

    return {"success": True, "id": cid, "message": f"Campaign '{name}' saved successfully to persistent demo storage."}

def delete_campaign(campaign_id: str) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM campaigns WHERE id = ?", (campaign_id,))
    conn.commit()
    conn.close()
    return {"success": True, "id": campaign_id, "message": "Campaign removed."}
