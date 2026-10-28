import unittest
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.data.database import init_db
from backend.data.generator import generate_synthetic_data
from backend.services.analytics import (
    get_dashboard_summary,
    compare_sales_periods,
    get_customer_insights,
    get_category_performance,
    get_peak_hours
)
from backend.services.inventory_service import get_inventory_status, simulate_reorder
from backend.services.copilot_service import run_copilot_query
from backend.services.campaign_service import generate_campaign_draft, save_campaign, list_campaigns

class TestDukaanSaathi(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        generate_synthetic_data(num_days=90, force=False)

    def test_dashboard_summary(self):
        summary = get_dashboard_summary("7d")
        self.assertGreater(summary["total_sales"], 10000)
        self.assertGreater(summary["transaction_count"], 100)
        self.assertGreater(summary["average_order_value"], 50)
        self.assertGreater(summary["repeat_customer_rate"], 30.0)

    def test_seeded_dip_detection(self):
        comparison = compare_sales_periods("2026-10-21", "2026-10-28", "2026-10-14", "2026-10-21")
        # Verify weekly sales decreased as seeded in synthetic data
        self.assertLess(comparison["sales_growth_pct"], 0)
        self.assertIsNotNone(comparison["primary_contributor_drop"])

    def test_customer_insights_rfm(self):
        insights = get_customer_insights("30d")
        self.assertGreater(insights["metrics"]["total_tracked_customers"], 50)
        self.assertGreater(insights["metrics"]["at_risk_inactive"], 10)
        self.assertGreater(len(insights["inactive_customers"]), 5)

    def test_inventory_velocity_and_reorder(self):
        inv = get_inventory_status()
        self.assertGreater(len(inv), 10)
        # Check critical item
        crit_items = [i for i in inv if i["priority"] == "CRITICAL"]
        self.assertGreater(len(crit_items), 0)

        # Test simulated reorder
        test_sku = crit_items[0]["sku"]
        old_stock = crit_items[0]["current_stock"]
        reorder_res = simulate_reorder(test_sku, quantity=25)
        self.assertTrue(reorder_res["success"])
        self.assertEqual(reorder_res["new_stock"], old_stock + 25)

    def test_copilot_queries_multilingual(self):
        # 1. English sales decrease query
        res_en = run_copilot_query("Why did my sales decrease this week?", "en")
        self.assertEqual(res_en["tool_called"], "compare_sales_periods")
        self.assertIn("decreased", res_en["answer"].lower())

        # 2. Hindi inquiry
        res_hi = run_copilot_query("बिक्री क्यों कम हुई?", "hi")
        self.assertEqual(res_hi["language"], "hi")
        self.assertIn("गिरावट", res_hi["answer"])

        # 3. Telugu inquiry
        res_te = run_copilot_query("విక్రయాలు ఎందుకు తగ్గాయి?", "te")
        self.assertEqual(res_te["language"], "te")
        self.assertIn("తగ్గాయి", res_te["answer"])

        # 4. Inventory inquiry
        res_inv = run_copilot_query("What should I stock more of?", "en")
        self.assertEqual(res_inv["tool_called"], "get_inventory_recommendations")

        # 5. Customer retention inquiry
        res_cust = run_copilot_query("How can I bring back inactive customers?", "en")
        self.assertEqual(res_cust["tool_called"], "get_customer_insights")

    def test_campaign_creation_and_persistence(self):
        draft = generate_campaign_draft(
            objective="EVENING_FOOTFALL_BOOST",
            audience_segment="Evening Footfall Shoppers (85 customers)",
            offer_type="COMBO_DEAL",
            language="hi",
            channel="WhatsApp"
        )
        self.assertIn("शाम", draft["message_copy"])

        # Save to DB
        save_res = save_campaign(draft)
        self.assertTrue(save_res["success"])

        # Verify listed
        campaigns = list_campaigns()
        saved_ids = [c["id"] for c in campaigns]
        self.assertIn(draft["id"], saved_ids)

if __name__ == "__main__":
    unittest.main()
