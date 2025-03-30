// Import modułu mongoose do obsługi MongoDB
const mongoose = require("mongoose");

// Utworzenie schematu wiadomości
const MessageSchema = mongoose.Schema(
    {
        // Pole message - treść wiadomości
        message: {
            text: { type: String, required: true },  // Pole wymagane
        },
        // Pole users - tablica identyfikatorów użytkowników, do których wiadomość jest skierowana
        users: Array,
        // Pole sender - identyfikator użytkownika, który wysłał wiadomość
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",          // Odwołanie do modelu "User" (użytkownika)
            required: true,       // Pole wymagane
        },
    },
    {
        timestamps: true,  // Automatyczne dodawanie pól createdAt i updatedAt z datą utworzenia i aktualizacji
    }
);

// Eksport modelu wiadomości na podstawie zdefiniowanego schematu
module.exports = mongoose.model("Messages", MessageSchema);
