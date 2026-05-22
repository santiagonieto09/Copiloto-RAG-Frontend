# Copiloto RAG Frontend

Frontend prototipo para el **Copiloto Financiero RAG**.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Axios
- react-markdown
- lucide-react

## Requisitos

El servidor de la API debe estar corriendo en `http://localhost:8000`.

## Instalación

```bash
npm install
npm run dev
```

La app abrirá en `http://localhost:5173`.

## Funcionalidades

- Chat con documentos usando `/api/v1/chat`.
- Chat general usando `/api/v1/chat/direct`.
- Subida de documentos `.pdf`, `.txt`, `.docx`.
- Lista de documentos guardada en el navegador para el prototipo.
- Estado del asistente usando `/api/v1/health`.
- Opción para eliminar los documentos preparados para el chat.
