from fastapi import APIRouter, FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.routes import internships
from app.database import init_db
from app.routes import reports
from app.auth import (
    create_access_token,
    verify_password,
    get_password_hash,
    get_current_user,
)

from app.crud import create_user, get_user, create_internship, get_internships, update_internship, delete_internship
from app.database import get_db
from app.auth import get_current_user

# In-memory database for demo purposes
fake_users_db = {
    "intern1": {"username": "intern1", "password": get_password_hash("password1")},
    "mentor1": {"username": "mentor1", "password": get_password_hash("password2")},
    "coordinator": {"username": "coordinator", "password": get_password_hash("password3")},
}

app = FastAPI()

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Internship Management System!"}

app.include_router(internships.router)

app.include_router(reports.router)

@app.lifespan("startup")
def startup_event():
    init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Internship Management System!"}

@app.get("/protected")
def protected_route(current_user: str = Depends(get_current_user)):
    return {"message": f"Hello, {current_user}. This is a protected route."}

# Dependency for database session 
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/")
def register_user(username: str, password: str, role: str, db: Session = Depends(get_db)):
    user = get_user(db, username)
    if user:
        raise HTTPException(status_code=400, detail="Username already exists")
    return create_user(db, username, password, role)

@app.get("/users/{username}")
def get_user_details(username: str, db: Session = Depends(get_db)):
    user = get_user(db, username)
    if not user:
        raise
HTTPException(status_code=404, detail="User not found")

router = APIRouter()

@router.post("/internships/")
def create_internship_route(data: dict, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user["role"] != "intern":
        raise HTTPException(status_code=403, detail="Not authorized")
    return create_internship(db, current_user["id"], data)

@router.get("/internships/")
def get_all_internships(db: Session = Depends(get_db)):
    return get_internships(db)

@router.put("/internships/{internship_id}")
def update_internship_route(internship_id: int, data: dict, db: Session = Depends(get_db)):
    internship = update_internship(db, internship_id, data)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    return internship

@router.delete("/internships/{internship_id}")
def delete_internship_route(internship_id: int, db: Session = Depends(get_db)):
    internship = delete_internship(db, internship_id)
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    return {"message": "Internship deleted successfully"}

from fastapi import File, UploadFile
import os

UPLOAD_FOLDER = "uploads"  # Define a folder to store uploaded files

# Ensure the folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@router.post("/reports/")
async def upload_report(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    return {"message": "Report uploaded successfully"}
            

from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
import os

from app.crud import create_report
from app.models import Internship
from app.database import get_db
from app.auth import get_current_user

UPLOAD_FOLDER = "uploads"  # Folder for storing uploaded files

# Ensure the folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

router = APIRouter()

@router.post("/reports/")
async def upload_report(
    internship_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    # Check if internship exists and belongs to the current user
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    if internship.intern_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to upload reports for this internship")

    # Save the uploaded file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    # Add report entry to the database
    report_data = {
        "internship_id": internship_id,
        "content": file_path,  # Store file path as content
        "submission_date": date.today(),
    }
    report = create_report(db, report_data)

    return {"message": "Report uploaded successfully", "report_id": report.id, "file_path": file_path}