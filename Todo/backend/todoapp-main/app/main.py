from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_db, init_db
from routers import admin, user, task
from auth import router as auth_router

app = FastAPI()

# List of origins allowed to make requests
origins = [
    "http://localhost:3000",  # You can add more origins here if needed
]

# Adding CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Specifies which origins are allowed to access the API
    allow_credentials=True,  # Allows cookies or other credentials to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers (including custom headers like Content-Type)
)

# Ensure the database is initialized when the app starts
@app.on_event("startup")
async def startup():
    await init_db()

# Include routers for auth, admin, user, and task
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(admin.router, prefix="/admin")
app.include_router(user.router)
app.include_router(task.router, prefix="/task")
