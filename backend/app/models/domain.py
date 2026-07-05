from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    users = relationship("User", back_populates="organization")

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    org_id = Column(String, ForeignKey("organizations.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    organization = relationship("Organization", back_populates="users")
