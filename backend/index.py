from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.user import user
from routes.material import material
from routes.feedback import feedback

app = FastAPI()
origins = ["http://localhost:5173", "https://composite-material-calculator.vercel.app"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(user)
app.include_router(material)
app.include_router(feedback)



