from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_db, init_db
from routers import admin, user, task
from auth import router as auth_router

app = FastAPI()

origins = [
    "http://localhost:3000",  
  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.on_event("startup")
async def startup():
 
    await init_db()


app.include_router(auth_router, prefix="/auth", tags=["Auth"])  
app.include_router(admin.router, prefix="/admin", tags=["Admin"]) 
app.include_router(user.router, prefix="/user", tags=["User"])  
app.include_router(task.router, prefix="/task", tags=["Task"]) 
