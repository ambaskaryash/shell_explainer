FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY app.py .
COPY command_elements.json .

EXPOSE 5001

CMD ["python", "app.py"]
