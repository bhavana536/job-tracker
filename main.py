from fastapi import FastAPI
from models import JobCreate

app=FastAPI()

jobs = []

@app.get("/")
def home():
    return {"message":"Hello World!"}

@app.get("/test")
def test():
    return {"Status":"API is working!"}

@app.post("/jobs")
def create_job(job:JobCreate):
    job_dict = job.model_dump()
    job_dict["id"] = len(jobs) + 1
    jobs.append(job_dict)
    return {"message":"Job added!","job":job_dict}

@app.get("/jobs")
def get_jobs():
    return {"jobs":jobs,"total":len(jobs)}