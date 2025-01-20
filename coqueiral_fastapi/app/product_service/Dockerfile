FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml poetry.lock ./
RUN pip install poetry && poetry install --no-root

COPY coqueiral_fastapi/app /product_service

CMD ["poetry", "run", "task", "run"]