from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.schema import Location, Inspection, LocationCreate, LocationOut

router = APIRouter(prefix="/locations", tags=["Locations"])


@router.get("/", response_model=List[LocationOut])
def get_locations(
    type: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Location)
    if type:
        query = query.filter(Location.type == type)
    if search:
        query = query.filter(
            (Location.name.ilike(f"%{search}%")) | (Location.address.ilike(f"%{search}%"))
        )
    
    locations = query.order_by(Location.id.desc()).all()
    
    # Calculate inspection count per location
    results = []
    for loc in locations:
        count = db.query(func.count(Inspection.id)).filter(Inspection.location_id == loc.id).scalar() or 0
        loc_out = LocationOut(
            id=loc.id,
            name=loc.name,
            type=loc.type,
            address=loc.address or "",
            latitude=loc.latitude,
            longitude=loc.longitude,
            description=loc.description or "",
            created_at=loc.created_at,
            inspection_count=count
        )
        results.append(loc_out)

    return results


@router.post("/", response_model=LocationOut)
def create_location(location_in: LocationCreate, db: Session = Depends(get_db)):
    loc = Location(
        name=location_in.name,
        type=location_in.type,
        address=location_in.address,
        latitude=location_in.latitude,
        longitude=location_in.longitude,
        description=location_in.description
    )
    db.add(loc)
    db.commit()
    db.refresh(loc)
    return LocationOut(
        id=loc.id,
        name=loc.name,
        type=loc.type,
        address=loc.address or "",
        latitude=loc.latitude,
        longitude=loc.longitude,
        description=loc.description or "",
        created_at=loc.created_at,
        inspection_count=0
    )


@router.get("/{location_id}", response_model=LocationOut)
def get_location_by_id(location_id: int, db: Session = Depends(get_db)):
    loc = db.query(Location).filter(Location.id == location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Lokasi tidak ditemukan")

    count = db.query(func.count(Inspection.id)).filter(Inspection.location_id == loc.id).scalar() or 0
    return LocationOut(
        id=loc.id,
        name=loc.name,
        type=loc.type,
        address=loc.address or "",
        latitude=loc.latitude,
        longitude=loc.longitude,
        description=loc.description or "",
        created_at=loc.created_at,
        inspection_count=count
    )


@router.put("/{location_id}", response_model=LocationOut)
def update_location(location_id: int, location_in: LocationCreate, db: Session = Depends(get_db)):
    loc = db.query(Location).filter(Location.id == location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Lokasi tidak ditemukan")

    loc.name = location_in.name
    loc.type = location_in.type
    loc.address = location_in.address
    loc.latitude = location_in.latitude
    loc.longitude = location_in.longitude
    loc.description = location_in.description

    db.commit()
    db.refresh(loc)

    count = db.query(func.count(Inspection.id)).filter(Inspection.location_id == loc.id).scalar() or 0
    return LocationOut(
        id=loc.id,
        name=loc.name,
        type=loc.type,
        address=loc.address or "",
        latitude=loc.latitude,
        longitude=loc.longitude,
        description=loc.description or "",
        created_at=loc.created_at,
        inspection_count=count
    )


@router.delete("/{location_id}")
def delete_location(location_id: int, db: Session = Depends(get_db)):
    loc = db.query(Location).filter(Location.id == location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Lokasi tidak ditemukan")

    db.delete(loc)
    db.commit()
    return {"message": f"Lokasi {loc.name} berhasil dihapus"}
