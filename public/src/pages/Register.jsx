import React, {useEffect, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import Logo from "../assets/Team.png";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {registerRoute} from "../utils/APIRoutes";

export default function Register() {
  // Hook do nawigacji
  const navigate = useNavigate();

  // Opcje dla komunikatu Toastify
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  // Stan przechowujący dane formularza rejestracji
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Efekt sprawdzający, czy użytkownik jest już zalogowany
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      // Jeśli jest zalogowany, przekieruj go do strony głównej
      navigate("/");
    }
  }, []);

  // Funkcja obsługująca zmiany w polach formularza
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Funkcja walidująca formularz rejestracji
  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;

    // Sprawdzenie, czy hasło i potwierdzenie hasła są takie same
    if (password !== confirmPassword) {
      toast.error(
          "Password and confirm password should be the same.",
          toastOptions
      );
      return false;
    } else if (username.length < 3) {
      // Sprawdzenie, czy nazwa użytkownika ma co najmniej 3 znaki
      toast.error(
          "Username should be greater than 3 characters.",
          toastOptions
      );
      return false;
    } else if (password.length < 8) {
      // Sprawdzenie, czy hasło ma co najmniej 8 znaków
      toast.error(
          "Password should be equal or greater than 8 characters.",
          toastOptions
      );
      return false;
    } else if (email === "") {
      // Sprawdzenie, czy email jest pusty
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  // Funkcja obsługująca wysłanie formularza
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      // Sprawdzenie statusu odpowiedzi serwera
      if (data.status === false) {
        // Wyświetlenie komunikatu o błędzie, jeśli rejestracja nie powiodła się
        toast.error(data.msg, toastOptions);
      }

      if (data.status === true) {
        // Zapisanie danych użytkownika w lokalnym magazynie
        localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(data.user)
        );

        // Przekierowanie użytkownika do strony głównej
        navigate("/");
      }
    }
  };

  // Renderowanie komponentu
  return (
      <>
        {/* Kontener formularza rejestracji */}
        <FormContainer>
          <form action="" onSubmit={(event) => handleSubmit(event)}>
            {/* Logo i nazwa aplikacji */}
            <div className="brand">
              <img src={Logo} alt="logo" />
              <h1>TeamTone</h1>
            </div>

            {/* Pola formularza */}
            <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={(e) => handleChange(e)}
            />
            <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={(e) => handleChange(e)}
            />
            <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={(e) => handleChange(e)}
            />
            <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={(e) => handleChange(e)}
            />

            {/* Przycisk tworzenia użytkownika */}
            <button type="submit">Create User</button>

            {/* Link do logowania */}
            <span>
            Already have an account ? <Link to="/login">Login.</Link>
          </span>
          </form>
        </FormContainer>

        {/* Komunikaty Toastify */}
        <ToastContainer />
      </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
