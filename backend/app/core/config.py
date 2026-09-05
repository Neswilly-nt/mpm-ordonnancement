from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "API Ordonnancement MPM"
    database_url: str = "sqlite:///./mpm.db"
    cors_origins: str = "http://localhost:5173"
    jwt_secret_key: str = "mpm-development-secret-change-me"
    access_token_expire_minutes: int = 1440
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
