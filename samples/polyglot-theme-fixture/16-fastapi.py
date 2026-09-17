from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Theme Fixture")

class Message(BaseModel):
    text: str

@app.post("/messages", response_model=Message)
async def create_message(message: Message) -> Message:
    return message
