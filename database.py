import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    # Check if running on Render (environment variable) or locally (file)
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