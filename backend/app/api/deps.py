from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User
from app.schemas.auth import TokenData

# Cambia el tokenUrl para que apunte al login real
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login/swagger", auto_error=False)

def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],  # Ahora siempre viene string (o lanza 401 automático)
    db: Annotated[Session, Depends(get_db)]
) -> User:
    """
    Obtiene el usuario actual desde el token JWT.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decodificar el token
        payload = decode_access_token(token)
        
        # CAMBIO 2: Manejar caso de payload None
        if payload is None:
            print("Token inválido o expirado")  # DEBUG
            raise credentials_exception

        # Extraer el email del payload
        email: str = payload.get("sub")
        if email is None:
            print("No email in token")  # DEBUG
            raise credentials_exception

        token_data = TokenData(email=email)

    except JWTError:
        print("JWTError al decodificar")  # DEBUG
        raise credentials_exception
    except Exception as e:
        # CAMBIO 3: Capturar cualquier otra excepción
        print(f"Error inesperado en get_current_user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during authentication"
        )

    # Buscar el usuario en la base de datos
    user = db.query(User).filter(User.email == token_data.email).first()

    if user is None:
        print(f"Usuario no encontrado: {token_data.email}")  # DEBUG
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )

    return user


def get_current_active_admin(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    """
    Verifica que el usuario actual sea administrador.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user