from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings


# Create the database engine
# pool_pre_ping=True checks the connection before using it
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True
)

# Each instance of SessionLocal will be a database session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class that all models will inherit from
Base = declarative_base()


# Dependency to get database session
# Used in every endpoint that needs database access
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()