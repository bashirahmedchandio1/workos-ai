from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from jose import jwt, jwk, JWTError
from jose.constants import Algorithms
import httpx
from src.config import get_settings

settings = get_settings()
_jwks_cache: dict | None = None


async def get_jwks() -> dict:
    global _jwks_cache
    if _jwks_cache is None and settings.clerk_jwks_url:
        async with httpx.AsyncClient() as client:
            response = await client.get(settings.clerk_jwks_url)
            _jwks_cache = response.json()
    return _jwks_cache or {}


async def verify_clerk_token(token: str) -> dict:
    jwks = await get_jwks()
    if not jwks:
        # Development mode: accept a simple user_id from header
        return {"sub": "dev_user_123", "user_id": "dev_user_123"}

    unverified_header = jwt.get_unverified_header(token)
    rsa_key = {}
    for key in jwks.get("keys", []):
        if key.get("kid") == unverified_header.get("kid"):
            rsa_key = key
            break

    if not rsa_key:
        raise HTTPException(status_code=401, detail="Invalid token: key not found")

    try:
        payload = jwt.decode(
            token,
            jwk.construct(rsa_key),
            algorithms=[Algorithms.RS256],
            options={"verify_exp": True},
        )
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


async def get_current_user(request: Request) -> dict:
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = auth_header.removeprefix("Bearer ")
    payload = await verify_clerk_token(token)

    return {
        "id": payload.get("sub", ""),
        "user_id": payload.get("sub", ""),
        "email": payload.get("email", ""),
    }
