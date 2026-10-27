import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import STORAGE_DIR, UPLOAD_DIR, ANNOTATED_DIR, REPORTS_DIR, MODELS_WEIGHT_DIR, MODEL_PATH
from app.core.database import Base, engine, SessionLocal
from app.models.schema import User, Location, Inspection
from app.api import auth, locations, inspections
from app.api.auth import hash_password
from app.services.ai_scanner import scan_image_with_grid
from app.services.pdf_generator import generate_inspection_pdf
from PIL import Image, ImageDraw


def seed_initial_data():
    """Seeds initial master data and sample inspection on first run"""
    db = SessionLocal()
    try:
        # 1. Seed Default Admin User
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin_user = User(
                username="admin",
                email="admin@crackinspect.ai",
                full_name="Ir. Hendra Pratama, S.T.",
                role="Lead Inspector",
                hashed_password=hash_password("admin123")
            )
            db.add(admin_user)
            db.commit()
            print("[Seeder] Created default admin user: admin / admin123")

        # 2. Seed Master Locations (Infrastructure in Indonesia)
        if db.query(Location).count() == 0:
            sample_locations = [
                Location(
                    name="Jembatan Suramadu - Pier P46",
                    type="Jembatan",
                    address="Selat Madura, Jawa Timur",
                    latitude=-7.1852,
                    longitude=112.7845,
                    description="Pilar utama tumpuan bentang tengah jembatan cable-stayed."
                ),
                Location(
                    name="Menara Astra - Kolom B2",
                    type="Gedung",
                    address="Jl. Jend. Sudirman Kav. 5-6, Jakarta Pusat",
                    latitude=-6.2088,
                    longitude=106.8227,
                    description="Kolom struktural penopang beban zona basement area parkir B2."
                ),
                Location(
                    name="Bendungan Jatiluhur - Dinding Spillway",
                    type="Bendungan",
                    address="Kabupaten Purwakarta, Jawa Barat",
                    latitude=-6.5218,
                    longitude=107.3912,
                    description="Dinding saluran pelimpah air utama bendungan."
                ),
                Location(
                    name="Jembatan Pasupati - Girder Sayap Barat",
                    type="Jembatan",
                    address="Jl. Pasteur, Kota Bandung, Jawa Barat",
                    latitude=-6.8995,
                    longitude=107.6033,
                    description="Girder beton prategang bentang pendek flyover."
                )
            ]
            for loc in sample_locations:
                db.add(loc)
            db.commit()
            print("[Seeder] Seeded 4 initial infrastructure locations.")

        # 3. Seed Starter Inspection with Generated Concrete Crack Image if empty
        if db.query(Inspection).count() == 0:
            suramadu = db.query(Location).filter(Location.name.like("%Suramadu%")).first()
            if suramadu:
                demo_img_name = "sample_concrete_crack.jpg"
                demo_img_path = UPLOAD_DIR / demo_img_name
                
                # Create a realistic concrete texture image with simulated crack
                img = Image.new("RGB", (720, 720), (185, 188, 192))
                draw = ImageDraw.Draw(img)
                # Concrete noise & subtle speckles
                import random
                for _ in range(4000):
                    px = random.randint(0, 719)
                    py = random.randint(0, 719)
                    c = random.randint(140, 210)
                    draw.point((px, py), fill=(c, c, c))

                # Draw crack line through cells (row 2-4, col 2-4)
                crack_points = [
                    (180, 210), (220, 260), (260, 310), (290, 330),
                    (330, 400), (370, 440), (410, 520), (440, 560), (470, 600)
                ]
                for i in range(len(crack_points) - 1):
                    draw.line([crack_points[i], crack_points[i+1]], fill=(45, 42, 40), width=4)
                    # Micro branch
                    bx = crack_points[i][0] + random.randint(-15, 20)
                    by = crack_points[i][1] + random.randint(-10, 30)
                    draw.line([crack_points[i], (bx, by)], fill=(60, 55, 52), width=2)

                img.save(demo_img_path, format="JPEG", quality=90)

                # Process AI scan
                scan_res = scan_image_with_grid(str(demo_img_path), grid_rows=6, grid_cols=6)
                
                demo_insp = Inspection(
                    location_id=suramadu.id,
                    inspector_name="Ir. Hendra Pratama, S.T.",
                    notes="Pemantauan keretakan geser diagonal pada permukaan beton pilar P46 paska beban dinamis.",
                    original_image=demo_img_name,
                    annotated_image=scan_res["annotated_filename"],
                    total_grids=scan_res["total_grids"],
                    crack_grids=scan_res["crack_grids"],
                    crack_ratio=scan_res["crack_ratio"],
                    severity_level=scan_res["severity_level"]
                )
                demo_insp.grid_data = scan_res["grid_data"]
                db.add(demo_insp)
                db.commit()
                db.refresh(demo_insp)

                # Generate initial PDF
                pdf_name = generate_inspection_pdf(
                    inspection_id=demo_insp.id,
                    location_name=suramadu.name,
                    location_type=suramadu.type,
                    address=suramadu.address,
                    inspector_name=demo_insp.inspector_name,
                    notes=demo_insp.notes,
                    original_image_path=str(demo_img_path),
                    annotated_image_path=str(ANNOTATED_DIR / scan_res["annotated_filename"]),
                    total_grids=demo_insp.total_grids,
                    crack_grids=demo_insp.crack_grids,
                    crack_ratio=demo_insp.crack_ratio,
                    severity_level=demo_insp.severity_level,
                    grid_data=demo_insp.grid_data,
                    created_at=demo_insp.created_at
                )
                demo_insp.report_pdf = pdf_name
                db.commit()
                print("[Seeder] Created initial demo inspection record with AI scan and PDF.")

    except Exception as e:
        print(f"[Seeder] Note: {e}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed demo data
    Base.metadata.create_all(bind=engine)
    seed_initial_data()
    yield
    # Shutdown logic if any


app = FastAPI(
    title="Crack Inspection Platform API",
    description="Sistem Pemantauan dan Pemindaian Keretakan Beton AI Menggunakan ResNet-18 Grid Slicing",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Storage Directory (uploads, annotated images, reports)
app.mount("/storage", StaticFiles(directory=str(STORAGE_DIR)), name="storage")

# Include API Routers
app.include_router(auth.router, prefix="/api")
app.include_router(locations.router, prefix="/api")
app.include_router(inspections.router, prefix="/api")


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Crack Inspection Platform API",
        "version": "1.0.0",
        "docs": "/docs",
        "model_architecture": "ResNet-18 Grid Slicing"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
