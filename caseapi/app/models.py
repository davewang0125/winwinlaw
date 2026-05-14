from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class CaseIntake(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    intake_time: datetime = Field(default_factory=datetime.now)
    user: str = Field(..., min_length=1, description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    opposing_party: str = Field(..., min_length=1, description="Name of opposing party")
    estimated_damage: str = Field(..., description="Estimated damages in USD")
    case_description: str = Field(..., min_length=30, description="Detailed case description")
    evidence_available: str = Field(..., description="Description of available evidence")
    case_type: str = Field(..., description="Type of legal case")
    jurisdiction: str = Field(..., description="Legal jurisdiction")

    class Config:
        json_schema_extra = {
            "example": {
                "user": "Dave Wang",
                "email": "wang.dave@gmail.com",
                "opposing_party": "EK Inc",
                "estimated_damage": "20000$",
                "case_description": "they owe me money and has not paid for 3 years",
                "evidence_available": "yes",
                "case_type": "contract dispute",
                "jurisdiction": "California"
            }
        }


class CaseAnalysisReport(BaseModel):
    case_id: str
    analysis_time: datetime
    case_summary: str
    legal_assessment: str
    merit_score: float = Field(..., ge=0, le=10, description="Case merit score from 0-10")
    win_probability: float = Field(..., ge=0, le=100, description="Win probability percentage")
    key_strengths: list[str]
    key_weaknesses: list[str]
    recommended_actions: list[str]
    estimated_timeline: str
    estimated_costs: str
    jurisdiction_notes: str
    additional_evidence_needed: list[str]

    class Config:
        json_schema_extra = {
            "example": {
                "case_id": "7e87c0c8-29a1-498b-b979-a3b4f5a49e0d",
                "analysis_time": "2026-05-13T19:05:17.788000",
                "case_summary": "Contract dispute involving unpaid debt of $20,000",
                "legal_assessment": "Strong case based on contract law principles",
                "merit_score": 7.5,
                "win_probability": 75.0,
                "key_strengths": ["Written contract exists", "Clear payment terms"],
                "key_weaknesses": ["Statute of limitations concerns", "Limited documentation"],
                "recommended_actions": ["Gather payment records", "Send demand letter"],
                "estimated_timeline": "6-12 months",
                "estimated_costs": "$5,000-$15,000",
                "jurisdiction_notes": "California contract law applies",
                "additional_evidence_needed": ["Payment invoices", "Communication records"]
            }
        }
