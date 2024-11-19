from pydantic import BaseModel

class InternshipBase(BaseModel):
    student_name: str
    company_name: str
    mentor_name: str
    status: str

class InternshipCreate(InternshipBase):
    pass

class Internship(InternshipBase):
    id: int

    class Config:
        orm_mode = True