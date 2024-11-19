from sqlalchemy.orm import Session
from app.models import User, Internship
from app.auth import get_password_hash
from sqlalchemy.orm import Session
from app.models import Internship

# CRUD for User
def create_user(db: Session, username: str, password: str, role: str):
    hashed_password = get_password_hash(password)
    user = User(username=username, hashed_password=hashed_password, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

# CRUD for Internship
def create_internship(db: Session, intern_id: int, data: dict):
    internship = Internship(intern_id=intern_id, **data)
    db.add(internship)
    db.commit()
    db.refresh(internship)
    return internship

# Create Internship
def create_internship(db: Session, intern_id: int, data: dict):
    internship = Internship(
        intern_id=intern_id,
        company_name=data["company_name"],
        company_address=data["company_address"],
        external_mentor_name=data["external_mentor_name"],
        start_date=data["start_date"],
        stipend_amount=data["stipend_amount"]
    )
    db.add(internship)
    db.commit()
    db.refresh(internship)
    return internship

# Update Internship
def update_internship(db: Session, internship_id: int, data: dict):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        return None
    for key, value in data.items():
        setattr(internship, key, value)
    db.commit()
    db.refresh(internship)
    return internship

# Delete Internship
def delete_internship(db: Session, internship_id: int):
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if internship:
        db.delete(internship)
        db.commit()
    return internship

from app.models import Report
def create_report(db: Session, data: dict):
    report = Report(**data)
    db.add(report)
    db.commit()
    db.refresh(report)
    return report