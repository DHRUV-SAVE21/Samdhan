import os
from dataclasses import dataclass, field
from dotenv import load_dotenv

load_dotenv()

@dataclass(frozen=True)
class Settings:
    app_name: str = "Drishti AI API"
    api_prefix: str = "/api/v1"
    environment: str = os.getenv("APP_ENV", "development")
    cors_origins: list[str] = field(default_factory=lambda: [origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",") if origin.strip()])

settings = Settings()
