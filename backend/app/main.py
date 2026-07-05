from fastapi import FastAPI

app = FastAPI(title="NeuralHandoff API")

@app.get("/")
def root():
    return {"message": "NeuralHandoff API is running ??"}
