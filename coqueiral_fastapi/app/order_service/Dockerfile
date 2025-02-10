FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY coqueiral_fastapi/ ./coqueiral_fastapi

ENV PYTHONPATH=/app

CMD ["bash", "-c", "python coqueiral_fastapi/app/order_service/initial_data.py && uvicorn coqueiral_fastapi.app.order_service.main:app --host 0.0.0.0 --port 8002"]