from sqlalchemy import Column, Integer, String, ForeignKey, Date, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from app.database import Base

Base = declarative_base()

class User(Base):
    _tablename_ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # "intern", "mentor", or "coordinator"

    # Relationships
    internships = relationship("Internship", back_populates="intern")

class Internship(Base):
    _tablename_ = "internships"

    id = Column(Integer, primary_key=True, index=True)
    intern_id = Column(Integer, ForeignKey("users.id"))
    company_name = Column(String)
    company_address = Column(String)
    external_mentor_name = Column(String)
    start_date = Column(Date)
    stipend_amount = Column(Float)

    # Relationships
    intern = relationship("User", back_populates="internships")
    reports = relationship("Report", back_populates="internship")

class Report(Base):
    _tablename_ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    internship_id = Column(Integer, ForeignKey("internships.id"))
    content = Column(String)
    submission_date = Column(Date)

    # Relationships
    internship = relationship("Internship", back_populates="reports")