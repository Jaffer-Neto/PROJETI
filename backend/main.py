# main.py
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


class Tutorial(BaseModel):
    id: str = Field(..., description="Identificador único do tutorial (slug)")
    title: str = Field(..., description="Título do tutorial")

    # Passos padrão (fallback para quando não houver perfil específico)
    steps: List[str] = Field(..., description="Lista de passos do procedimento (padrão)")

    # Campos opcionais por perfil (o app usa se existirem)
    stepsAdult: Optional[List[str]] = Field(
        default=None,
        description="Passos específicos para Adulto (opcional)"
    )
    stepsChild: Optional[List[str]] = Field(
        default=None,
        description="Passos específicos para Criança (opcional)"
    )
    stepsNewborn: Optional[List[str]] = Field(
        default=None,
        description="Passos específicos para Recém-Nascido (opcional)"
    )

    updatedAt: str = Field(..., description="Data da última atualização (YYYY-MM-DD)")


# Inicialização da aplicação FastAPI
app = FastAPI(
    title="APH API - Dev",
    description="API de suporte para atendimentos de primeiros socorros (APH)."
)

# CORS (atenção em produção)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # limite em produção!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Dados de exemplo ===
# Observação: agora alguns itens têm steps específicos por perfil;
# os que não tiverem continuam funcionando via 'steps' (fallback).
TUTORIALS: List[Tutorial] = [
    {
        "id": "rcp",
        "title": "RCP (Parada Cardíaca)",
        "steps": [
            "Verifique segurança da cena",
            "Confirme responsividade e respiração",
            "Ligue 192 e peça DEA",
            "Compressões 100–120/min"
        ],
        "stepsAdult": [
            "Compressões a ~5 cm de profundidade (adulto)",
            "Ventilações 30:2 se treinado e com barreira",
        ],
        "stepsChild": [
            "Compressões a ~5 cm ou 1/3 do tórax (criança)",
            "Use uma mão se necessário; ventilações 30:2",
        ],
        "stepsNewborn": [
            "RCP 3:1 (3 compressões / 1 ventilação)",
            "Aquecimento e via aérea primeiro; O2 conforme protocolo",
        ],
        "updatedAt": "2025-09-26"
    },
    {
        "id": "engasgo",
        "title": "Engasgo (consciente)",
        "steps": [
            "Pergunte se está engasgado e se consegue tossir/falar",
            "Se não conseguir, aplique 5 tapas nas costas",
            "Manobra abdominal (Heimlich) conforme necessário",
            "Ligue 192"
        ],
        "stepsChild": [
            "Para criança pequena: ajoelhe-se ao nível da criança",
            "Combine tapas nas costas e compressões torácicas",
        ],
        "stepsNewborn": [
            "Alternar 5 tapas nas costas e 5 compressões no esterno",
            "Posicionamento: cabeça mais baixa que o tronco",
        ],
        "updatedAt": "2025-09-26"
    },
    {
        "id": "queimadura",
        "title": "Queimaduras (Primeiros Socorros)",
        "steps": [
            "Resfrie com água corrente (10–20 min)",
            "Remova acessórios se não grudados",
            "Cubra com curativo limpo e seco",
            "NÃO use gelo ou manteiga"
        ],
        "updatedAt": "2025-09-26"
    },
    {
        "id": "sangramento",
        "title": "Hemorragia Externa (Sangramento)",
        "steps": [
            "Pressão direta firme no ferimento",
            "Não remova o curativo se encharcar — sobreponha",
            "Eleve o membro se não houver dor/lesão",
            "Acione emergência se persistir"
        ],
        "updatedAt": "2025-09-26"
    },
    {
        "id": "convulsao",
        "title": "Convulsões (Crise Epiléptica)",
        "steps": [
            "Afaste objetos perigosos e proteja a cabeça",
            "Cronometre a duração",
            "Após a crise, posicione em decúbito lateral",
            "Não coloque nada na boca"
        ],
        "updatedAt": "2025-09-26"
    },
]


@app.get("/health", summary="Verifica a saúde da API")
def health() -> dict:
    return {"ok": True}


@app.get("/tutorials", response_model=List[Tutorial], summary="Lista todos os tutoriais")
def list_tutorials():
    return TUTORIALS


@app.get(
    "/tutorials/{tutorial_id}",
    response_model=Tutorial,
    summary="Obtém um tutorial pelo ID"
)
def get_tutorial(tutorial_id: str):
    for t in TUTORIALS:
        if t.id == tutorial_id:
            return t
    raise HTTPException(status_code=404, detail="Tutorial não encontrado")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
