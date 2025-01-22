from sqlalchemy import Column, DateTime, Integer, String, func, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    senha_hashed = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    criado_em = Column(DateTime, server_default=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'email': self.email,
            'is_admin': self.is_admin,
            'criado_em': self.criado_em.isoformat(),
        }
