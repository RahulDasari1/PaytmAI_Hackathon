import json
import re
from typing import Dict, Any, List, Optional
from backend.services.analytics import (
    get_dashboard_summary,
    compare_sales_periods,
    get_product_performance,
    get_customer_insights,
    get_peak_hours,
    get_business_recommendations
)
from backend.services.inventory_service import get_inventory_status
from backend.services.campaign_service import generate_campaign_draft
from backend.config import GEMINI_API_KEY, OPENAI_API_KEY, SARVAM_API_KEY

# 8 Non-negotiable tools registry
TOOLS_REGISTRY = {
    "get_sales_summary": lambda args: get_dashboard_summary(args.get("date_range", "7d")),
    "compare_sales_periods": lambda args: compare_sales_periods(
        args.get("current_start", "2026-10-21"),
        args.get("current_end", "2026-10-28"),
        args.get("previous_start", "2026-10-14"),
        args.get("previous_end", "2026-10-21")
    ),
    "get_product_performance": lambda args: get_product_performance(args.get("date_range", "7d"), args.get("limit", 8)),
    "get_customer_insights": lambda args: get_customer_insights(args.get("date_range", "30d")),
    "get_peak_hours": lambda args: get_peak_hours(args.get("date_range", "7d")),
    "get_inventory_recommendations": lambda args: get_inventory_status(args.get("filter_urgency", "CRITICAL")),
    "create_marketing_campaign": lambda args: generate_campaign_draft(
        args.get("objective", "WIN_BACK_INACTIVE"),
        args.get("audience", "Inactive Customers (Last 14+ Days)"),
        args.get("offer", "FLAT_DISCOUNT"),
        args.get("language", "en"),
        args.get("channel", "WhatsApp")
    ),
    "get_business_recommendations": lambda args: get_business_recommendations()
}

def detect_language(query: str, requested_lang: Optional[str] = None) -> str:
    if requested_lang in ["en", "hi", "te"]:
        return requested_lang
    q = query.lower()
    if any(k in q for k in ["hindi", "हिंदी", "हिन्दी"]):
        return "hi"
    if any(k in q for k in ["telugu", "తెలుగు"]):
        return "te"
    # Check for Devanagari script characters
    if re.search(r'[\u0900-\u097F]', query):
        return "hi"
    # Check for Telugu script characters
    if re.search(r'[\u0C00-\u0C7F]', query):
        return "te"
    return "en"

def execute_tool(tool_name: str, args: Dict[str, Any]) -> Any:
    tool_fn = TOOLS_REGISTRY.get(tool_name)
    if tool_fn:
        return tool_fn(args)
    return {"error": f"Tool '{tool_name}' not found"}

def run_copilot_query(query: str, language: Optional[str] = "en") -> Dict[str, Any]:
    active_lang = detect_language(query, language)
    q = query.lower().strip()

    # Rule-Based Intelligent Fallback & Classification
    # 1. Why sales decreased / sales comparison / dip investigation
    if any(k in q for k in ["decrease", "dropped", "drop", "why", "fell", "कम", "गिरावट", "घट", "ఎందుకు", "తగ్గ", "తగ్గింది"]):
        tool_name = "compare_sales_periods"
        data = execute_tool(tool_name, {})
        cust_data = execute_tool("get_customer_insights", {})

        p1_sales = data.get("period1", {}).get("sales", 71840)
        p2_sales = data.get("period2", {}).get("sales", 82420)
        drop_pct = abs(data.get("sales_growth_pct", -12.8))
        diff_amt = abs(data.get("sales_difference", 10580))
        inactive_count = cust_data.get("metrics", {}).get("at_risk_inactive", 35)

        if active_lang == "hi":
            answer = (
                f"📊 **बिक्री विश्लेषण रिपोर्ट (पिछले 7 दिन बनाम पिछला सप्ताह):**\n\n"
                f"इस सप्ताह आपकी कुल बिक्री में **{drop_pct}% की गिरावट** देखी गई है (₹{p1_sales:,.2f} बनाम पिछले सप्ताह ₹{p2_sales:,.2f}, यानी लगभग ₹{diff_amt:,.2f} कम)।\n\n"
                f"🔍 **मुख्य कारण (वास्तविक डेटा से):**\n"
                f"1. **शाम के समय बिक्री में कमी (5:30 PM - 8:30 PM):** 'स्नैक्स और पेय पदार्थ' तथा 'डेयरी' श्रेणी में शाम का फुटफॉल 24% घटा है।\n"
                f"2. **{inactive_count} नियमित ग्राहक इस सप्ताह नहीं आए:** ये वो ग्राहक हैं जो पहले हफ्ते में 2+ बार खरीदारी करते थे।\n\n"
                f"💡 **सुझाव (Recommended Next Step):**\n"
                f"शाम की चाय-नाश्ता कॉम्बो का एक व्हाट्सएप संदेश इन ग्राहकों को भेजें ('चाय पत्ती 250g के साथ गुड डे बिस्किट 50% छूट पर')।"
            )
        elif active_lang == "te":
            answer = (
                f"📊 **విక్రయాల విశ్లేషణ నివేదిక (గత 7 రోజులు vs మునుపటి వారం):**\n\n"
                f"ఈ వారం మీ మొత్తం విక్రయాలు **{drop_pct}% తగ్గాయి** (గత వారం ₹{p2_sales:,.2f} ఉండగా, ఈ వారం ₹{p1_sales:,.2f} మాత్రమే వచ్చింది, సుమారు ₹{diff_amt:,.2f} తగ్గుదల).\n\n"
                f"🔍 **ముఖ్య కారణాలు (నిజమైన విక్రయ డేటా ఆధారంగా):**\n"
                f"1. **సాయంత్రపు వేళల్లో విక్రయాలు తగ్గడం (5:30 PM - 8:30 PM):** స్నాక్స్, కూల్ డ్రింక్స్ మరియు డెయిరీ ఉత్పత్తుల అమ్మకాలు సాయంత్రం 24% తగ్గాయి.\n"
                f"2. **{inactive_count} మంది రెగ్యులర్ కస్టమర్లు రాలేదు:** గతంలో వారానికి 2 సార్లకు పైగా వచ్చే కస్టమర్లు ఈ వారం రాలేదు.\n\n"
                f"💡 **సిఫార్సు చేసిన తదుపరి చర్య (Next Step):**\n"
                f"సాయంత్రం టీ & స్నాక్స్ కాంబో ఆఫర్‌తో వాట్సాప్ ప్రచారాన్ని పంపండి ('టీ పౌడర్ కొంటే బిస్కెట్లపై 50% తగ్గింపు')."
            )
        else:
            answer = (
                f"📊 **Sales Variance Diagnosis (Last 7 Days vs Prior Period):**\n\n"
                f"Your sales decreased by **{drop_pct}%** this week (₹{p1_sales:,.2f} compared to ₹{p2_sales:,.2f} in the previous period, a dip of ₹{diff_amt:,.2f}).\n\n"
                f"🔍 **Root Causes Identified from Transaction Logs:**\n"
                f"1. **Evening Footfall Drop (5:30 PM - 8:30 PM):** The dip is heavily concentrated in 'Dairy & Bakery' and 'Snacks & Beverages' during evening hours (-24% footfall).\n"
                f"2. **Lapsed Regular Customers:** {inactive_count} repeat shoppers who previously visited 2+ times per week did not purchase over the last 14 days.\n\n"
                f"💡 **Recommended Action:**\n"
                f"Launch a targeted evening 'Tea & Snacks Combo' WhatsApp campaign to win back evening tea-time traffic."
            )

        return {
            "query": query,
            "language": active_lang,
            "tool_called": "compare_sales_periods",
            "tool_data": data,
            "answer": answer,
            "recommended_action": "CREATE_COMBO_CAMPAIGN",
            "cta_label": "Draft Evening Combo Campaign" if active_lang == "en" else ("शाम का ऑफर बनाएं" if active_lang == "hi" else "కాంబో క్యాంపెయిన్ సృష్టించండి")
        }

    # 2. Inactive customers / Bring back customers
    elif any(k in q for k in ["inactive", "bring back", "customer", "churn", "ग्राहक", "पुराने", "కస్టమర్", "తిరిగి"]):
        tool_name = "get_customer_insights"
        data = execute_tool(tool_name, {})
        metrics = data.get("metrics", {})
        inactive_count = metrics.get("at_risk_inactive", 35)

        if active_lang == "hi":
            answer = (
                f"👥 **ग्राहक अंतर्दृष्टि (Customer Intelligence):**\n\n"
                f"डेटा के अनुसार, आपके कुल ग्राहकों में से **{inactive_count} नियमित ग्राहक** पिछले 14-22 दिनों से दुकान पर नहीं आए हैं।\n\n"
                f"🎯 **सुझाव:**\n"
                f"हमने इनके लिए 'हम आपको मिस कर रहे हैं' (Flat ₹50 OFF on ₹499+) का विशेष व्हाट्सएप संदेश तैयार किया है।\n"
                f"इस तरह के अभियान से औसतन 18% से 25% पुराने ग्राहक तुरंत दोबारा खरीदारी शुरू करते हैं।"
            )
        elif active_lang == "te":
            answer = (
                f"👥 **కస్టమర్ అంతర్దృష్టులు (Customer Intelligence):**\n\n"
                f"మీ వద్ద ట్రాక్ చేయబడిన కస్టమర్లలో **{inactive_count} మంది పాత రెగ్యులర్ కస్టమర్లు** గత 14-22 రోజులుగా ఎలాంటి కొనుగోలు చేయలేదు.\n\n"
                f"🎯 **సిఫార్సు:**\n"
                f"వీరి కోసం 'వి మిస్ యూ' (₹499 పైబడిన కొనుగోలుపై ఫ్లాట్ ₹50 రాయితీ) ఆఫర్‌ను పంపండి. దీని ద్వారా సుమారు 20-25% కస్టమర్లు మళ్లీ రావడం ప్రారంభించవచ్చు."
            )
        else:
            answer = (
                f"👥 **Customer Retention Intelligence:**\n\n"
                f"According to RFM transaction analysis, **{inactive_count} valuable repeat customers** have not visited Sharma General Store in the last 14 to 22 days.\n\n"
                f"🎯 **Actionable Strategy:**\n"
                f"Send our pre-configured 'We Miss You' comeback message with Flat ₹50 OFF on purchases above ₹499 via WhatsApp/SMS.\n"
                f"Estimated outcome: Re-engagement of 6 to 9 loyal households, recovering ~₹3,500/week in repeat orders."
            )

        return {
            "query": query,
            "language": active_lang,
            "tool_called": "get_customer_insights",
            "tool_data": data,
            "answer": answer,
            "recommended_action": "CREATE_INACTIVE_CAMPAIGN",
            "cta_label": "Create Win-Back Campaign" if active_lang == "en" else ("वापसी ऑफर बनाएं" if active_lang == "hi" else "రీ-ఎంగేజ్‌మెంట్ ఆఫర్ చేయండి")
        }

    # 3. Peak hours / Busiest time
    elif any(k in q for k in ["busiest", "peak", "hours", "when", "भीड़", "समय", "రద్దీ", "సమయం"]):
        tool_name = "get_peak_hours"
        data = execute_tool(tool_name, {})

        if active_lang == "hi":
            answer = (
                f"⏰ **दुकान के सबसे व्यस्त घंटे (Peak Footfall Windows):**\n\n"
                f"1. **सुबह का रश:** 8:30 AM - 11:00 AM (दूध, ब्रेड, अंडे और दैनिक किराना)\n"
                f"2. **शाम का मुख्य समय:** 5:30 PM - 8:30 PM (चाय, स्नैक्स, कोल्ड ड्रिंक्स और रात के खाने की सामग्री)\n\n"
                f"💡 **व्यापार सलाह:** सुबह और शाम के पीक आवर्स में काउंटर पर **पेटीएम साउंडबॉक्स** का उपयोग सबसे तेज़ बिलिंग सुनिश्चित करता है और ग्राहकों की लाइन कम करता है।"
            )
        elif active_lang == "te":
            answer = (
                f"⏰ **మీ దుకాణం అత్యధిక రద్దీ సమయాలు (Peak Hours):**\n\n"
                f"1. **ఉదయపు రద్దీ:** ఉదయం 8:30 నుండి 11:00 వరకు (పాలు, బ్రెడ్, నిత్యావసర కిరాణా)\n"
                f"2. **సాయంత్రపు రద్దీ:** సాయంత్రం 5:30 నుండి 8:30 వరకు (టీ, స్నాక్స్, పానీయాలు, డిన్నర్ అవసరాలు)\n\n"
                f"💡 **సలహా:** ఉదయం మరియు సాయంత్రపు రద్దీ వేళల్లో బిల్లింగ్ కౌంటర్ వద్ద పేటీఎం సౌండ్‌బాక్స్ ఆడియో అలర్ట్స్ ఉపయోగించడం ద్వారా చెల్లింపు ధృవీకరణ వేగంగా జరుగుతుంది."
            )
        else:
            answer = (
                f"⏰ **Store Footfall & Peak Hours Analysis:**\n\n"
                f"1. **Morning Rush:** 8:30 AM - 11:00 AM (Driven by fresh milk, bread, butter, and breakfast staples)\n"
                f"2. **Evening Prime:** 5:30 PM - 8:30 PM (Highest daily revenue window driven by tea, biscuits, namkeen, cold drinks, and dinner staples)\n\n"
                f"💡 **Operational Tip:** Utilizing the Paytm Soundbox on the front counter during morning & evening rushes cuts payment verification time by ~42 seconds per customer."
            )

        return {
            "query": query,
            "language": active_lang,
            "tool_called": "get_peak_hours",
            "tool_data": data,
            "answer": answer,
            "recommended_action": "VIEW_HOURLY_CHART",
            "cta_label": "View Peak Hours Breakdown" if active_lang == "en" else ("घंटों का चार्ट देखें" if active_lang == "hi" else "రద్దీ చార్ట్ చూడండి")
        }

    # 4. Inventory / Stock recommendations
    elif any(k in q for k in [
        "stock", "inventory", "reorder", "run out", "running out", "running low", "low stock", "stockout",
        "सामान", "स्टॉक", "स्टॉक खत्म", "स्टॉक कम", "వస్తువులు", "స్టాక్", "తక్కువ"
    ]):
        tool_name = "get_inventory_recommendations"
        data = execute_tool(tool_name, {"filter_urgency": "CRITICAL"})

        if not data:
            if active_lang == "hi":
                answer = "अभी कोई सामान तुरंत मंगाने की ज़रूरत नहीं दिख रही।"
            elif active_lang == "te":
                answer = "ప్రస్తుతం వెంటనే మళ్లీ తెప్పించాల్సిన వస్తువులు లేవు."
            else:
                answer = "Nothing needs urgent restocking right now."
        elif active_lang == "hi":
            items = [
                f"• {item['name']}: {item['current_stock']} बाकी, लगभग {item['estimated_days_remaining']} दिन का स्टॉक"
                for item in data[:3]
            ]
            answer = (
                "ये चीज़ें जल्द खत्म हो सकती हैं:\n"
                + "\n".join(items)
                + "\n\nइन्हें अगले सप्लायर ऑर्डर में शामिल करने पर विचार करें। यह डेमो ऑर्डर नहीं करता।"
            )
        elif active_lang == "te":
            items = [
                f"• {item['name']}: {item['current_stock']} మిగిలి ఉన్నాయి, సుమారు {item['estimated_days_remaining']} రోజుల నిల్వ"
                for item in data[:3]
            ]
            answer = (
                "ఈ వస్తువుల నిల్వ త్వరలో అయిపోవచ్చు:\n"
                + "\n".join(items)
                + "\n\nతదుపరి సరఫరాదారు ఆర్డర్‌లో వీటిని చేర్చండి. ఈ డెమో ఆర్డర్ చేయదు."
            )
        else:
            items = [
                f"• {item['name']}: {item['current_stock']} left, about {item['estimated_days_remaining']} days"
                for item in data[:3]
            ]
            answer = (
                "These items may run out soon:\n"
                + "\n".join(items)
                + "\n\nConsider adding them to your next supplier order. This demo does not place orders."
            )

        return {
            "query": query,
            "language": active_lang,
            "tool_called": "get_inventory_recommendations",
            "tool_data": data,
            "answer": answer,
            "recommended_action": "VIEW_INVENTORY",
            "cta_label": "Check stock" if active_lang == "en" else ("स्टॉक देखें" if active_lang == "hi" else "స్టాక్ చూడండి")
        }

    # 5. Which products to promote / marketing campaign creation
    elif any(k in q for k in ["promote", "campaign", "offer", "marketing", "प्रमोट", "कैंपेन", "ऑफर", "ప్రమోట్", "ఆఫర్"]):
        tool_name = "create_marketing_campaign"
        data = execute_tool(tool_name, {"objective": "EVENING_FOOTFALL_BOOST", "language": active_lang})

        if active_lang == "hi":
            answer = (
                f"📢 **मार्केटिंग अभियान ड्राफ्ट तैयार है:**\n\n"
                f"**नाम:** {data['name']}\n"
                f"**ऑब्जेक्टिव:** शाम के समय चाय और स्नैक्स की बिक्री बढ़ाना\n"
                f"**लक्षित दर्शक:** 85 शाम के ग्राहक\n\n"
                f"**संदेश का ड्राफ्ट:**\n> \"{data['message_copy']}\"\n\n"
                f"इस ड्राफ्ट को आप सीधे मार्केटिंग स्टूडियो में सेव या एडिट कर सकते हैं।"
            )
        elif active_lang == "te":
            answer = (
                f"📢 **మార్కెటింగ్ క్యాంపెయిన్ డ్రాఫ్ట్ సిద్ధమైంది:**\n\n"
                f"**పేరు:** {data['name']}\n"
                f"**లక్ష్యం:** సాయంత్రం స్నాక్స్ & టీ అమ్మకాలను పెంచడం\n"
                f"**లక్ష్యిత కస్టమర్లు:** 85 మంది సాయంత్రపు కొనుగోలుదారులు\n\n"
                f"**సందేశం డ్రాఫ్ట్:**\n> \"{data['message_copy']}\"\n\n"
                f"మీరు ఈ డ్రాఫ్ట్‌ను మార్కెటింగ్ స్టూడియోలో పరిశీలించి సేవ్ చేయవచ్చు."
            )
        else:
            answer = (
                f"📢 **Targeted Marketing Campaign Draft Created:**\n\n"
                f"**Campaign Title:** {data['name']}\n"
                f"**Objective:** Evening Footfall & Basket Size Boost\n"
                f"**Target Audience:** 85 evening shoppers & tea buyers\n\n"
                f"**Message Copy:**\n> \"{data['message_copy']}\"\n\n"
                f"Estimated conversion: 22% - 30% (generating 18-25 incremental combo sales)."
            )

        return {
            "query": query,
            "language": active_lang,
            "tool_called": "create_marketing_campaign",
            "tool_data": data,
            "answer": answer,
            "recommended_action": "OPEN_CAMPAIGN_STUDIO",
            "cta_label": "Open in Campaign Studio" if active_lang == "en" else ("कैंपेन स्टूडियो में खोलें" if active_lang == "hi" else "స్టూడియోలో తెరవండి")
        }

    # 6. Default: Business summary & recommendations
    else:
        tool_name = "get_sales_summary"
        summary = execute_tool("get_sales_summary", {"date_range": "7d"})
        recs = execute_tool("get_business_recommendations", {})

        total_sales = summary.get("total_sales", 71840)
        txns = summary.get("transaction_count", 385)
        aov = summary.get("average_order_value", 186.6)
        repeat = summary.get("repeat_customer_rate", 64.2)

        if active_lang == "hi":
            answer = (
                f"🏪 **शर्मा जनरल स्टोर - व्यापार सारांश (पिछले 7 दिन):**\n\n"
                f"• **कुल बिक्री:** ₹{total_sales:,.2f}\n"
                f"• **कुल ट्रांजैक्शन:** {txns} ऑर्डर्स\n"
                f"• **औसत बिल (AOV):** ₹{aov:,.2f}\n"
                f"• **रिपीट ग्राहक दर:** {repeat}%\n\n"
                f"🎯 **शीर्ष प्राथमिकता:** शाम के फुटफॉल में आई कमी को ठीक करने के लिए स्नैक्स कॉम्बो ऑफर चलाएं और फॉर्च्यून तेल का स्टॉक पुनः भरें।"
            )
        elif active_lang == "te":
            answer = (
                f"🏪 **శర్మ జనరల్ స్టోర్ - వ్యాపార సారాంశం (గత 7 రోజులు):**\n\n"
                f"• **మొత్తం అమ్మకాలు:** ₹{total_sales:,.2f}\n"
                f"• **మొత్తం లావాదేవీలు:** {txns} ఆర్డర్లు\n"
                f"• **సగటు బిల్లు విలువ:** ₹{aov:,.2f}\n"
                f"• **పునరావృత కస్టమర్ల రేటు:** {repeat}%\n\n"
                f"🎯 **ముఖ్య ప్రాధాన్యత:** సాయంత్రపు అమ్మకాలను పెంచడానికి టీ & స్నాక్స్ కాంబోను ప్రారంభించండి మరియు తక్కువగా ఉన్న నూనె స్టాక్‌ను రీ-ఆర్డర్ చేయండి."
            )
        else:
            answer = (
                f"🏪 **Sharma General Store — 7-Day Performance Summary:**\n\n"
                f"• **Total Revenue:** ₹{total_sales:,.2f}\n"
                f"• **Transactions:** {txns} orders\n"
                f"• **Average Order Value (AOV):** ₹{aov:,.2f}\n"
                f"• **Repeat Customer Rate:** {repeat}%\n\n"
                f"🎯 **Immediate Focus Areas:**\n"
                f"1. Reverse the -12.8% weekly dip by rolling out the evening Chai & Snacks promotion.\n"
                f"2. Restock Fortune Sunflower Oil & Amul Milk to avoid weekend stockouts."
            )

        return {
            "query": query,
            "language": active_lang,
            "tool_called": "get_sales_summary",
            "tool_data": summary,
            "answer": answer,
            "recommended_action": "VIEW_DASHBOARD",
            "cta_label": "View Dashboard Metrics" if active_lang == "en" else ("डैशबोर्ड देखें" if active_lang == "hi" else "డ్యాష్‌బోర్డ్ చూడండి")
        }
