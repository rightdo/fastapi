from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from sqlalchemy.orm import Session
from typing import Annotated, List


app = FastAPI()

origins = [ 'http://localhost:3000']

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']

)

class TransactionBase(BaseModel):
    amount : float
    category: str
    description : str
    is_income: bool
    date:str

class TranscationModel(TransactionBase):
    id : int

    class Config:
        from_attributes = True

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
models.Base.metadata.create_all(bind=engine) # 테이블을 처음 생성할때 실행하는 코드, 기존 테이블이 있을때는 삭제 또는 오류 발생함

@app.post("/transactions/", response_model=TranscationModel)
async def create_transaction(transaction: TransactionBase, db : db_dependency):
    db_transaction = models.Transaction(**transaction.model_dump()) #딕셔너리 데이터를 언패킹할때 **기호를 사용함.
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/transactions/", response_model=List[TranscationModel])
async def read_transactions(db:db_dependency, skip: int=0, limit: int = 100):
    transactions = db.query(models.Transaction).offset(skip).limit(limit).all()
    return transactions

