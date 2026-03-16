# backend/Dockerfile
# This Dockerfile sets up a Python 3.11 environment for the backend application. 
# It installs the required dependencies from requirements.txt, 
# copies the application code and data, and starts the server

FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY data ./data

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]