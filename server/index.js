// Import niezbędnych modułów i pakietów
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();  // Wczytaj zmienne środowiskowe z pliku .env

// Ustawienie middleware dla CORS i obsługi danych w formacie JSON
app.use(cors());
app.use(express.json());

// Połączenie z bazą danych MongoDB za pomocą mongoose
mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB Connection Successful");
    })
    .catch((err) => {
      console.log(err.message);
    });

// Ustawienie tras dla endpointów związanych z uwierzytelnianiem i wiadomościami
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Uruchomienie serwera na określonym porcie zgodnie z wartością zmiennych środowiskowych
const server = app.listen(process.env.PORT, () =>
    console.log(`Server started on ${process.env.PORT}`)
);

// Inicjalizacja modułu Socket.IO na serwerze
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",  // Określenie adresu źródłowego dla CORS
    credentials: true,
  },
});

// Utworzenie globalnej mapy onlineUsers do śledzenia użytkowników online
global.onlineUsers = new Map();

// Obsługa zdarzenia "connection" w Socket.IO
io.on("connection", (socket) => {
  global.chatSocket = socket;

  // Obsługa zdarzenia "add-user" - dodanie użytkownika do mapy onlineUsers
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // Obsługa zdarzenia "send-msg" - przesyłanie wiadomości do odbiorcy
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      // Jeśli odbiorca jest online, przekazanie wiadomości do jego socketu
      socket.to(sendUserSocket).emit("msg-receive", data.msg);
    }
  });
});
