# Lab P4 — BluePrints en Tiempo Real con Socket.IO

Aplicación web de colaboración en tiempo real para el diseño y edición de planos (blueprints) que permite a múltiples usuarios dibujar simultáneamente en el mismo canvas utilizando Socket.IO como tecnología de comunicación bidireccional, con operaciones CRUD completas mediante API REST.


*Figura 1: Interfaz principal de la aplicación mostrando el canvas de dibujo y el panel lateral con la lista de blueprints.*

---

## Getting Started

Estas instrucciones te permitirán obtener una copia funcional del proyecto en tu máquina local para propósitos de desarrollo y pruebas. Consulta la sección de deployment para notas sobre cómo desplegar el proyecto en un sistema en vivo.

### Prerequisites

Software necesario para instalar y ejecutar la aplicación:

```bash
# Node.js (versión 18 o superior)
node --version
# v18.0.0 o superior

# npm (incluido con Node.js)
npm --version
# 9.0.0 o superior

# Git (para clonar el repositorio)
git --version
```

**Instalación de Node.js:**
- Windows/Mac: Descarga desde [nodejs.org](https://nodejs.org/)
- Linux (Ubuntu/Debian):
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

### Installing

Guía paso a paso para configurar el entorno de desarrollo:

#### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/ARSW-PANDILLA-2025/Lab-P4-BluePrints-en-Tiempo-Real-Sockets-STOMP-.git
```

#### Paso 2: Configurar el Backend Socket.IO

```bash
# Navegar al directorio del backend
cd backend-socketio

# Instalar dependencias
npm install
```

Salida esperada:
```
added 95 packages, and audited 96 packages in 5s
found 0 vulnerabilities
```

#### Paso 3: Iniciar el servidor backend

```bash
# Desde backend-socketio/
node server.js
```

Salida esperada:
```
🚀 Servidor Socket.IO iniciado
📍 Puerto: 3001
🌐 API REST: http://localhost:3001/api/blueprints
🔌 Socket.IO: http://localhost:3001
```


*Figura: Servidor backend ejecutándose correctamente en el puerto 3001.*

#### Paso 4: Configurar el Frontend

En una **nueva terminal**, desde el directorio raíz del proyecto:

```bash
# Instalar dependencias del frontend
npm install
```

#### Paso 5: Configurar variables de entorno

Crear el archivo `.env.local` en la raíz del proyecto:

```bash
# Archivo: .env.local
VITE_IO_BASE=http://localhost:3001
```

#### Paso 6: Iniciar la aplicación frontend

```bash
npm run dev
```

Salida esperada:
```
VITE v5.4.21  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

*Figura: Servidor de desarrollo Vite ejecutándose en el puerto 5173.*

#### Obtener datos del sistema

Abre tu navegador en `http://localhost:5173` y verás la aplicación funcionando. Puedes probar la conexión verificando en la consola del navegador:

```javascript
✅ Socket.IO conectado
📍 Cliente unido a sala: blueprints.angie
```

*Figura: Aplicación funcionando correctamente con Socket.IO conectado.*

---

## Ejecutando las pruebas

Sistema de pruebas para validar la funcionalidad de colaboración en tiempo real y operaciones CRUD.

### Desglosar en pruebas de extremo a extremo

Estas pruebas validan el flujo completo de la aplicación desde la interfaz de usuario hasta la persistencia de datos y la sincronización en tiempo real.

#### Test 1: Colaboración en Tiempo Real

**Qué prueba:** Verifica que múltiples clientes puedan dibujar simultáneamente en el mismo blueprint y que los cambios se sincronicen en tiempo real.

**Procedimiento:**
```bash
1. Abrir dos pestañas del navegador en http://localhost:5173
2. En ambas pestañas:
   - Asegurar que "Tiempo Real" esté activado (⚡ Socket.IO Activo)
   - Seleccionar el mismo autor (ej: "Angie")
   - Seleccionar el mismo blueprint (ej: "Plano 1")
3. En la pestaña 1: Hacer clic en el canvas para dibujar puntos
4. Verificar en la pestaña 2: Los puntos aparecen automáticamente
5. En la pestaña 2: Dibujar nuevos puntos
6. Verificar en la pestaña 1: Los nuevos puntos aparecen
```

**Resultado esperado:** Latencia < 100ms entre acción y sincronización.

*Figura: Dos pestañas mostrando sincronización en tiempo real de puntos dibujados.*

#### Test 2: Operaciones CRUD

**Qué prueba:** Valida que todas las operaciones de Create, Read, Update y Delete funcionen correctamente.

**Ejemplo:**
```bash
# Crear un nuevo blueprint
1. Ingresar "Plano 3" en el campo "Nuevo blueprint"
2. Click en botón "➕ Crear"
3. Verificar mensaje: "Blueprint creado exitosamente"
4. Verificar que aparece en el dropdown de selección

# Actualizar (dibujar y guardar)
5. Seleccionar el blueprint recién creado
6. Dibujar varios puntos en el canvas
7. Click en "💾 Guardar"
8. Verificar mensaje: "Blueprint guardado exitosamente"

# Eliminar
9. Con el blueprint seleccionado, click en "🗑️ Eliminar"
10. Confirmar la eliminación
11. Verificar mensaje: "Blueprint eliminado exitosamente"
12. Verificar que desaparece del dropdown
```

*Figura: Secuencia de operaciones CRUD: crear, dibujar, guardar y eliminar blueprint.*

## Construido con

Tecnologías y frameworks utilizados en el proyecto:

* **[React](https://react.dev/)** - La biblioteca de JavaScript para construir interfaces de usuario
* **[Vite](https://vitejs.dev/)** - Build tool y servidor de desarrollo de próxima generación
* **[Socket.IO](https://socket.io/)** - Biblioteca para comunicación en tiempo real bidireccional y basada en eventos
* **[Express](https://expressjs.com/)** - Framework web minimalista y flexible para Node.js
* **[Node.js](https://nodejs.org/)** - Runtime de JavaScript construido sobre el motor V8 de Chrome
* **[CORS](https://www.npmjs.com/package/cors)** - Middleware de Express para habilitar CORS

### Dependencias del Frontend:
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "socket.io-client": "^4.8.1"
}
```

### Dependencias del Backend:
```json
{
  "express": "^4.18.2",
  "socket.io": "^4.8.1",
  "cors": "^2.8.5"
}
```

## control de versiones

Este proyecto utiliza versionado semántico siguiendo [SemVer](http://semver.org/). 

- **Versión actual:** 1.0.0
- **Fecha de release:** Noviembre 2025

Para ver las versiones disponibles, consulta los [tags en este repositorio](https://github.com/DECSIS-ECI/Lab_P4_BluePrints_RealTime-Sokets/tags).

---

## Authors

* **Angie Ramos, Cristian Polo, Santiago Arteaga, Juan Felipe Martìnez y Angel Cuervo** - *Desarrollo del proyecto*

### Estudiantes:
- **Nombre:** Angie Ramos, Cristian Polo, Santiago Arteaga, Juan Felipe Martìnez y Angel Cuervo
- **Materia:** Arquitectura de Software
- **Institución:** Escuela Colombiana de Ingeniería Julio Garavito
- **Período:** 2025-2

---

## Technical Documentation

### Setup (Configuración técnica)

#### Estructura del Proyecto
```
Lab_P4_BluePrints_RealTime-Sokets-main/
├── backend-socketio/          # Servidor Node.js + Socket.IO
│   ├── server.js              # Lógica del servidor, API REST y WebSocket
│   ├── package.json           # Dependencias del backend
│   └── README.md              # Documentación del backend
├── src/                       # Código fuente del frontend
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Punto de entrada de React
│   └── lib/
│       └── socketIoClient.js  # Cliente Socket.IO configurado
├── .env.local                 # Variables de entorno (no versionado)
├── package.json               # Dependencias del frontend
├── vite.config.js             # Configuración de Vite
├── index.html                 # HTML base
└── README.md    # Este documento
```

### Endpoints Usados

#### API REST (HTTP)

| Método | Endpoint | Body | Respuesta | Descripción |
|--------|----------|------|-----------|-------------|
| `GET` | `/api/blueprints?author=:author` | - | `{ blueprints: [...], totalPoints: number }` | Lista todos los blueprints de un autor con el total agregado de puntos |
| `GET` | `/api/blueprints/:author/:name` | - | `{ author, name, points: [{x,y},...] }` | Obtiene un blueprint específico con todos sus puntos |
| `POST` | `/api/blueprints` | `{ author, name, points }` | `{ message, blueprint }` | Crea un nuevo blueprint |
| `PUT` | `/api/blueprints/:author/:name` | `{ points: [{x,y},...] }` | `{ message, blueprint }` | Actualiza los puntos de un blueprint existente |
| `DELETE` | `/api/blueprints/:author/:name` | - | `{ message }` | Elimina un blueprint |

#### Ejemplos de Uso:

```bash
# GET - Listar blueprints de un autor
curl http://localhost:3001/api/blueprints?author=angie

# Respuesta:
{
  "blueprints": [
    { "author": "angie", "name": "Plano 1", "points": [...] }
  ],
  "totalPoints": 15
}

# POST - Crear nuevo blueprint
curl -X POST http://localhost:3001/api/blueprints \
  -H "Content-Type: application/json" \
  -d '{
    "author": "angie",
    "name": "nuevo-plano",
    "points": []
  }'

# PUT - Actualizar blueprint
curl -X PUT http://localhost:3001/api/blueprints/angie/nuevo-plano \
  -H "Content-Type: application/json" \
  -d '{
    "points": [
      {"x": 100, "y": 150},
      {"x": 200, "y": 250}
    ]
  }'

# DELETE - Eliminar blueprint
curl -X DELETE http://localhost:3001/api/blueprints/angie/nuevo-plano
```

#### Eventos Socket.IO (WebSocket)

| Evento | Dirección | Payload | Descripción |
|--------|-----------|---------|-------------|
| `connect` | Sistema | - | Conexión Socket.IO establecida |
| `join-room` | Cliente → Servidor | `string` (room name) | Cliente solicita unirse a una sala específica |
| `draw-event` | Cliente → Servidor | `{ room, author, name, point: {x, y} }` | Cliente envía un nuevo punto dibujado |
| `blueprint-update` | Servidor → Cliente | `{ author, name, points: [{x,y},...] }` | Servidor broadcastea actualización completa del blueprint |
| `disconnect` | Sistema | - | Conexión Socket.IO cerrada |

#### Ejemplo de Flujo Socket.IO:

```javascript
// 1. Cliente se conecta
const socket = io('http://localhost:3001', {
  transports: ['websocket']
})

// 2. Cliente se une a sala
socket.on('connect', () => {
  const room = 'blueprints.angie.proyecto-final'
  socket.emit('join-room', room)
})

// 3. Cliente dibuja un punto
function onCanvasClick(e) {
  const point = { x: e.offsetX, y: e.offsetY }
  socket.emit('draw-event', {
    room: 'blueprints.angie.proyecto-final',
    author: 'angie',
    name: 'proyecto-final',
    point: point
  })
}

// 4. Cliente recibe actualización
socket.on('blueprint-update', (data) => {
  console.log('Puntos actualizados:', data.points)
  redrawCanvas(data.points)
})
```

### Comparativa: Socket.IO vs STOMP

Este proyecto se implementó con **Socket.IO**, pero el README original sugería también **STOMP** como alternativa. Aquí está la comparativa:

#### Socket.IO (Implementado)

**✅ Pros:**
- **Simplicidad de implementación:** API intuitiva y directa
- **Reconexión automática:** Maneja desconexiones sin configuración adicional
- **Sistema de rooms nativo:** Soporte integrado para canales/salas
- **Fallback automático:** Si WebSocket falla, usa long-polling
- **Ecosistema JavaScript:** Perfecta integración con Node.js y React
- **Documentación abundante:** Gran comunidad y ejemplos
- **Debugging simple:** Logs claros y herramientas de desarrollo

**❌ Contras:**
- **Protocolo propietario:** No es un estándar abierto
- **Vendor lock-in:** Difícil migrar a otra tecnología sin reescribir
- **Overhead de protocolo:** Más pesado que WebSocket puro
- **No enterprise-grade:** Limitado para arquitecturas complejas de mensajería

**Código ejemplo Socket.IO:**
```javascript
// Cliente
socket.emit('draw-event', { room, point })
socket.on('blueprint-update', (data) => { /*...*/ })

// Servidor
io.to(room).emit('blueprint-update', data)
```

#### STOMP (Alternativa)

**✅ Pros:**
- **Protocolo estándar:** STOMP es un estándar abierto de mensajería
- **Interoperabilidad:** Compatible con múltiples brokers (RabbitMQ, ActiveMQ, etc.)
- **Enterprise-ready:** Ideal para arquitecturas de microservicios
- **Spring Boot integration:** Excelente soporte en el ecosistema Java/Spring
- **Escalabilidad horizontal:** Fácil integración con message brokers distribuidos
- **Auditoría y trazabilidad:** Mejor para sistemas que requieren logging exhaustivo

**❌ Contras:**
- **Mayor complejidad:** Requiere configuración de broker y topics
- **Curva de aprendizaje:** Conceptos de mensajería más complejos
- **Infraestructura adicional:** Puede requerir servidor de mensajería externo
- **Debugging complejo:** Más capas para depurar
- **Configuración verbosa:** Más código boilerplate

**Código ejemplo STOMP:**
```javascript
// Cliente
const client = new Client({
  brokerURL: 'ws://localhost:8080/ws-blueprints',
  onConnect: () => {
    client.subscribe('/topic/blueprints.angie.proyecto-final', (msg) => {
      const data = JSON.parse(msg.body)
      // actualizar canvas
    })
    
    client.publish({
      destination: '/app/draw',
      body: JSON.stringify({ author, name, point })
    })
  }
})
client.activate()

// Servidor (Spring Boot)
@MessageMapping("/draw")
@SendTo("/topic/blueprints.{author}.{name}")
public Blueprint handleDraw(DrawEvent event) {
    return blueprintService.addPoint(event);
}
```

#### ¿Por qué se eligió Socket.IO para este proyecto?

1. **Alcance del proyecto:** Aplicación académica de colaboración simple
2. **Stack tecnológico:** JavaScript puro (Node.js + React) sin necesidad de Java
3. **Funcionalidad core:** Las rooms de Socket.IO cubren perfectamente la necesidad
4. **Experiencia del estudiante:** Curva de aprendizaje más amigable
5. **Sin requisitos enterprise:** No se requiere auditoría, alta disponibilidad, etc.

**Conclusión:** Para un proyecto de producción empresarial con múltiples microservicios, **STOMP** sería preferible. Para prototipos, MVPs y aplicaciones educativas como esta, **Socket.IO** es la elección óptima.

---

## License

Este proyecto es de uso académico para el curso de **Arquitectura de Software** de la **Escuela Colombiana de Ingeniería Julio Garavito**.

MIT License - Ver archivo [LICENSE](LICENSE) para más detalles.

---

## Acknowledgments

* Agradecimientos especiales al profesor del curso de Arquitectura de Software por proporcionar los repositorios guía y el diseño del laboratorio
* Inspiración tomada de los repositorios oficiales:
  - [example-backend-socketio-node](https://github.com/DECSIS-ECI/example-backend-socketio-node-)
  - [example-backend-stomp](https://github.com/DECSIS-ECI/example-backend-stopm)
* Documentación oficial de [Socket.IO](https://socket.io/docs/)
* Comunidad de React por las mejores prácticas de Hooks
* Template README adaptado de [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)

---

## Información Adicional

### Video de Demostración

**Duración:** ≤ 90 segundos  
**Contenido del video:**
1. Inicio de backend y frontend
2. Creación de un nuevo blueprint
3. Demostración de colaboración en tiempo real con dos pestañas
4. Operaciones CRUD (Save y Delete)
5. Visualización del total de puntos actualizándose

[🎥 Link al video de demostración](https://youtube.com/...)