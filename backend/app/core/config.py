from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    APP_NAME: str = "MarmoGest API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # Database
    DATABASE_URL: str

    # CORS - allowed domains to consume the API
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:4200",   # Angular development
        "http://localhost:3000",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


# Global instance used across the entire app
settings = Settings()