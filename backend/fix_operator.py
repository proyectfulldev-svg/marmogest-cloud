from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User

db = SessionLocal()

try:
    # Buscar el operario
    operator = db.query(User).filter(User.email == "operario@marmogest.com").first()
    
    if operator:
        # Actualizar el password con un hash nuevo
        operator.password_hash = get_password_hash("operario123")
        db.commit()
        print("✅ Password del operario actualizado correctamente")
        print(f"Nuevo hash: {operator.password_hash[:50]}...")
    else:
        print("❌ Operario no encontrado")
        
finally:
    db.close()