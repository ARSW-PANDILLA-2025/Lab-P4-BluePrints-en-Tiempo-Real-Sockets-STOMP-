import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
const httpServer = createServer(app)

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

// Configuración de Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

// Base de datos en memoria
const blueprints = {
  'juan': {
    'plano-1': { author: 'juan', name: 'plano-1', points: [] },
    'plano-2': { author: 'juan', name: 'plano-2', points: [{ x: 50, y: 50 }, { x: 100, y: 100 }] }
  },
  'maria': {
    'diseño-a': { author: 'maria', name: 'diseño-a', points: [{ x: 10, y: 10 }] }
  },
  'angie': {}
}

// ========== API REST ENDPOINTS ==========

// GET /api/blueprints?author=:author
// Lista todos los blueprints de un autor con total de puntos
app.get('/api/blueprints', (req, res) => {
  const { author } = req.query
  
  if (!author) {
    return res.status(400).json({ error: 'Se requiere el parámetro author' })
  }

  const authorBlueprints = blueprints[author] || {}
  const blueprintList = Object.values(authorBlueprints).map(bp => ({
    author: bp.author,
    name: bp.name,
    points: bp.points
  }))

  const totalPoints = blueprintList.reduce((sum, bp) => sum + bp.points.length, 0)

  res.json({
    author,
    blueprints: blueprintList,
    totalPoints
  })
})

// GET /api/blueprints/:author/:name
// Obtiene un blueprint específico
app.get('/api/blueprints/:author/:name', (req, res) => {
  const { author, name } = req.params
  
  if (!blueprints[author] || !blueprints[author][name]) {
    return res.status(404).json({ error: 'Blueprint no encontrado' })
  }

  res.json(blueprints[author][name])
})

// POST /api/blueprints
// Crea un nuevo blueprint
app.post('/api/blueprints', (req, res) => {
  const { author, name, points = [] } = req.body

  if (!author || !name) {
    return res.status(400).json({ error: 'Se requieren author y name' })
  }

  if (!blueprints[author]) {
    blueprints[author] = {}
  }

  if (blueprints[author][name]) {
    return res.status(409).json({ error: 'El blueprint ya existe' })
  }

  const newBlueprint = { author, name, points }
  blueprints[author][name] = newBlueprint

  console.log(`✅ Blueprint creado: ${author}/${name}`)
  res.status(201).json(newBlueprint)
})

// PUT /api/blueprints/:author/:name
// Actualiza un blueprint existente
app.put('/api/blueprints/:author/:name', (req, res) => {
  const { author, name } = req.params
  const { points } = req.body

  if (!blueprints[author] || !blueprints[author][name]) {
    return res.status(404).json({ error: 'Blueprint no encontrado' })
  }

  blueprints[author][name].points = points || []
  
  console.log(`✏️ Blueprint actualizado: ${author}/${name} - ${points.length} puntos`)
  res.json(blueprints[author][name])
})

// DELETE /api/blueprints/:author/:name
// Elimina un blueprint
app.delete('/api/blueprints/:author/:name', (req, res) => {
  const { author, name } = req.params

  if (!blueprints[author] || !blueprints[author][name]) {
    return res.status(404).json({ error: 'Blueprint no encontrado' })
  }

  delete blueprints[author][name]
  
  // Si el autor no tiene más blueprints, eliminar el autor
  if (Object.keys(blueprints[author]).length === 0) {
    delete blueprints[author]
  }

  console.log(`🗑️ Blueprint eliminado: ${author}/${name}`)
  res.status(204).send()
})

// ========== SOCKET.IO EVENTOS EN TIEMPO REAL ==========

io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`)

  // Evento: unirse a una sala específica de un blueprint
  socket.on('join-room', (room) => {
    socket.join(room)
    console.log(`📍 Socket ${socket.id} se unió a la sala: ${room}`)
  })

  // Evento: dibujar un punto (broadcasting a todos en la sala)
  socket.on('draw-event', ({ room, author, name, point }) => {
    console.log(`🎨 Draw event en ${room}:`, point)

    // Agregar el punto al blueprint en memoria
    if (blueprints[author] && blueprints[author][name]) {
      blueprints[author][name].points.push(point)
      
      // Broadcast a todos los clientes en la sala (incluyendo el emisor)
      io.to(room).emit('blueprint-update', {
        author,
        name,
        points: blueprints[author][name].points
      })
    }
  })

  socket.on('disconnect', () => {
    console.log(`🔌 Cliente desconectado: ${socket.id}`)
  })
})

// ========== INICIO DEL SERVIDOR ==========

const PORT = process.env.PORT || 3001

httpServer.listen(PORT, () => {
  console.log(`
  🚀 Servidor Socket.IO iniciado
  📍 Puerto: ${PORT}
  🌐 API REST: http://localhost:${PORT}/api/blueprints
  🔌 Socket.IO: http://localhost:${PORT}

  👤 Estudiante: Tribu Pablo Escobar El patrón del mal
  📚 Materia: Arquitectura de Software
  `)
})
