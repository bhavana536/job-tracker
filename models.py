from pydantic import BaseModel
from typing import Optional

class JobCreate(BaseModel):
    company:str
    role:str
    status:str = "Applied"
    jd_link:Optional[str] = None
    notes:Optional[str] = None