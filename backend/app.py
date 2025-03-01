from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import random
from typing import Dict, Optional, Literal, Tuple, Any, Union
from openai import OpenAI # type: ignore
import json

## TYPICALLY LIVES IN .ENV I KNOW, NO TIME!
OPEN_AI_API_KEY = ''


app = Flask(__name__)
CORS(app, expose_headers=["X-Server-Version"])


# TODO: Implement version tracking!!
VERSION = "1.0.0"

transcription_jobs = {}


def categorize_with_openai(transcription_string: str) -> Dict[str, Any]:
    """
    Categorizes transcription using OpenAI model
    
    Args:
        transcription_string: The transcription text
        
    Returns:
        Dict containing categorization results
    """
    try:
        client = OpenAI(api_key=OPEN_AI_API_KEY)
        # Define system prompt for categorization
        system_prompt = """
        You are a transcription categorization assistant. 
        Analyze the provided transcription and categorize it into the following:
        
        1. Primary topic (choose one): Business, Technology, Healthcare, Education, Finance, Entertainment, Other
        2. Sentiment (choose one): Positive, Negative, Neutral
        3. Key entities: List important people, organizations, or products mentioned
        4. Action items: Identify any tasks or follow-ups mentioned
        
        Provide your response as a JSON object with these categories as keys.
        Be precise and only include information explicitly mentioned in the transcription.
        """
        
        # Call OpenAI API with careful error handling
        response = client.chat.completions.create(
            model="gpt-4-turbo",  # Use appropriate model version
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": transcription_string}
            ],
            response_format={"type": "json_object"},  # Ensure JSON response
            temperature=0.2,  # Low temperature for consistent categorization
            max_tokens=500
        )
        
        # Parse and validate response
        result = json.loads(response.choices[0].message.content)
        
        # Normalize field names to handle potential inconsistencies
        normalized_result = {}
        for key, value in result.items():
            # Convert keys to lowercase and remove spaces/underscores for comparison
            normalized_key = key.lower().replace(" ", "_").replace("-", "_")
            
            # Map normalized keys to expected format
            if "topic" in normalized_key or "category" in normalized_key:
                normalized_result["primary_topic"] = value
            elif "sentiment" in normalized_key:
                normalized_result["sentiment"] = value
            elif "entit" in normalized_key:  # matches entities, entity
                normalized_result["key_entities"] = value
            elif "action" in normalized_key or "task" in normalized_key:
                normalized_result["action_items"] = value
            else:
                normalized_result[key] = value
        
        # Make sure we have all required fields
        required_fields = ["primary_topic", "sentiment", "key_entities", "action_items"]
        missing_fields = [field for field in required_fields if field not in normalized_result]
        
        # If fields are missing, create placeholders rather than failing
        if missing_fields:
            print(f"Warning: Missing fields in response: {missing_fields}")
            for field in missing_fields:
                if field == "primary_topic":
                    normalized_result["primary_topic"] = "Other"
                elif field == "sentiment":
                    normalized_result["sentiment"] = "Neutral"
                elif field == "key_entities":
                    normalized_result["key_entities"] = []
                elif field == "action_items":
                    normalized_result["action_items"] = []
        
        result = normalized_result
        
        return {
            "categories": result,
            "model": "openai",
            "confidence": "high" if response.choices[0].finish_reason == "stop" else "medium",
        }
    except Exception as e:
        print(f"OpenAI categorization error: {e}")
        raise RuntimeError(f"Failed to categorize with OpenAI: {str(e)}")


def process_transcription(job_id: str, audio_data: bytes):
    """Mock function to simulate async transcription processing. Returns a random transcription."""
    time.sleep(random.randint(5, 20))
    return random.choice([
        "I've always been fascinated by cars, especially classic muscle cars from the 60s and 70s. The raw power and beautiful design of those vehicles is just incredible.",
        "Bald eagles are such majestic creatures. I love watching them soar through the sky and dive down to catch fish. Their white heads against the blue sky is a sight I'll never forget.",
        "Deep sea diving opens up a whole new world of exploration. The mysterious creatures and stunning coral reefs you encounter at those depths are unlike anything else on Earth."
    ])


def categorize_transcription(transcription_string: str, user_id: str):
    # TODO: Implement transcription categorization
    model_to_use = get_user_model_from_db(user_id)
    if model_to_use == "openai":
        return categorize_with_openai(transcription_string)
    elif model_to_use == "anthropic":
        # TODO: Implement Anthropic categorization
        pass


def get_user_model_from_db(user_id: str) -> Literal["openai", "anthropic"]:
    """
    Mocks a slow and expensive function to simulate fetching a user's preferred LLM model from database
    Returns either 'openai' or 'anthropic' after a random delay.
    """
     ## ran out of time to implement this, just using openai for now
    return "openai"

    # time.sleep(random.randint(2, 8))
    # return random.choice(["openai", "anthropic"])

def check_version_compatibility(request) -> Tuple[bool, Optional[str]]:
    """
    Check if client version is compatible with server version
    Returns (is_compatible, error_message)
    """
    client_version = request.headers.get('X-Client-Version')
    
    # No client version provided (older client or not using versioning)
    if not client_version:
        return True, None
        
    # Check compatibility - in a real app, you'd have logic for what versions are compatible
    if client_version != VERSION:
        return False, f"Version mismatch: Server {VERSION}, Client {client_version}"
        
    return True, None

def add_version_headers(response):
    """Add version headers to response"""
    response.headers['X-Server-Version'] = VERSION
    return response


@app.route('/version', methods=['GET'])
def get_version():
    """Endpoint to check server version"""
    print("Version endpoint called")
    response = jsonify({
        "version": VERSION
    })
    return add_version_headers(response)

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    print("Transcribe endpoint called")
        # Check version compatibility
    is_compatible, error_message = check_version_compatibility(request)
    if not is_compatible:
        response = jsonify({
            "error": error_message,
            "version": VERSION
        })
        return add_version_headers(response), 409 

    user_id = request.form.get('userId') or request.headers.get('X-User-ID', 'unknown')

    # TODO: Implement categorization - , completed
    # result = categorize_transcription(result, "user_id")

    # Get user ID
    user_id = request.form.get('userId') or request.headers.get('X-User-ID', 'unknown')
    
    # Process audio file
    audio_file = request.files.get('audio')
    if not audio_file:
        response = jsonify({
            "error": "No audio file provided",
            "version": VERSION
        })
        return add_version_headers(response), 400
    
    # Process the audio (simulate transcription)
    job_id = f"job_{random.randint(1000, 9999)}"
    transcription = process_transcription(job_id, audio_file.read())
    
    # Categorize the transcription
    category = categorize_transcription(transcription, user_id)
    
    # Return the result
    response = jsonify({
        "transcription": transcription,
        "category": category,
        "version": VERSION
    })
    
    return add_version_headers(response)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
