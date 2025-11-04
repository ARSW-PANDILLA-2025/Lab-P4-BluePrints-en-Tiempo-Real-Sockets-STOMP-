import { useEffect, useRef, useState } from 'react'
import { createSocket } from './lib/socketIoClient.js'

const IO_BASE = import.meta.env.VITE_IO_BASE ?? 'http://localhost:3001' 

export default function App() {
  
  const [rtEnabled, setRtEnabled] = useState(true)
  const [author, setAuthor] = useState('Angie')
  const [name, setName] = useState('') 
  const [blueprintsList, setBlueprintsList] = useState([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [currentPoints, setCurrentPoints] = useState([])
  const [newBlueprintName, setNewBlueprintName] = useState('')
  const [message, setMessage] = useState('')

  const canvasRef = useRef(null)
  const socketRef = useRef(null)

  const loadBlueprintsList = async () => {
    try {
      const response = await fetch(`${IO_BASE}/api/blueprints?author=${author}`)
      if (!response.ok) {
        setBlueprintsList([])
        setTotalPoints(0)
        return
      }
      const data = await response.json()
      setBlueprintsList(data.blueprints || [])
      setTotalPoints(data.totalPoints || 0)
    } catch (error) {
      console.error('Error cargando lista:', error)
      showMessage('Error al cargar la lista de blueprints', 'error')
    }
  }

  const loadBlueprint = async () => {
    if (!name) {
      setCurrentPoints([])
      drawAll({ points: [] })
      return
    }
    
    try {
      const response = await fetch(`${IO_BASE}/api/blueprints/${author}/${name}`)
      if (!response.ok) {
        setCurrentPoints([])
        drawAll({ points: [] })
        return
      }
      const data = await response.json()
      setCurrentPoints(data.points || [])
      drawAll(data)
    } catch (error) {
      console.error('Error cargando blueprint:', error)
      setCurrentPoints([])
      drawAll({ points: [] })
    }
  }

  function drawAll(bp) {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, 600, 400)
    
    if (!bp.points || bp.points.length === 0) return
    
    ctx.strokeStyle = '#2563eb'
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    
    ctx.beginPath()
    bp.points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    })
    ctx.stroke()

    ctx.fillStyle = '#2563eb'
    bp.points.forEach(p => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  useEffect(() => {
    setCurrentPoints([])
    drawAll({ points: [] })
    setName('')
    loadBlueprintsList()
  }, [author])

  useEffect(() => {
    loadBlueprint()
  }, [name])

  useEffect(() => {
    socketRef.current?.disconnect?.()
    socketRef.current = null

    if (!rtEnabled) return

    const s = createSocket(IO_BASE)
    socketRef.current = s
    const room = `blueprints.${author}.${name}`
    
    s.on('connect', () => {
      console.log('✅ Socket.IO conectado')
      s.emit('join-room', room)
    })
    
    s.on('blueprint-update', (upd) => {
      console.log('📥 Actualización recibida:', upd)
      setCurrentPoints(upd.points)
      drawAll({ points: upd.points })
    })

    s.on('disconnect', () => {
      console.log('🔌 Socket.IO desconectado')
    })

    return () => {
      socketRef.current?.disconnect?.()
    }
  }, [rtEnabled, author, name])

  function onClick(e) {
    if (!name) {
      showMessage('Selecciona o crea un Blueprint primero', 'warning')
      return
    }

    const rect = e.target.getBoundingClientRect()
    const point = { x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) }

    const newPoints = [...currentPoints, point]
    setCurrentPoints(newPoints)
    drawAll({ points: newPoints })

    if (rtEnabled && socketRef.current?.connected) {
      const room = `blueprints.${author}.${name}`
      socketRef.current.emit('draw-event', { room, author, name, point })
    } else if (rtEnabled && !socketRef.current?.connected) {
      showMessage('Socket.IO no está conectado', 'warning')
    }
  }

  const createBlueprint = async () => {
    if (!newBlueprintName.trim()) {
      showMessage('Ingresa un nombre para el nuevo blueprint', 'warning')
      return
    }

    try {
      const response = await fetch(`${IO_BASE}/api/blueprints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, name: newBlueprintName, points: [] })
      })

      if (response.ok) {
        showMessage('Blueprint creado exitosamente', 'success')
        setNewBlueprintName('')
        setName(newBlueprintName)
        loadBlueprintsList()
      } else {
        const error = await response.json()
        showMessage(error.error || 'Error al crear blueprint', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      showMessage('Error al crear blueprint', 'error')
    }
  }

  const saveBlueprint = async () => {
    try {
      const response = await fetch(`${IO_BASE}/api/blueprints/${author}/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: currentPoints })
      })

      if (response.ok) {
        showMessage('Blueprint guardado exitosamente', 'success')
        loadBlueprintsList()
      } else {
        showMessage('Error al guardar blueprint', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      showMessage('Error al guardar blueprint', 'error')
    }
  }

  const deleteBlueprint = async () => {
    if (!confirm(`¿Estás segura de eliminar el blueprint "${name}"?`)) return

    try {
      const response = await fetch(`${IO_BASE}/api/blueprints/${author}/${name}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        showMessage('Blueprint eliminado exitosamente', 'success')
        setCurrentPoints([])
        drawAll({ points: [] })
        loadBlueprintsList()

        if (blueprintsList.length > 1) {
          const nextBlueprint = blueprintsList.find(bp => bp.name !== name)
          if (nextBlueprint) setName(nextBlueprint.name)
        }
      } else {
        showMessage('Error al eliminar blueprint', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      showMessage('Error al eliminar blueprint', 'error')
    }
  }

  const showMessage = (msg, type = 'info') => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui', padding: 20, maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ marginBottom: 20, borderBottom: '2px solid #e5e7eb', paddingBottom: 16 }}>
        <h1 style={{ margin: 0, color: '#1f2937' }}>🎨 BluePrints en Tiempo Real - Socket.IO</h1>
        <p style={{ margin: '8px 0 0', color: '#6b7280' }}>
          Colaboración en vivo • Tribu Pablo Escobar El patrón del mal• Arquitectura de Software
        </p>
      </header>

      {/* Barra de control principal */}
      <div style={{ 
        background: '#f9fafb', 
        padding: 16, 
        borderRadius: 8, 
        marginBottom: 20,
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              Tiempo Real
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rtEnabled}
                onChange={e => setRtEnabled(e.target.checked)}
                style={{ width: 18, height: 18 }}
              />
              <span style={{ fontSize: 14 }}>
                {rtEnabled ? '⚡ Socket.IO Activo' : 'X Desactivado'}
              </span>
            </label>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              Autor
            </label>
            <input
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="autor"
              style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #d1d5db', width: 150 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
              Blueprint actual
            </label>
            <select
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ 
                padding: '6px 10px', 
                borderRadius: 4, 
                border: '1px solid #d1d5db', 
                width: 220,
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Selecciona un blueprint --</option>
              {blueprintsList.map((bp, idx) => (
                <option key={idx} value={bp.name}>
                  {bp.name} ({bp.points.length} puntos)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 16 }}>
        {/* Panel de dibujo */}
        <div>
          <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
            <button
              onClick={saveBlueprint}
              style={{
                padding: '8px 16px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              💾 Guardar
            </button>
            <button
              onClick={deleteBlueprint}
              style={{
                padding: '8px 16px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              🗑️ Eliminar
            </button>
            <button
              onClick={() => {
                setCurrentPoints([])
                drawAll({ points: [] })
              }}
              style={{
                padding: '8px 16px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              🧹 Limpiar canvas
            </button>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            style={{
              border: '2px solid #d1d5db',
              borderRadius: 8,
              cursor: 'crosshair',
              background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onClick={onClick}
          />

          <p style={{ marginTop: 12, color: '#6b7280', fontSize: 14 }}>
            💡 Abre 2 pestañas del navegador con el mismo autor y blueprint para ver la colaboración en tiempo real.
          </p>
        </div>

        {/* Panel lateral: lista de blueprints */}
        <div style={{ paddingLeft: 0, marginTop: 46
         }}>
          <div style={{ 
            background: 'white', 
            padding: 16, 
            borderRadius: 8, 
            border: '1px solid #e5e7eb',
            marginBottom: 16,
            marginLeft: 0
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>
              📋 Blueprints de {author}
            </h3>
            <div style={{ 
              fontSize: 14, 
              color: '#6b7280', 
              marginBottom: 12,
              padding: 8,
              background: '#f0f9ff',
              borderRadius: 4
            }}>
              <strong>Total de puntos:</strong> {totalPoints}
            </div>
            
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              {blueprintsList.length === 0 ? (
                <p style={{ fontSize: 13, color: '#9ca3af', fontStyle: 'italic' }}>
                  No hay blueprints
                </p>
              ) : (
                <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '6px 8px', textAlign: 'left' }}>Nombre</th>
                      <th style={{ padding: '6px 8px', textAlign: 'center' }}>Puntos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blueprintsList.map((bp, idx) => (
                      <tr
                        key={idx}
                        onClick={() => setName(bp.name)}
                        style={{
                          cursor: 'pointer',
                          background: bp.name === name ? '#dbeafe' : 'white',
                          borderBottom: '1px solid #f3f4f6'
                        }}
                      >
                        <td style={{ padding: '6px 8px' }}>{bp.name}</td>
                        <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                          {bp.points.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Crear nuevo blueprint */}
          <div style={{ 
            background: 'white', 
            padding: 16, 
            borderRadius: 8, 
            border: '1px solid #e5e7eb',
            marginLeft: 0
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>➕ Crear Blueprint</h3>
            <input
              value={newBlueprintName}
              onChange={e => setNewBlueprintName(e.target.value)}
              placeholder="nombre del nuevo blueprint"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: 4,
                border: '1px solid #d1d5db',
                marginBottom: 8,
                boxSizing: 'border-box'
              }}
              onKeyPress={e => e.key === 'Enter' && createBlueprint()}
            />
            <button
              onClick={createBlueprint}
              style={{
                width: '100%',
                padding: '8px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Crear
            </button>
          </div>
        </div>
      </div>

      {/* Mensajes de feedback */}
      {message && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: '#1f2937',
          color: 'white',
          padding: '12px 20px',
          borderRadius: 8,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          {message}
        </div>
      )}
    </div>
  )
}
