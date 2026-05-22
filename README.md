# Copiloto RAG Frontend

Frontend prototipo para el backend **Copiloto Financiero RAG**.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Axios
- react-markdown
- lucide-react

## Requisitos

El backend debe estar corriendo en `http://localhost:8000`.

## Instalación

```bash
npm install
npm run dev
```

La app abrirá en `http://localhost:5173`.

## Configuración

Puedes cambiar la URL del backend creando un archivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Funcionalidades

- Chat con RAG usando `/api/v1/chat`.
- Chat directo usando `/api/v1/chat/direct`.
- Subida de documentos `.pdf`, `.txt`, `.docx`.
- Panel de documentos guardado en `localStorage`.
- Estadísticas desde `/api/v1/documents/stats`.
- Health check desde `/api/v1/health`.
- Limpieza de documentos indexados y del panel local.
