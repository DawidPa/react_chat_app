// Import modułu mongoose do obsługi MongoDB
const mongoose = require("mongoose");

// Utworzenie schematu użytkownika
const userSchema = new mongoose.Schema({
  // Pole username - nazwa użytkownika
  username: {
    type: String,
    required: true,  // Pole wymagane
    min: 3,         // Minimalna długość nazwy użytkownika
    max: 20,        // Maksymalna długość nazwy użytkownika
    unique: true,   // Unikalna wartość, nie może być dwóch użytkowników z taką samą nazwą
  },
  // Pole email - adres email
  email: {
    type: String,
    required: true,  // Pole wymagane
    unique: true,    // Unikalna wartość, nie może być dwóch użytkowników z takim samym adresem email
    max: 50,         // Maksymalna długość adresu email
  },
  // Pole password - hasło użytkownika
  password: {
    type: String,
    required: true,  // Pole wymagane
    min: 8,          // Minimalna długość hasła użytkownika
  },
});

// Eksport modelu użytkownika na podstawie zdefiniowanego schematu
module.exports = mongoose.model("Users", userSchema);
