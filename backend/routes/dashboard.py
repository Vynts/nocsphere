from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(
 prefix='/api/dashboard',
 tags=["Dashboard API"]
)