# Meu Projeto APH

## Pastas
- frontend: app mobile (Expo/React Native)
- backend: API (FastAPI/Python)
- database: SQL/migrations
- library: imagens, funcoes

## Programas necessários
### 1. [**Node.js**](https://nodejs.org/en/)
- Necessário para rodar o Expo/React Native.
- Durante a instalação, marque a opção “Add to PATH”.

### 2. [**Python 3.10+**](https://www.python.org/downloads/)
- Necessário para rodar o backend (FastAPI).
- Na instalação, marque a opção “Add Python to PATH”.

### 3. [**Visual Studio Code (VS Code)**](https://code.visualstudio.com/Download)  
   - Editor de código recomendado.  
   - Instalar extensões:  
     - **Python** (Microsoft)  
     - **ES7+ React/Redux/React-Native snippets**  
     - **Expo Tools** (opcional)

### 4. Expo Go (no celular)  
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779)  
   - Para rodar o app escaneando o QR Code.

## Clonando o Repositório git
-  **No Vs Code**
    - Entre em "SOURCE CONTROL" (CTRL+SHIFT+G)
    - Selecione "CLONE REPOSITORY"
    - Cole o seguinte URL: "https://github.com/Jaffer-Neto/PROJETI"
    - Selecione uma pasta para guardar os arquivos

- Com o repositório já clonado a estrutura de pastas será:
    - /PROJETI
    - /backend
    - /database
    - /frontend
    - /library

## Rodando o frontend
- **No Vs Code**
    - Abra um novo terminal: View -> Terminal | CTRL+'
    - Aperte na seta para baixo que está entre o + e ...
    - Selecione "Command Prompt"

- **No terminal aberto**
    - **1. Entre na pasta**
        - cd frontend
    - **2. Instale as dependências**
        - npm install
    - **3. Inicie o servidor expo**
        - npm start

Não ligue para os erros, são falsos, aperte CTRL+SHIFT+P -> digite e selecione Developer: reload window.

- **No celular**
    - Abra o Expo Go
    - Escaneie o Qrcode que aparece no terminal
    - O app será carregado no celular

__importante: O celular e o pc devem estar conectados no mesmo Wi-fi__

## Rodando o backend
- **No Vs Code**
    - Abra um novo terminal: View -> Terminal | CTRL+'
    - Aperte na seta para baixo que está entre o + e ...
    - Selecione "Command Prompt"

- **No novo terminal**
    - **1. Entre na pasta**
        - cd backend
    - **2. Crie um ambiente virtual (somente na primeira vez)**
        - python -m venv .venv  |  py -m venv .venv
    - **3. Ative o ambiente**
        - .venv\Scripts\Activate
    - **4. Instale as dependências**
        - pip install -r requirements.txt
    - **5. Rode o servidor**
        - python main.py  |  execute pressionando o botão de execução no canto superior direito do Vs code
    - **6. Teste no navegador**
        - API: http://localhost:8000/health -> deve retornar {"ok":true}
        - Documentação: http://localhost:8000/docs -> deve retornar um código JSON
    - **7. Para testar no celular (mesma rede Wi-Fi)**
        - Descubra o IP do seu PC (ipconfig no Windows, ifconfig no Linux/Mac).
        - No celular, abra http://(ip do seu pc):8000/health

## Conexão entre backend e frontend
- **No código do frontend/App.tsx, a API está configurada assim:**
    - const API = "http://192.168.0.136:8000"; // troque pelo IP da SUA máquina
- Cada um deve editar essa linha com o seu própio ip, mantendo o :8000

## Teste final
- Abra o backend (python main.py) → veja no terminal rodando em http://0.0.0.0:8000.
- Abra o frontend (npm start) → leia o QR no Expo Go.
- A tela inicial deve aparecer com os botões de emergência.
- Toque em “📚 Ver tutoriais” → deve listar os tutoriais vindos da API.
- Toque em um tutorial → abre a tela de detalhes com os passos.