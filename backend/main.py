from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class Tutorial(BaseModel):
    id: str = Field(..., description="Identificador único do tutorial (slug)")
    title: str = Field(..., description="Título do tutorial")
    steps: List[str] = Field(..., description="Lista de passos do procedimento")
    updatedAt: str = Field(..., description="Data da última atualização (formato ideal: YYYY-MM-DD)")

# Inicialização da aplicação FastAPI
app = FastAPI(
    title="APH API - Dev",
    description="API de suporte para atendimentos de primeiros socorros (APH)."
)

# 2. Configuração de CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Atenção: limitar em produção!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dados seria melhor levar para outro arquivo
TUTORIALS: List[Tutorial] = [
    {
        "id": "rcp",
        "title": "RCP (Parada Cárdiaca)",
        "steps": [
            "Verifique segurança da cena",
            "Confirme responsividade e respiração",
            "Ligue 192 e peça DEA",
            "Compressões 100–120/min, ~5cm (adulto)"
        ],
        "updatedAt": "2025-09-01"
    }, # <--- Vírgula OK
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
    }, # <--- Vírgula OK
    {
        "id": "queimadura",
        "title": "Queimaduras (Primeiros Socorros)",
        "steps": [
            "Remova roupas e joias (se não grudadas).",
            "Resfrie com água corrente fria (10 a 20 minutos).",
            "Cubra com curativo limpo e seco.",
            "NÃO use gelo ou manteiga."
        ],
        "updatedAt": "2025-09-26"
    }, 
    {
        "id": "sangramento",
        "title": "Hemorragia Externa (Sangramento)",
        "steps": [
            "Aplique pressão direta e firme sobre o ferimento.",
            "Use um pano ou gaze limpa e não remova.",
            "Se for um membro, eleve-o se não houver dor.",
            "Ligue para emergência se não parar rapidamente."
        ],
        "updatedAt": "2025-09-26"
    }, # <--- Vírgula OK
    {
        "id": "convulsao",
        "title": "Convulsões (Crise Epiléptica)",
        "steps": [
            "Mantenha a calma e afaste objetos perigosos.",
            "Coloque algo macio sob a cabeça.",
            "Vire a pessoa gentilmente de lado.",
            "Não coloque nada na boca e cronometre o tempo."
        ],
        "updatedAt": "2025-09-26"
    } # <--- Último item (sem vírgula, está correto)
]


@app.get("/health", summary="Verifica a saúde da API")
def health() -> dict:
    """Endpoint simples para verificar se a API está online."""
    return {"ok": True}

@app.get("/tutorials", response_model=List[Tutorial], summary="Lista todos os tutoriais de primeiros socorros")
def list_tutorials():
    """Retorna a lista completa de tutoriais disponíveis."""
    return TUTORIALS

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)