const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// Endpoint de prueba para verificar que el servidor está vivo
app.get('/', (req, res) => {
  res.send('itochat Relay Server está corriendo correctamente.');
});

const server = http.createServer(app);

// Configuración de WebSockets con CORS abierto para la conexión móvil
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`Dispositivo conectado: ${socket.id}`);

  // Escuchar cuando tú o tu novia envíen un mensaje
  socket.on('enviar_mensaje', (payload) => {
    // Retransmitir inmediatamente al otro dispositivo conectado
    // El servidor NO almacena nada en base de datos; máxima privacidad.
    socket.broadcast.emit('recibir_mensaje', payload);
  });

  socket.on('disconnect', () => {
    console.log(`Dispositivo desconectado: ${socket.id}`);
  });
});

// El puerto lo asignará Railway dinámicamente mediante la variable de entorno
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Relay Server de itochat corriendo en el puerto ${PORT}`);
});