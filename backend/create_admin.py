from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole

def create_initial_users():
    db: Session = SessionLocal()
    
    try:
        # Usuario 1: Admin
        admin = db.query(User).filter(User.email == "admin@marmogest.com").first()
        if not admin:
            admin = User(
                email="admin@marmogest.com",
                password_hash=get_password_hash("admin1234"),
                full_name="Administrator",
                role=UserRole.admin,
                is_active=True
            )
            db.add(admin)
            print("✅ Usuario admin creado")
        else:
            print("⚠️ Admin ya existe")
        
        # Usuario 2: Operario
        operator = db.query(User).filter(User.email == "operario@marmogest.com").first()
        if not operator:
            operator = User(
                email="operario@marmogest.com",
                password_hash=get_password_hash("operario123"),
                full_name="Operario",
                role=UserRole.operator,
                is_active=True
            )
            db.add(operator)
            print("✅ Usuario operario creado")
        else:
            print("⚠️ Operario ya existe")
        
        db.commit()
        print("\n🎉 Usuarios iniciales listos")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_initial_users()