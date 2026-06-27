import os
import aiomysql
from aiomysql import Connection
from dotenv import load_dotenv

load_dotenv()

async def database_connection():
    db : Connection = await aiomysql.connect(
        host = os.getenv('host'),
        user = os.getenv('user'),
        password = os.getenv('password'),
        db = os.getenv('database'),
        cursorclass=aiomysql.cursors.DictCursor
    )
    try:
        yield db

    finally:
        db.close()