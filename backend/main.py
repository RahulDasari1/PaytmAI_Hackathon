import sys
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

# CORS configuration for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all route modules
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
