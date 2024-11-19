from app.database import Base, engine
from app.models import User, Internship, Report

# Create all tables in the database
Base.metadata.create_all(bind=engine)