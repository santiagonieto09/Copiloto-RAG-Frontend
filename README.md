# 💬 Copiloto RAG Frontend

> Interfaz web moderna para el **Copiloto Financiero RAG**: chat conversacional con documentos financieros indexados mediante RAG.

[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6.svg)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4.svg)](https://tailwindcss.com)

---

## 📋 Descripción

Cliente web del **Copiloto Financiero RAG** que permite a los usuarios interactuar con el asistente de IA mediante una interfaz conversacional. Soporta dos modos de chat (con y sin RAG), gestión de documentos indexados y monitoreo del estado del backend en tiempo real.

### Características principales:
- Chat conversacional con respuestas en streaming
- Soporte para Markdown enriquecido en las respuestas
- Subida de documentos PDF, TXT y DOCX
- Panel de fuentes citadas por el RAG
- Modo claro/oscuro con persistencia
- Indicador de estado del backend en tiempo real

---

## 🏗️ Arquitectura

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Usuario     │────▶│  React App    │────▶│ Axios Client │
│  (Navegador)  │◀────│  + Tailwind   │◀────│  (HTTP)      │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │   Backend    │
                                          │  FastAPI RAG │
                                          └──────────────┘
```

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Propósito |
|---|---|---|
| **UI Library** | React 18 | Biblioteca de componentes |
| **Lenguaje** | TypeScript | Tipado estático |
| **Build Tool** | Vite | Bundler y dev server ultrarrápido |
| **Estilos** | Tailwind CSS | Utility-first CSS framework |
| **HTTP Client** | Axios | Llamadas a la API REST |
| **Markdown** | react-markdown | Renderizado de respuestas |
| **Iconos** | lucide-react | Iconografía moderna |

---

## 🚀 Instalación

### Requisitos
- Node.js 18+ y npm
- Backend del [Copiloto Financiero RAG](../Copiloto%20Financiero%20RAG/README.md) corriendo

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/copiloto-rag-frontend.git
cd copiloto-rag-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env y configurar la URL del backend

# 4. Ejecutar en modo desarrollo
npm run dev
```

La aplicación abrirá en `http://localhost:5173`.

### Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción en `dist/` |
| `npm run preview` | Previsualiza el build de producción |

---

## ⚙️ Variables de Entorno

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_BASE_URL` | URL del backend del Copiloto RAG | `http://localhost:8000` |

### Ejemplo `.env`

```env
# Desarrollo local
VITE_API_BASE_URL=http://localhost:8000

# Producción (Render)
# VITE_API_BASE_URL=https://tu-proyecto.onrender.com
```

---

## 🎨 Funcionalidades

### Chat
- **Modo RAG**: Consultas sobre documentos indexados (`POST /api/v1/chat`)
- **Modo Directo**: Conversación general con el LLM (`POST /api/v1/chat/direct`)
- **Historial de sesión**: Conversaciones mantienen contexto por `session_id`
- **Markdown**: Respuestas con formato enriquecido (tablas, código, listas)

### Documentos
- **Carga de archivos**: Soporte para `.pdf`, `.txt`, `.docx`
- **Panel local**: Lista de documentos cargados persistida en `localStorage`
- **Limpieza**: Opción para eliminar la colección de documentos del backend

### UI/UX
- **Tema claro/oscuro**: Toggle con persistencia en `localStorage`
- **Toasts**: Notificaciones de éxito/error
- **Tooltips**: Información contextual
- **Diálogos de confirmación**: Para acciones destructivas
- **Health check**: Indicador del estado del backend (`GET /api/v1/health`)

---

## 📁 Estructura del Proyecto

```
copiloto-rag-frontend/
├── public/                      # Assets estáticos
├── src/
│   ├── api/
│   │   └── client.ts            # Cliente Axios y llamadas a la API
│   ├── components/
│   │   ├── Chat/                # Componentes del chat
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── SourcesPanel.tsx
│   │   ├── Documents/           # Gestión de documentos
│   │   │   ├── DocumentsPanel.tsx
│   │   │   └── DocumentUpload.tsx
│   │   ├── Layout/
│   │   │   └── AppShell.tsx     # Layout principal
│   │   ├── UI/                  # Componentes reutilizables
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Tooltip.tsx
│   │   └── HealthStatus.tsx
│   ├── context/
│   │   └── ThemeContext.tsx     # Contexto del tema
│   ├── hooks/                   # Custom hooks
│   │   ├── useChat.ts
│   │   ├── useDocuments.ts
│   │   ├── useHealth.ts
│   │   └── useTheme.ts
│   ├── types/                   # Tipos TypeScript
│   ├── utils/                   # Funciones auxiliares
│   ├── App.tsx                  # Componente raíz
│   ├── main.tsx                 # Punto de entrada
│   └── index.css                # Estilos globales + Tailwind
├── .env.example                 # Template de variables de entorno
├── index.html                   # HTML base
├── package.json                 # Dependencias y scripts
├── tailwind.config.js           # Configuración Tailwind
├── tsconfig.json                # Configuración TypeScript
├── vite.config.ts               # Configuración Vite
└── vercel.json                  # Configuración de despliegue en Vercel
```

---

## 🧪 Endpoints Consumidos

| Endpoint | Método | Uso |
|---|---|---|
| `/api/v1/chat` | `POST` | Chat con RAG |
| `/api/v1/chat/direct` | `POST` | Chat directo con LLM |
| `/api/v1/documents/upload` | `POST` | Subir documento |
| `/api/v1/documents` | `DELETE` | Limpiar colección |
| `/api/v1/sessions` | `GET` | Listar sesiones |
| `/api/v1/sessions/{id}` | `DELETE` | Limpiar sesión |
| `/api/v1/health` | `GET` | Health check |

---

## 🔑 Competencias Demostradas

Este proyecto demuestra experiencia en:

- **React moderno**: Hooks personalizados, Context API, lazy loading, manejo de estado.
- **TypeScript avanzado**: Tipado estricto, interfaces, generics, type guards.
- **UI/UX**: Diseño responsive, tema claro/oscuro, componentes accesibles.
- **Integración con APIs REST**: Axios con interceptores, manejo de errores tipados, cancelación de requests.
- **Arquitectura de componentes**: Separación por dominio (Chat/Documents/UI), composición.
- **Tooling moderno**: Vite, Tailwind, ESLint, TypeScript strict mode.
- **Despliegue cloud**: Configuración para Vercel con variables de entorno y SPA routing.
