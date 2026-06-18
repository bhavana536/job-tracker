from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import JobCreate, AnalyzeRequest  # add AnalyzeRequest
from database import add_job, get_all_jobs, get_job, update_job, delete_job
from analyze import analyze_resume  # add this
app = FastAPI()

@app.get("/")
def home():
    return {"message": "Job Tracker API is running!"}

@app.post("/jobs")
def create_job(job: JobCreate):
    job_data = job.model_dump()  # convert pydantic model to dict
    job_id = add_job(job_data)   # save to Firebase
    return {"message": "Job added!", "id": job_id}


@app.get("/jobs")
def list_jobs():
    jobs = get_all_jobs()        # fetch from Firebase
    return {"jobs": jobs, "total": len(jobs)}


@app.get("/jobs/{job_id}")
def get_single_job(job_id: str):
    job = get_job(job_id)
    if not job:                  # if job doesn't exist
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@app.put("/jobs/{job_id}")
def update_single_job(job_id: str, updates: dict):
    success = update_job(job_id, updates)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job updated!"}


@app.delete("/jobs/{job_id}")
def delete_single_job(job_id: str):
    success = delete_job(job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"message": "Job deleted!"}

@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    """Analyze resume against job description using Gemini AI."""
    try:
        result = analyze_resume(request.resume_text, request.job_description)
        return {"analysis": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)  