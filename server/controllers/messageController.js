// Import modelu Messages
const Messages = require("../models/messageModel");

// Kontroler do pobierania wiadomości
module.exports.getMessages = async (req, res, next) => {
  try {
    // Pobierz nadawcę (from) i odbiorcę (to) z ciała żądania
    const { from, to } = req.body;

    // Znajdź wiadomości dla danej pary użytkowników, posortowane według daty aktualizacji
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    // Przekształć pobrane wiadomości na odpowiedni format
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    // Odpowiedź z przekształconymi wiadomościami
    res.json(projectedMessages);
  } catch (ex) {
    // Obsługa błędów
    next(ex);
  }
};

// Kontroler do dodawania wiadomości
module.exports.addMessage = async (req, res, next) => {
  try {
    // Pobierz nadawcę (from), odbiorcę (to) i treść wiadomości z ciała żądania
    const { from, to, message } = req.body;

    // Utwórz nową wiadomość w bazie danych
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    // Sprawdź, czy wiadomość została dodana poprawnie i zwróć odpowiednią wiadomość
    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    // Obsługa błędów
    next(ex);
  }
};
