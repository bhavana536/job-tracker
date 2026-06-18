import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()    
JOBS_COLLECTION = "jobs"

def add_job(job_data: dict) -> str:
    """Save a new job to Firebase. Returns the new job's ID."""
    doc_ref = db.collection(JOBS_COLLECTION).document()
    job_data["id"] = doc_ref.id
    doc_ref.set(job_data)
    return doc_ref.id

def get_all_jobs() -> list:
    docs = db.collection(JOBS_COLLECTION).stream()
    return [doc.to_dict() for doc in docs]

def get_job(job_id: str) -> dict:
    """Get one job by ID."""
    doc = db.collection(JOBS_COLLECTION).document(job_id).get()
    return doc.to_dict() if doc.exists else None

def update_job(job_id: str, updates: dict) -> bool:
    """Udate specific fields in job"""
    ref = db.collection(JOBS_COLLECTION).document(job_id)
    if not ref.get().exists:
        return False
    ref.update(updates)
    return True

def delete_job(job_id: str) -> bool:
    """Delete a job by ID."""
    ref = db.collection(JOBS_COLLECTION).document(job_id)
    if not ref.get().exists:
        return False
    ref.delete()
    return True

