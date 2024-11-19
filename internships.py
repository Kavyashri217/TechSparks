from fastapi import APIRouter, HTTPException, Depends
from app.auth import get_current_user

router = APIRouter()

# Temporary storage for internships
internships = []

# Get all internships
@router.get("/internships/")
def get_all_internships(current_user: str = Depends(get_current_user)):
    return internships

# Create a new internship
@router.post("/internships/")
def create_internship(internship: dict, current_user: str = Depends(get_current_user)):
    internship["id"] = len(internships) + 1
    internships.append(internship)
    return internship

# Get internship by ID
@router.get("/internships/{internship_id}")
def get_internship(internship_id: int, current_user: str = Depends(get_current_user)):
    internship = next((i for i in internships if i["id"] == internship_id), None)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    return internship

# Delete an internship
@router.delete("/internships/{internship_id}")
def delete_internship(internship_id: int, current_user: str = Depends(get_current_user)):
    global internships
    internships = [i for i in internships if i["id"] != internship_id]
    return {"message": "Internship deleted successfully"}

