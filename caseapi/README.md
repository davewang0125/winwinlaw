# Legal Case Analysis API

A FastAPI-based REST API that analyzes legal cases using OpenAI's GPT models to generate comprehensive preliminary assessments for potential clients.

## Features

- **Case Intake**: Accept detailed case information through structured JSON
- **AI-Powered Analysis**: Leverage OpenAI GPT models with specialized legal prompts
- **Comprehensive Reports**: Generate detailed reports including:
  - Legal assessment and case summary
  - Merit score (0-10) and win probability (0-100%)
  - Key strengths and weaknesses
  - Recommended actions
  - Timeline and cost estimates
  - Jurisdiction-specific notes
  - Additional evidence recommendations
- **Batch Processing**: Analyze multiple cases in a single request
- **CORS Enabled**: Ready for frontend integration

## Project Structure

```
caseapi/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI application and endpoints
│   ├── models.py         # Pydantic models for request/response
│   ├── services.py       # OpenAI integration and analysis logic
│   ├── prompts.py        # Legal analysis prompts
│   └── config.py         # Configuration and settings
├── case_example.json     # Example case data
├── requirements.txt      # Python dependencies
├── .env.example          # Environment variables template
├── .gitignore
└── README.md
```

## Setup

### 1. Install Dependencies

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Note for Apple Silicon (M1/M2/M3) users:** If you encounter architecture errors, ensure you're using native ARM64 Python, not Rosetta.

### 2. Configure Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

### 3. Run the API

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /health
```

### Analyze Single Case
```
POST /api/v1/analyze
Content-Type: application/json

{
  "user": "Dave Wang",
  "email": "wang.dave@gmail.com",
  "opposing_party": "EK Inc",
  "estimated_damage": "20000$",
  "case_description": "they owe me money and has not paid for 3 years",
  "evidence_available": "yes",
  "case_type": "contract dispute",
  "jurisdiction": "California"
}
```

### Batch Analyze Cases
```
POST /api/v1/batch-analyze
Content-Type: application/json

[
  { case_data_1 },
  { case_data_2 }
]
```

## Testing

### Using curl

```bash
curl -X POST "http://localhost:8000/api/v1/analyze" \
  -H "Content-Type: application/json" \
  -d @case_example.json
```

### Using Python

```python
import requests

with open('case_example.json', 'r') as f:
    case_data = json.load(f)

response = requests.post(
    'http://localhost:8000/api/v1/analyze',
    json=case_data
)

report = response.json()
print(f"Win Probability: {report['win_probability']}%")
print(f"Merit Score: {report['merit_score']}/10")
```

## API Documentation

Once the server is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## Response Example

```json
{
  "case_id": "7e87c0c8-29a1-498b-b979-a3b4f5a49e0d",
  "analysis_time": "2026-05-13T19:05:17.788000",
  "case_summary": "Contract dispute involving unpaid debt of $20,000",
  "legal_assessment": "Strong case based on contract law principles...",
  "merit_score": 7.5,
  "win_probability": 75.0,
  "key_strengths": [
    "Written contract exists",
    "Clear payment terms",
    "Three-year documentation period"
  ],
  "key_weaknesses": [
    "Statute of limitations concerns",
    "Limited evidence documentation",
    "Possible defenses available"
  ],
  "recommended_actions": [
    "Gather all payment records and invoices",
    "Send formal demand letter",
    "Consult with California contract attorney",
    "Review statute of limitations"
  ],
  "estimated_timeline": "6-12 months for settlement, 18-24 months if litigation",
  "estimated_costs": "$5,000-$15,000 in attorney fees",
  "jurisdiction_notes": "California contract law applies. 4-year statute of limitations for written contracts.",
  "additional_evidence_needed": [
    "Original contract documents",
    "Payment invoices and statements",
    "Email/written communications",
    "Proof of delivery or services rendered"
  ]
}
```

## Security Notes

- Never commit `.env` file to version control
- Keep your OpenAI API key secure
- This API provides preliminary assessments, not formal legal advice
- Always recommend consultation with licensed attorneys
- Consider implementing authentication for production use

## Frontend Integration

This API is designed to work with intake forms like the one shown in your example. The form should collect:

- Case Type (dropdown)
- Jurisdiction (dropdown)
- Case Description (textarea, min 30 characters)
- Opposing Party (text input)
- Estimated Damages (text input)
- Evidence Available (textarea)
- User Name (text input)
- Email (email input)

Submit the form data as JSON to `/api/v1/analyze` and display the returned report to the user.

## License

[Add your license here]
