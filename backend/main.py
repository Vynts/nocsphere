from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, user, invoice, routers
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*']
)

# Register blueprint app
app.include_router(auth.router)
app.include_router(routers.router)
app.include_router(user.router)
app.include_router(invoice.router)

