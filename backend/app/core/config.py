from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "local"
    database_url: str = "sqlite:///./data/position_macro_tracker.db"
    fred_api_key: str | None = None
    eia_api_key: str | None = None
    x_bearer_token: str | None = None
    quote_provider: str = "yfinance"
    macro_provider: str = "fred"
    valuation_provider: str = "multpl"
    energy_provider: str = "eia"
    social_feed_provider: str = "x"
    position_provider: str = "fidelity_csv"
    frontend_origin: str = "http://127.0.0.1:5173"

    model_config = SettingsConfigDict(env_file="../.env", env_file_encoding="utf-8")


settings = Settings()
