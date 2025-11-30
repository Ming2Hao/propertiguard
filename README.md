# PropertiGuard

PropertiGuard is an AI-powered legal assistant designed to analyze property contracts. It leverages Google's Agent Development Kit (ADK) for the backend and Next.js for the frontend to provide intelligent risk analysis and advice.

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React framework), Tailwind CSS
- **Backend**: Python, [Google ADK](https://github.com/google/adk) (Agent Development Kit)
- **Infrastructure**: Google Cloud Run

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Python](https://www.python.org/) (v3.11 or later)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- `google-adk` installed locally (`pip install google-adk`)

## Local Development

### Backend

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  (Optional) Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  Install dependencies:
    ```bash
    pip install google-adk==1.19.0
    ```

4.  Run the ADK server:
    ```bash
    adk api_server --port=8000 --host=0.0.0.0 ./agents
    ```
    The backend will be available at `http://localhost:8000`.

### Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

## Deployment to Google Cloud Run

Ensure you are authenticated with Google Cloud:
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Backend Deployment

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Build and deploy using `gcloud`:
    ```bash
    gcloud run deploy propertiguard-backend \
      --source . \
      --region us-central1 \
      --allow-unauthenticated
    ```

### Frontend Deployment

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Build and deploy using `gcloud`:
    ```bash
    gcloud run deploy propertiguard-frontend \
      --source . \
      --region us-central1 \
      --allow-unauthenticated
    ```

## Environment Variables

Ensure the following environment variables are set for the backend (either in a `.env` file locally or in Cloud Run configuration):

- `GOOGLE_CLOUD_PROJECT`: Your Google Cloud Project ID
- `GOOGLE_CLOUD_LOCATION`: Your Google Cloud Region (e.g., `us-central1`)
- `GOOGLE_GENAI_USE_VERTEXAI`: Set to `1` to use Vertex AI
