from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.models import CaseIntake, CaseAnalysisReport
from app.services import LegalAnalysisService
from app.config import get_settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="API for analyzing legal cases and generating preliminary assessments"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

legal_service = LegalAnalysisService()


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Legal Case Analysis API",
        "version": settings.api_version,
        "endpoints": {
            "analyze": "/api/v1/analyze",
            "health": "/health"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "legal-case-analysis-api"}


@app.post(
    "/api/v1/analyze",
    response_model=CaseAnalysisReport,
    status_code=status.HTTP_200_OK,
    summary="Analyze a legal case",
    description="Submit case intake information and receive a comprehensive legal analysis report"
)
async def analyze_case(case: CaseIntake):
    """
    Analyze a legal case and generate a comprehensive report.

    The analysis includes:
    - Case summary and legal assessment
    - Merit score and win probability
    - Key strengths and weaknesses
    - Recommended actions
    - Timeline and cost estimates
    - Jurisdiction-specific notes
    - Additional evidence recommendations
    """
    try:
        logger.info(f"Received case analysis request for case ID: {case.id}")
        report = await legal_service.analyze_case(case)
        return report
    except Exception as e:
        logger.error(f"Error processing case analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze case: {str(e)}"
        )


@app.post(
    "/api/v1/batch-analyze",
    response_model=list[CaseAnalysisReport],
    status_code=status.HTTP_200_OK,
    summary="Analyze multiple legal cases",
    description="Submit multiple case intake forms and receive analysis reports for each"
)
async def batch_analyze_cases(cases: list[CaseIntake]):
    """
    Analyze multiple legal cases in a single request.

    This endpoint accepts an array of case intakes and returns
    an array of corresponding analysis reports.
    """
    try:
        reports = []
        for case in cases:
            logger.info(f"Processing case ID: {case.id}")
            report = await legal_service.analyze_case(case)
            reports.append(report)
        return reports
    except Exception as e:
        logger.error(f"Error processing batch analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze cases: {str(e)}"
        )
