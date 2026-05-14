from openai import OpenAI
from app.config import get_settings
from app.models import CaseIntake, CaseAnalysisReport
from app.prompts import LEGAL_ANALYSIS_SYSTEM_PROMPT, create_case_analysis_prompt
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)


class LegalAnalysisService:
    def __init__(self):
        settings = get_settings()
        import httpx
        # Temporary fix for SSL certificate verification on macOS Python 3.13
        # TODO: Install certificates properly using: /Library/Frameworks/Python.framework/Versions/3.13/bin/pip3 install --upgrade certifi
        http_client = httpx.Client(verify=False)
        self.client = OpenAI(api_key=settings.openai_api_key, http_client=http_client)
        self.model = settings.openai_model

    async def analyze_case(self, case: CaseIntake) -> CaseAnalysisReport:
        """
        Analyze a legal case using OpenAI's API.

        Args:
            case: CaseIntake model containing case details

        Returns:
            CaseAnalysisReport with comprehensive analysis
        """
        try:
            case_dict = case.model_dump()

            user_prompt = create_case_analysis_prompt(case_dict)

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": LEGAL_ANALYSIS_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=2000,
                response_format={"type": "json_object"}
            )

            analysis_content = response.choices[0].message.content
            analysis_data = json.loads(analysis_content)

            report = CaseAnalysisReport(
                case_id=case.id,
                analysis_time=datetime.now(),
                case_summary=analysis_data.get("case_summary", ""),
                legal_assessment=analysis_data.get("legal_assessment", ""),
                merit_score=float(analysis_data.get("merit_score", 5.0)),
                win_probability=float(analysis_data.get("win_probability", 50.0)),
                key_strengths=analysis_data.get("key_strengths", []),
                key_weaknesses=analysis_data.get("key_weaknesses", []),
                recommended_actions=analysis_data.get("recommended_actions", []),
                estimated_timeline=analysis_data.get("estimated_timeline", "Unknown"),
                estimated_costs=analysis_data.get("estimated_costs", "Unknown"),
                jurisdiction_notes=analysis_data.get("jurisdiction_notes", ""),
                additional_evidence_needed=analysis_data.get("additional_evidence_needed", [])
            )

            logger.info(f"Successfully analyzed case {case.id}")
            return report

        except Exception as e:
            logger.error(f"Error analyzing case {case.id}: {str(e)}")
            raise Exception(f"Failed to analyze case: {str(e)}")
