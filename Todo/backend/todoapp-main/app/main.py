from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_db, init_db
from routers import admin, user, task
from auth import router as auth_router

# Create FastAPI app instance
app = FastAPI()

# List of origins allowed to make requests (you can modify this based on your frontend settings)
origins = [
    "http://localhost:3000",  # Allow localhost:3000 (your frontend)
    # You can add more origins here as needed
]

# Add CORS middleware to handle cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Specifies the allowed origins to access the API
    allow_credentials=True,  # Allow credentials (cookies or headers) to be included in requests
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers (Content-Type, Authorization, etc.)
)

# Ensure the database is initialized when the app starts up
@app.on_event("startup")
async def startup():
    # Call to initialize the database
    await init_db()

# Include the routers for authentication, user, task, and admin
# The prefix here defines the base path for each router
app.include_router(auth_router, prefix="/auth", tags=["Auth"])  # Authentication routes under /auth
app.include_router(admin.router, prefix="/admin", tags=["Admin"])  # Admin routes under /admin
app.include_router(user.router, prefix="/user", tags=["User"])  # User routes under /user
app.include_router(task.router, prefix="/task", tags=["Task"])  # Task routes under /task
