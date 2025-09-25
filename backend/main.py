from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="APH API - Dev")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TUTORIALS = [
    {
        "id": "rcp-leigo",
        "title": "RCP (leigo) – passos básicos",
        "steps": [
            "Verifique segurança da cena",
            "Confirme responsividade e respiração",
            "Ligue 192 e peça DEA",
            "Compressões 100–120/min, ~5cm (adulto)"
        ],
        "updatedAt": "2025-09-01"
    },
    {
        "id": "engasgo",
        "title": "Engasgo (adulto consciente)",
        "steps": [
            "Pergunte se está engasgado",
            "5 tapas nas costas",
            "Manobra de Heimlich",
            "Ligue 192"
        ],
        "updatedAt": "2025-09-01"
    }
]

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/tutorials")
def list_tutorials():
    return TUTORIALS

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
