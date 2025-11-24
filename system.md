
# Nganiriza System Architecture

## High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        User[User]
        Browser[Web Browser]
        PWA[PWA<br/>Progressive Web App<br/>Service Worker<br/>Offline Support]
    end

    subgraph "Frontend Service"
        Frontend[React Frontend<br/>Nginx Server]
        FrontendBuild[Production Build<br/>Static Assets]
    end

    subgraph "Backend Service"
        Backend[Backend<br/>Django]
        Database[(Database<br/>PostgreSQL)]
        Cache[(Cache<br/>Response Cache)]
    end

    subgraph "AI Service"
        Ollama[Ollama Service<br/>Kinyarwanda Model]
        AIModel[Gemma Model<br/>kinyarwanda-counseling]
    end

    subgraph "Docker Network"
        Network[nganiriza_network<br/>Bridge Network]
    end

    subgraph "Storage Volumes"
        StaticVol[Static Files]
        MediaVol[Media Files]
        ModelVol[AI Models]
        DataVol[Ollama Data]
    end

    %% User interactions
    User -->|Access| Browser
    Browser -->|Requests| Frontend
    Browser -->|Service Worker| PWA
    PWA -->|Cached| Frontend

    %% Frontend to Backend
    Frontend -->|Requests| Backend
    FrontendBuild -.->|Serves| Frontend

    %% Backend internal
    Backend -->|Read/Write| Database
    Backend -->|Read/Write| Cache

    %% Backend to AI Service
    Backend -->|Send| Ollama
    Ollama -->|Process| AIModel

    %% Network connections
    Frontend -.->|Network| Network
    Backend -.->|Network| Network
    Ollama -.->|Network| Network

    %% Storage connections
    Backend -.->|Mount| StaticVol
    Backend -.->|Mount| MediaVol
    Ollama -.->|Mount| ModelVol
    Ollama -.->|Mount| DataVol

    %% Styling
    classDef frontend fill:#61dafb,stroke:#20232a,stroke-width:2px,color:#000
    classDef backend fill:#092e20,stroke:#0d7377,stroke-width:2px,color:#fff
    classDef ai fill:#ff6b6b,stroke:#c92a2a,stroke-width:2px,color:#fff
    classDef storage fill:#ffd93d,stroke:#f6c23e,stroke-width:2px,color:#000
    classDef network fill:#a8e6cf,stroke:#3d5a80,stroke-width:2px,color:#000
    classDef client fill:#e8f4f8,stroke:#2c3e50,stroke-width:2px,color:#000

    class Frontend,FrontendBuild frontend
    class Backend,Database,Cache backend
    class Ollama,AIModel ai
    class StaticVol,MediaVol,ModelVol,DataVol storage
    class Network network
    class User,Browser,PWA client
```

## Service Communication Flow

```mermaid
sequenceDiagram
    participant User
    participant PWA as PWA<br/>Service Worker
    participant Frontend as React Frontend
    participant Backend as Backend<br/>Django
    participant Database as Database<br/>PostgreSQL
    participant Ollama as Ollama Service
    participant Model as AI Model

    User->>Frontend: Access Application
    Frontend->>PWA: Register Service Worker
    Frontend->>Frontend: Load React App

    User->>Frontend: Send Chat Message
    Frontend->>PWA: Check Cache
    alt Cache Hit
        PWA-->>Frontend: Return Cached
    else Cache Miss
        Frontend->>Backend: Send Query
        
        Backend->>Database: Write Message
        Database-->>Backend: Saved
        
        Backend->>Ollama: Generate
        Ollama->>Model: Process
        Model-->>Ollama: Response
        Ollama-->>Backend: Response
        
        Backend->>Database: Write Response
        Backend->>Database: Update Title
        Database-->>Backend: Saved
        
        Backend-->>Frontend: Return
        Frontend->>PWA: Cache
    end
    Frontend-->>User: Display Message
```

## Component Details

### Client Layer
- **User**: End user accessing the application
- **Web Browser**: Browser rendering the application
- **PWA (Progressive Web App)**:
  - Service Worker for offline functionality
  - Caching strategies
  - Installable app experience
  - Background sync capabilities

### Frontend Service
- **Technology**: React with Vite
- **Server**: Nginx (Alpine)
- **Responsibilities**:
  - User interface rendering
  - Communication
  - State management
  - Routing
  - PWA support

### Backend Service
- **Technology**: Django
- **Database**: PostgreSQL
- **Server**: Gunicorn with 3 workers
- **Responsibilities**:
  - Endpoints
  - Authentication & authorization
  - Database operations
  - Business logic
  - AI service orchestration

### AI Service (Ollama)
- **Technology**: Ollama Runtime
- **Model**: Gemma Kinyarwanda Counseling Model
- **Responsibilities**:
  - Natural language processing
  - Kinyarwanda language support
  - Health counseling responses
  - Model inference

## Data Flow

1. **User Request**: User sends message via frontend
2. **PWA Check**: Service Worker checks cache for offline support
3. **Frontend Processing**: React app sends request to backend
4. **Backend Processing**: Backend receives request, saves to database
5. **AI Query**: Backend forwards query to Ollama service
6. **Model Inference**: Ollama processes query using Gemma model
7. **Response**: AI response flows back through backend to frontend
8. **Caching**: PWA caches response for offline access
9. **Display**: Frontend updates UI with AI response

## Network Architecture

- **Network Type**: Docker Bridge Network (`nganiriza_network`)
- **Service Discovery**: Container names (ollama1, backend, frontend)
- **Internal Communication**: Requests between services
- **External Access**: Client access via network

## Storage Architecture

- **Static Files**: Backend static assets (CSS, JS, images)
- **Media Files**: User-uploaded content
- **AI Models**: Gemma model files (.gguf)
- **Ollama Data**: Model cache and runtime data
- **PWA Cache**: Service Worker cache for offline functionality
