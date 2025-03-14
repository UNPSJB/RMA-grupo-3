# dependencia:  pip install python-multipart

# from fastapi import FastAPI
from fastapi import APIRouter, HTTPException, Depends, Request, Cookie
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse, JSONResponse
from typing import Annotated
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from dependencies import get_db 
from .usuarios import get_usuario
import datetime 

SECRET_KEY= "82816efa859efc154fd964bc4a0fcc4b416d8c55bd890ab118fc54dacba2886a"
ALGORITHM = "HS256"
TOKEN_MINUTES_EXP = 1
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


router = APIRouter()

def encode_token(payload: dict) -> str:
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=TOKEN_MINUTES_EXP)
    payload.update({"exp": expire})

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_token(token: Annotated [str, Depends(oauth2_scheme)]) -> dict:
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) 
        usuario = get_usuario(data["username"])
        return usuario
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

# OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):   
#    usuario = get_usuario(db, form_data.username)
@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):   
    #import pdb; pdb.set_trace()
    #print(form_data)
    usuario = get_usuario(form_data.username, db)
    if not form_data.username or not form_data.password:
        raise HTTPException(status_code=400, detail="Nombre de usuario y contraseña requeridos.")
    
    # usuario = get_usuario(form_data.password, db)
    if not usuario or form_data.password != usuario.password:
        raise HTTPException(status_code=400, detail="Nombre de usuario o contraseña incorrecto. (back)")

    token = encode_token({"username": usuario.user})
    return { "access_token": token } 

@router.get("/logout")
def logout():
    return { "access_token": None }
# RedirectResponse("/login", status_code=302, headers={ "set-code": "access_token=; Max-Age=0" })

@router.get("/dashboard")
def dashboard(user: Annotated[dict, Depends(decode_token)]):
    
    return user



""" @router.get("dashboard")
def dashboard(request: Request, token: str = Cookie(None)):
    if not token:
        return RedirectResponse("/", status_code=302)
    try:
        data_user = decode_token(token)
        return JSONResponse({"message": "Bienvenido al dashboard", "user": data_user})
    except JWTError:
        return RedirectResponse("/", status_code=302)

@router.post("/dashboard/logout")
def logout():
    return RedirectResponse("/", status_code=302, headers={ "set-code": "access_token=; Max-Age=0" }) """

# -------------------------------------------------------------------------------------------------------------------
""" 
# from fastapi import FastAPI
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse, JSONResponse
from typing import Annotated
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from dependencies import get_db  # Asegúrate de que esto es correcto
from database import Usuario, get_user
# from fastapi.middleware.cors import CORSMiddleware

SECRET_KEY= "secreto"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = ["http://localhost:3039"]

router = APIRouter()

"" usuarios = {
    "admin": {"username": "admin", "email": "admin@gmail.com", "password": "admin"},
    "invitado": {"username": "invitado", "email": "invitado@gmail.com", "password": "invitado"},
} ""

def encode_token(payload: dict) -> str:
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_token(token: Annotated[str, Depends(oauth2_scheme)]) -> dict:
    data = jwt.decode(token, "secreto", algorithms=["HS256"]) 
    usuario = Usuario.get(data["username"])

    return usuario
"" try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado") ""

@router.post("/token")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]): # db: Session = Depends(get_db)]):   
    usuario = Usuario.get(form_data.username)

    if not usuario or form_data.password != usuario["password"]:
        raise HTTPException(status_code=400, detail="Nombre de usuario o contraseña incorrecto.")

    token = encode_token({"username": usuario["username"], "email": usuario["email"]})

    return { "access_token": token} 

@router.get("/home") # profile -> home o dashboard (esta ruta es la que va a estar protegida)
def profile(mi_usuario: Annotated[dict, Depends(decode_token)]):
    return mi_usuario

"" @router.get("user/dashboard", response_class=HTMLResponse)
def dashboard(request: Request, access_token: Annotated[str | None, Cookie()] = None): 
    if access_token is None: 
        return RedirectResponse("/", status_code=302)
    try: 
        data_user = jwt.decode(access_token, key=SECRET_KEY, algorithms=["HS256"])
        if get_user(data_user "username", db_users) is None: · comprueba que el username exista en la DB
            return RedirectResponse("/", status_code=302) 
        return jinja2_template.TempalateResponse("dashboard.html", {"request": request}) 
    except JWTError: 
        return RedirectResponse("/", status_code=302) ""

@router.post("/users/logout")
def logout():
    return RedirectResponse("/", status_code=302, headers={ "set-code": "access_token=; Max-Age=0" })
 """
