from fastapi import APIRouter, HTTPException, Depends
from app.auth import get_current_user

router = APIRouter()

# Temporary storage for reports
reports = []

@router.post("/reports/")
def submit_report(report: dict, current_user: str = Depends(get_current_user)):
    report["id"] = len(reports) + 1
    reports.append(report)
    return {"message": "Report submitted successfully", "report": report}

@router.get("/reports/")
def get_all_reports(current_user: str = Depends(get_current_user)):
    return reports