from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    """Respuesta del login exitoso"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Datos que viajan dentro del token JWT"""
    email: str | None = None


class LoginRequest(BaseModel):
    """Datos que el usuario envía para hacer login"""
    email: EmailStr
    password: str

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "email": "admin@marmogest.com",
                    "password": "admin1234"
                }
            ]
        }
    }