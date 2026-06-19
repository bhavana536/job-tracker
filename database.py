import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
    
    if cred_json:
        # On Render — read from environment variable
        cred_dict = json.loads(cred_json)
        cred = credentials.Certificate(cred_dict)
    else:
        # Local — read from file
        cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase_credentials.json")
        cred = credentials.Certificate(cred_path)
    
    firebase_admin.initialize_app(cred)

db = firestore.client()
JOBS_COLLECTION = "jobs"

def add_job(job_data: dict) -> str:
    doc_ref = db.collection(JOBS_COLLECTION).document()
    job_data["id"] = doc_ref.id
    doc_ref.set(job_data)
    return doc_ref.id

def get_all_jobs() -> list:
    docs = db.collection(JOBS_COLLECTION).stream()
    return [doc.to_dict() for doc in docs]

def get_job(job_id: str) -> dict:
    doc = db.collection(JOBS_COLLECTION).document(job_id).get()
    return doc.to_dict() if doc.exists else None

def update_job(job_id: str, updates: dict) -> bool:
    ref = db.collection(JOBS_COLLECTION).document(job_id)
    if not ref.get().exists:
        return False
    ref.update(updates)
    return True

def delete_job(job_id: str) -> bool:
    ref = db.collection(JOBS_COLLECTION).document(job_id)
    if not ref.get().exists:
        return False
    ref.delete()
    return True