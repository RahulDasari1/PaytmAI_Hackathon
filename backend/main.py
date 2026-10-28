import sys
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Ensure backend package can be imported
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.data.database import init_db
from backend.data.generator import generate_synthetic_data
from backend.routes import dashboard, copilot, sales, customers, inventory, campaigns, demo

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database and seed synthetic data
    init_db()
    count = generate_synthetic_data(num_days=90, force=False)
    print(f">> Dukaan Saathi AI Backend Ready. Database initialized with {count} transactions.")
    yield

app = FastAPI(
    title="Dukaan Saathi AI API",
    description="Your AI Business Growth Partner for Indian Retail Merchants",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for development and tunnels
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API route modules
app.include_router(dashboard.router)
app.include_router(copilot.router)
app.include_router(sales.router)
app.include_router(customers.router)
app.include_router(inventory.router)
app.include_router(campaigns.router)
app.include_router(demo.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Dukaan Saathi AI Backend",
        "version": "1.0.0"
    }

# Production SPA static file serving
FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if FRONTEND_DIST.exists():
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api"):
            return None
        file_path = FRONTEND_DIST / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
