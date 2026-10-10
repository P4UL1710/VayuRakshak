"""Optional local Edge TTS bridge. Bind to loopback; keep tokens server-side."""
import asyncio
import os
import re
import secrets
import edge_tts
from fastapi import FastAPI, HTTPException, Header
from fastapi.responses import Response
from pydantic import BaseModel, Field

app = FastAPI(docs_url=None, redoc_url=None)

class Narration(BaseModel):
    text: str = Field(min_length=5, max_length=1500)
    voice: str = "en-IN-NeerjaNeural"
    rate: str = "+0%"
    pitch: str = "+0Hz"

@app.post("/synthesize")
async def synthesize(body: Narration, authorization: str = Header(default="")):
    token = os.environ.get("EDGE_TTS_TOKEN")
    if token and not secrets.compare_digest(authorization, f"Bearer {token}"):
        raise HTTPException(401, "Invalid provider token")
    if body.voice not in {"en-IN-NeerjaNeural", "en-IN-PrabhatNeural", "en-US-AriaNeural"}:
        raise HTTPException(400, "Unsupported voice")
    if not re.fullmatch(r"[-+]\d{1,2}%", body.rate) or not re.fullmatch(r"[-+]\d{1,2}Hz", body.pitch):
        raise HTTPException(400, "Unsupported speech parameters")
    async def generate():
        chunks = []
        async for chunk in edge_tts.Communicate(re.sub(r"<[^>]*>", "", body.text), body.voice, rate=body.rate, pitch=body.pitch).stream():
            if chunk["type"] == "audio":
                chunks.append(chunk["data"])
        return b"".join(chunks)
    try:
        data = await asyncio.wait_for(generate(), timeout=14)
        if not data:
            raise ValueError("Empty audio")
        return Response(data, media_type="audio/mpeg")
    except Exception:
        raise HTTPException(503, "Narration provider unavailable") from None
