# Backend Socket.IO - BluePrints en Tiempo Real

Backend Node.js con Express y Socket.IO para el laboratorio de BluePrints.

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3001`

## Endpoints REST

- `GET /api/blueprints?author=:author` - Lista blueprints por autor
- `GET /api/blueprints/:author/:name` - Obtiene un blueprint específico
- `POST /api/blueprints` - Crea un nuevo blueprint
- `PUT /api/blueprints/:author/:name` - Actualiza un blueprint
- `DELETE /api/blueprints/:author/:name` - Elimina un blueprint

## Eventos Socket.IO

- `join-room` - Unirse a una sala de blueprint
- `draw-event` - Enviar un punto dibujado
- `blueprint-update` - Recibir actualizaciones del blueprint
