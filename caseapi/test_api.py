"""
Simple test script for the Legal Case Analysis API
"""
import requests
import json

BASE_URL = "http://localhost:8000"

# Test case data
test_case = {
    "user": "Dave Wang",
    "email": "wang.dave@gmail.com",
    "opposing_party": "EK Inc",
    "estimated_damage": "20000$",
    "case_description": "they owe me money and has not paid for 3 years",
    "evidence_available": "yes",
    "case_type": "contract dispute",
    "jurisdiction": "California"
}

def test_health():
    """Test the health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_analyze():
    """Test the analyze endpoint"""
    print("Testing analyze endpoint...")
    response = requests.post(
        f"{BASE_URL}/api/v1/analyze",
        json=test_case
    )
    print(f"Status: {response.status_code}")

    if response.status_code == 200:
        result = response.json()
        print("\n=== ANALYSIS REPORT ===")
        print(f"Case ID: {result['case_id']}")
        print(f"Win Probability: {result['win_probability']}%")
        print(f"Merit Score: {result['merit_score']}/10")
        print(f"\nCase Summary:\n{result['case_summary']}")
        print(f"\nKey Strengths:")
        for strength in result['key_strengths']:
            print(f"  - {strength}")
        print(f"\nKey Weaknesses:")
        for weakness in result['key_weaknesses']:
            print(f"  - {weakness}")
        print(f"\nRecommended Actions:")
        for action in result['recommended_actions']:
            print(f"  - {action}")
        print(f"\nEstimated Timeline: {result['estimated_timeline']}")
        print(f"Estimated Costs: {result['estimated_costs']}")
    else:
        print(f"Error: {response.text}")
    print()

if __name__ == "__main__":
    test_health()
    test_analyze()
