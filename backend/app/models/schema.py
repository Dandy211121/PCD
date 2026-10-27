import json
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field

from app.core.database import Base

# ==========================================
# SQLAlchemy ORM Models
# ==========================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    role = Column(String(50), default="Structural Inspector")
    created_at = Column(DateTime, default=datetime.utcnow)


class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), index=True, nullable=False)
    type = Column(String(50), nullable=False)  # 'Gedung', 'Jembatan', 'Bendungan', 'Jalan Tol', 'Lainnya'
    address = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=False, default=-6.2088)
    longitude = Column(Float, nullable=False, default=106.8456)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    inspections = relationship("Inspection", back_populates="location", cascade="all, delete-orphan")


class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)
    inspector_name = Column(String(100), nullable=False, default="Inspektor Lapangan")
    notes = Column(Text, nullable=True)

    # File paths (stored as relative to storage/)
    original_image = Column(String(255), nullable=False)
    annotated_image = Column(String(255), nullable=True)
    report_pdf = Column(String(255), nullable=True)

    # Analysis Metrics
    total_grids = Column(Integer, default=0)
    crack_grids = Column(Integer, default=0)
    crack_ratio = Column(Float, default=0.0)  # Percentage (0 - 100%)
    severity_level = Column(String(50), default="Aman")  # 'Aman', 'Ringan', 'Sedang', 'Kritis'
    grid_data_json = Column(Text, nullable=True)  # JSON-encoded array of grid cells

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    location = relationship("Location", back_populates="inspections")

    @property
    def grid_data(self):
        if self.grid_data_json:
            try:
                return json.loads(self.grid_data_json)
            except Exception:
                return []
        return []

    @grid_data.setter
    def grid_data(self, value):
        self.grid_data_json = json.dumps(value)


# ==========================================
# Pydantic Schemas
# ==========================================

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None
    role: Optional[str] = "Structural Inspector"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenData(BaseModel):
    username: Optional[str] = None


# Location Schemas
class LocationBase(BaseModel):
    name: str
    type: str
    address: Optional[str] = ""
    latitude: float = -6.2088
    longitude: float = 106.8456
    description: Optional[str] = ""

class LocationCreate(LocationBase):
    pass

class LocationOut(LocationBase):
    id: int
    created_at: datetime
    inspection_count: Optional[int] = 0

    class Config:
        from_attributes = True


# Grid & Inspection Schemas
class GridCellDetail(BaseModel):
    cell_id: int
    row: int
    col: int
    x: int
    y: int
    width: int
    height: int
    is_crack: bool
    confidence: float

class InspectionOut(BaseModel):
    id: int
    location_id: int
    location_name: Optional[str] = None
    location_type: Optional[str] = None
    inspector_name: str
    notes: Optional[str] = None
    original_image: str
    annotated_image: Optional[str] = None
    report_pdf: Optional[str] = None
    total_grids: int
    crack_grids: int
    crack_ratio: float
    severity_level: str
    grid_data: Optional[List[dict]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class SummaryStats(BaseModel):
    total_inspections: int
    total_locations: int
    critical_count: int
    moderate_count: int
    minor_count: int
    safe_count: int
    avg_crack_ratio: float
