import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
APP_DIR = BASE_DIR / "app"
STORAGE_DIR = BASE_DIR / "storage"
UPLOAD_DIR = STORAGE_DIR / "uploads"
ANNOTATED_DIR = STORAGE_DIR / "annotated"
REPORTS_DIR = STORAGE_DIR / "reports"
MODELS_WEIGHT_DIR = BASE_DIR / "models_weight"
MODEL_PATH = MODELS_WEIGHT_DIR / "best_crack_detector.pth"

# Ensure directories exist
for directory in [UPLOAD_DIR, ANNOTATED_DIR, REPORTS_DIR, MODELS_WEIGHT_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Security & Database Settings
SECRET_KEY = os.getenv("SECRET_KEY", "crack_inspection_secret_jwt_key_2026_super_secure")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{STORAGE_DIR / 'crack_inspection.db'}")
