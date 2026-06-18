from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini with new package
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def analyze_resume(resume_text: str, job_description: str) -> dict:
    """Send resume + JD to Gemini and get analysis back."""

    prompt = f"""
    You are a professional resume reviewer.
    
    Analyze this resume against the job description.
    Respond ONLY with a JSON object, no extra text.
    
    Resume:
    {resume_text}
    
    Job Description:
    {job_description}
    
    Respond with exactly this format:
    {{
        "match_score": <number 0-100>,
        "matched_skills": ["skill1", "skill2"],
        "missing_skills": ["skill1", "skill2"],
        "improvement_tips": ["tip1", "tip2", "tip3"],
        "summary": "<2 sentence assessment>"
    }}
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents=prompt
    )

    # Clean and parse JSON response
    raw = response.text.strip()
    raw = raw.replace("```json", "").replace("```", "")

    return json.loads(raw)