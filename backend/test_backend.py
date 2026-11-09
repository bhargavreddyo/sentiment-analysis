import sys
import unittest
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from main import app, model_service


class TestSentimentAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Using context manager on TestClient triggers lifespan (model loading once)
        cls.client_context = TestClient(app)
        cls.client = cls.client_context.__enter__()

    @classmethod
    def tearDownClass(cls):
        cls.client_context.__exit__(None, None, None)

    def test_01_health_check(self):
        """GET /api/health returns 200, healthy status, and model info."""
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertTrue(data.get("model_loaded"))
        self.assertIn("negative", data.get("labels"))
        self.assertIn("neutral", data.get("labels"))
        self.assertIn("positive", data.get("labels"))
        print("\n[PASS] Health check verified:", data)

    def test_02_predict_positive(self):
        """POST /api/predict correctly classifies positive sentiment."""
        payload = {"text": "I absolutely love this product! It is fantastic and exceeded all expectations."}
        response = self.client.post("/api/predict", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["label"], "positive")
        self.assertGreater(data["confidence"], 0.8)
        self.assertIn("negative", data["scores"])
        self.assertIn("neutral", data["scores"])
        self.assertIn("positive", data["scores"])
        self.assertAlmostEqual(sum(data["scores"].values()), 1.0, places=2)
        print(f"\n[PASS] Positive class verified -> Label: {data['label']}, Confidence: {data['confidence']:.4f}, Scores: {data['scores']}")

    def test_03_predict_neutral(self):
        """POST /api/predict correctly classifies neutral sentiment."""
        payload = {"text": "The delivery package was received yesterday afternoon around 3 PM."}
        response = self.client.post("/api/predict", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["label"], "neutral")
        self.assertGreater(data["confidence"], 0.8)
        self.assertIn("negative", data["scores"])
        self.assertIn("neutral", data["scores"])
        self.assertIn("positive", data["scores"])
        self.assertAlmostEqual(sum(data["scores"].values()), 1.0, places=2)
        print(f"\n[PASS] Neutral class verified -> Label: {data['label']}, Confidence: {data['confidence']:.4f}, Scores: {data['scores']}")

    def test_04_predict_negative(self):
        """POST /api/predict correctly classifies negative sentiment."""
        payload = {"text": "Terrible customer service, the device arrived broken and useless. I hate it."}
        response = self.client.post("/api/predict", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["label"], "negative")
        self.assertGreater(data["confidence"], 0.8)
        self.assertIn("negative", data["scores"])
        self.assertIn("neutral", data["scores"])
        self.assertIn("positive", data["scores"])
        self.assertAlmostEqual(sum(data["scores"].values()), 1.0, places=2)
        print(f"\n[PASS] Negative class verified -> Label: {data['label']}, Confidence: {data['confidence']:.4f}, Scores: {data['scores']}")

    def test_05_predict_validation_errors(self):
        """POST /api/predict handles empty or blank text properly with HTTP 400."""
        # Empty string
        res1 = self.client.post("/api/predict", json={"text": ""})
        self.assertEqual(res1.status_code, 400)

        # Whitespace string
        res2 = self.client.post("/api/predict", json={"text": "    "})
        self.assertEqual(res2.status_code, 400)

        # Missing field
        res3 = self.client.post("/api/predict", json={})
        self.assertEqual(res3.status_code, 422)
        print("\n[PASS] Validation errors verified for /api/predict.")

    def test_06_predict_batch_dict_format(self):
        """POST /api/predict/batch with {'texts': [...]} classifying multiple sentiments."""
        payload = {
            "texts": [
                "I absolutely love this product! It is fantastic and exceeded all expectations.",
                "The delivery package was received yesterday afternoon around 3 PM.",
                "Terrible customer service, the device arrived broken and useless. I hate it."
            ]
        }
        response = self.client.post("/api/predict/batch", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["total"], 3)
        self.assertEqual(len(data["predictions"]), 3)
        self.assertEqual(data["predictions"][0]["label"], "positive")
        self.assertEqual(data["predictions"][1]["label"], "neutral")
        self.assertEqual(data["predictions"][2]["label"], "negative")
        print("\n[PASS] Batch predictions verified (dict payload):")
        for pred in data["predictions"]:
            print(f"  - [{pred['label'].upper()}] (conf: {pred['confidence']:.4f}) -> '{pred['text'][:50]}...'")

    def test_07_predict_batch_list_format(self):
        """POST /api/predict/batch with raw list of texts [...] format."""
        payload = [
            "Great experience, highly recommend!",
            "Standard delivery time was three days."
        ]
        response = self.client.post("/api/predict/batch", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["total"], 2)
        self.assertEqual(len(data["predictions"]), 2)
        self.assertEqual(data["predictions"][0]["label"], "positive")
        self.assertEqual(data["predictions"][1]["label"], "neutral")
        print("\n[PASS] Batch predictions verified (direct list payload).")

    def test_08_batch_validation_errors(self):
        """POST /api/predict/batch handles empty list and blank items properly."""
        # Empty list in dict
        res1 = self.client.post("/api/predict/batch", json={"texts": []})
        self.assertEqual(res1.status_code, 400)

        # Empty raw list
        res2 = self.client.post("/api/predict/batch", json=[])
        self.assertEqual(res2.status_code, 400)

        # List containing empty string
        res3 = self.client.post("/api/predict/batch", json={"texts": ["Valid text", "  "]})
        self.assertEqual(res3.status_code, 400)
        print("\n[PASS] Batch validation errors verified.")

    def test_09_cors_headers(self):
        """CORS headers are returned on cross-origin requests."""
        headers = {"Origin": "http://localhost:3000"}
        response = self.client.get("/api/health", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers.get("access-control-allow-origin"), "*")
        print("\n[PASS] CORS headers verified.")


if __name__ == "__main__":
    unittest.main()
