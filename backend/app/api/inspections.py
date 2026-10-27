import os
import uuid
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.config import UPLOAD_DIR, ANNOTATED_DIR, REPORTS_DIR
from app.core.database import get_db
from app.models.schema import Inspection, Location, InspectionOut, SummaryStats
from app.services.ai_scanner import scan_image_with_grid
from app.services.pdf_generator import generate_inspection_pdf

router = APIRouter(prefix="/inspections", tags=["Inspections"])


@router.post("/scan", response_model=InspectionOut)
async def upload_and_scan_inspection(
    file: UploadFile = File(...),
    location_id: int = Form(...),
    inspector_name: str = Form("Inspektor Lapangan"),
    notes: Optional[str] = Form(""),
    db: Session = Depends(get_db)
):
    # Check if location exists
    loc = db.query(Location).filter(Location.id == location_id).first()
    if not loc:
        raise HTTPException(status_code=404, detail="Lokasi tidak ditemukan")

    # Validate image extension
    allowed_extensions = [".jpg", ".jpeg", ".png", ".webp", ".bmp"]
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Format berkas harus berupa gambar (JPG, PNG, WEBP)")

    # Save uploaded file
    file_id = uuid.uuid4().hex[:12]
    orig_filename = f"upload_{file_id}{ext}"
    orig_file_path = UPLOAD_DIR / orig_filename

    with open(orig_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 1. Run ResNet-18 Grid Slicing AI Scan
        scan_result = scan_image_with_grid(
            image_path=str(orig_file_path),
            grid_rows=6,
            grid_cols=6
        )

        annotated_filename = scan_result["annotated_filename"]
        annotated_file_path = ANNOTATED_DIR / annotated_filename

        # 2. Pre-create DB Inspection record to get ID
        new_inspection = Inspection(
            location_id=loc.id,
            inspector_name=inspector_name,
            notes=notes,
            original_image=orig_filename,
            annotated_image=annotated_filename,
            total_grids=scan_result["total_grids"],
            crack_grids=scan_result["crack_grids"],
            crack_ratio=scan_result["crack_ratio"],
            severity_level=scan_result["severity_level"]
        )
        new_inspection.grid_data = scan_result["grid_data"]

        db.add(new_inspection)
        db.commit()
        db.refresh(new_inspection)

        # 3. Generate ReportLab PDF Document
        pdf_filename = generate_inspection_pdf(
            inspection_id=new_inspection.id,
            location_name=loc.name,
            location_type=loc.type,
            address=loc.address or "",
            inspector_name=inspector_name,
            notes=notes or "",
            original_image_path=str(orig_file_path),
            annotated_image_path=str(annotated_file_path),
            total_grids=new_inspection.total_grids,
            crack_grids=new_inspection.crack_grids,
            crack_ratio=new_inspection.crack_ratio,
            severity_level=new_inspection.severity_level,
            grid_data=new_inspection.grid_data,
            created_at=new_inspection.created_at
        )

        # Update report_pdf in inspection
        new_inspection.report_pdf = pdf_filename
        db.commit()
        db.refresh(new_inspection)

        return InspectionOut(
            id=new_inspection.id,
            location_id=new_inspection.location_id,
            location_name=loc.name,
            location_type=loc.type,
            inspector_name=new_inspection.inspector_name,
            notes=new_inspection.notes,
            original_image=new_inspection.original_image,
            annotated_image=new_inspection.annotated_image,
            report_pdf=new_inspection.report_pdf,
            total_grids=new_inspection.total_grids,
            crack_grids=new_inspection.crack_grids,
            crack_ratio=new_inspection.crack_ratio,
            severity_level=new_inspection.severity_level,
            grid_data=new_inspection.grid_data,
            created_at=new_inspection.created_at
        )

    except Exception as e:
        # In case of scan error, clean up original upload if needed
        raise HTTPException(status_code=500, detail=f"Gagal memproses pemindaian AI: {str(e)}")


@router.get("/", response_model=List[InspectionOut])
def get_inspections(
    location_id: Optional[int] = None,
    severity: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Inspection).join(Location)

    if location_id:
        query = query.filter(Inspection.location_id == location_id)
    if severity:
        query = query.filter(Inspection.severity_level == severity)
    if search:
        query = query.filter(
            (Location.name.ilike(f"%{search}%")) |
            (Inspection.inspector_name.ilike(f"%{search}%")) |
            (Inspection.notes.ilike(f"%{search}%"))
        )

    inspections = query.order_by(Inspection.id.desc()).limit(limit).all()

    results = []
    for insp in inspections:
        results.append(InspectionOut(
            id=insp.id,
            location_id=insp.location_id,
            location_name=insp.location.name if insp.location else "Unknown",
            location_type=insp.location.type if insp.location else "Unknown",
            inspector_name=insp.inspector_name,
            notes=insp.notes,
            original_image=insp.original_image,
            annotated_image=insp.annotated_image,
            report_pdf=insp.report_pdf,
            total_grids=insp.total_grids,
            crack_grids=insp.crack_grids,
            crack_ratio=insp.crack_ratio,
            severity_level=insp.severity_level,
            grid_data=insp.grid_data,
            created_at=insp.created_at
        ))
    return results


@router.get("/stats/summary", response_model=SummaryStats)
def get_inspection_stats(db: Session = Depends(get_db)):
    total_inspections = db.query(func.count(Inspection.id)).scalar() or 0
    total_locations = db.query(func.count(Location.id)).scalar() or 0

    critical_count = db.query(func.count(Inspection.id)).filter(Inspection.severity_level == "Kritis").scalar() or 0
    moderate_count = db.query(func.count(Inspection.id)).filter(Inspection.severity_level == "Sedang").scalar() or 0
    minor_count = db.query(func.count(Inspection.id)).filter(Inspection.severity_level == "Ringan").scalar() or 0
    safe_count = db.query(func.count(Inspection.id)).filter(Inspection.severity_level == "Aman").scalar() or 0

    avg_crack = db.query(func.avg(Inspection.crack_ratio)).scalar() or 0.0

    return SummaryStats(
        total_inspections=total_inspections,
        total_locations=total_locations,
        critical_count=critical_count,
        moderate_count=moderate_count,
        minor_count=minor_count,
        safe_count=safe_count,
        avg_crack_ratio=round(float(avg_crack), 1)
    )


@router.get("/{inspection_id}", response_model=InspectionOut)
def get_inspection_detail(inspection_id: int, db: Session = Depends(get_db)):
    insp = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Data inspeksi tidak ditemukan")

    return InspectionOut(
        id=insp.id,
        location_id=insp.location_id,
        location_name=insp.location.name if insp.location else "Unknown",
        location_type=insp.location.type if insp.location else "Unknown",
        inspector_name=insp.inspector_name,
        notes=insp.notes,
        original_image=insp.original_image,
        annotated_image=insp.annotated_image,
        report_pdf=insp.report_pdf,
        total_grids=insp.total_grids,
        crack_grids=insp.crack_grids,
        crack_ratio=insp.crack_ratio,
        severity_level=insp.severity_level,
        grid_data=insp.grid_data,
        created_at=insp.created_at
    )


@router.get("/{inspection_id}/pdf")
def download_inspection_pdf(inspection_id: int, db: Session = Depends(get_db)):
    insp = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not insp or not insp.report_pdf:
        raise HTTPException(status_code=404, detail="Berkas laporan PDF belum dibuat")

    pdf_path = REPORTS_DIR / insp.report_pdf
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail="Berkas fisik PDF tidak ditemukan di server")

    return FileResponse(
        path=str(pdf_path),
        filename=insp.report_pdf,
        media_type="application/pdf"
    )


@router.delete("/{inspection_id}")
def delete_inspection(inspection_id: int, db: Session = Depends(get_db)):
    insp = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not insp:
        raise HTTPException(status_code=404, detail="Data inspeksi tidak ditemukan")

    # Clean files
    for filename, directory in [(insp.original_image, UPLOAD_DIR), (insp.annotated_image, ANNOTATED_DIR), (insp.report_pdf, REPORTS_DIR)]:
        if filename:
            file_p = directory / filename
            if file_p.exists():
                try:
                    os.remove(file_p)
                except Exception:
                    pass

    db.delete(insp)
    db.commit()
    return {"message": f"Data inspeksi #{inspection_id} berhasil dihapus"}
