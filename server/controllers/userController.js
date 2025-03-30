// Import modelu User i modułu bcrypt
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Kontroler do logowania użytkownika
module.exports.login = async (req, res, next) => {
  try {
    // Pobierz dane z ciała żądania
    const { username, password } = req.body;

    // Sprawdź, czy istnieje użytkownik o podanej nazwie użytkownika
    const user = await User.findOne({ username });

    // Jeśli użytkownik nie istnieje, zwróć odpowiednią wiadomość
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    // Sprawdź poprawność hasła za pomocą bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Jeśli hasło jest nieprawidłowe, zwróć odpowiednią wiadomość
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });

    // Usuń hasło z obiektu użytkownika i zwróć zalogowanego użytkownika
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    // Obsługa błędów
    next(ex);
  }
};

// Kontroler do rejestracji nowego użytkownika
module.exports.register = async (req, res, next) => {
  try {
    // Pobierz dane z ciała żądania
    const { username, email, password } = req.body;

    // Sprawdź, czy istnieje użytkownik o podanej nazwie użytkownika
    const usernameCheck = await User.findOne({ username });

    // Jeśli użytkownik o podanej nazwie już istnieje, zwróć odpowiednią wiadomość
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    // Sprawdź, czy istnieje użytkownik o podanym adresie e-mail
    const emailCheck = await User.findOne({ email });

    // Jeśli użytkownik o podanym adresie e-mail już istnieje, zwróć odpowiednią wiadomość
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    // Zaszyfruj hasło za pomocą bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Utwórz nowego użytkownika w bazie danych
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    // Usuń hasło z obiektu użytkownika i zwróć zarejestrowanego użytkownika
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    // Obsługa błędów
    next(ex);
  }
};

// Kontroler do pobierania wszystkich użytkowników
module.exports.getAllUsers = async (req, res, next) => {
  try {
    // Pobierz wszystkich użytkowników, pomijając bieżącego użytkownika
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "_id",
    ]);

    // Zwróć listę użytkowników
    return res.json(users);
  } catch (ex) {
    // Obsługa błędów
    next(ex);
  }
};

// Kontroler do ustawiania awatara użytkownika
module.exports.setAvatar = async (req, res, next) => {
  try {
    // Pobierz identyfikator użytkownika z parametru żądania
    const userId = req.params.id;

    // Zaktualizuj dane użytkownika w bazie danych

    // Zwróć odpowiedź JSON
    return res.json({

    });
  } catch (ex) {
    // Obsługa błędów
    next(ex);
  }
};

// Kontroler do wylogowania użytkownika
module.exports.logOut = (req, res, next) => {
  try {
    // Sprawdź, czy przekazano identyfikator użytkownika w parametrze żądania
    if (!req.params.id) return res.json({ msg: "User id is required " });

    // Wyloguj użytkownika z listy użytkowników online (onlineUsers)

    // Zwróć odpowiedź z kodem 200
    return res.status(200).send();
  } catch (ex) {
    // Obsługa błędów
    next(ex);
  }
};
