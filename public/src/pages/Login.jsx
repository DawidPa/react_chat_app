import React, {useEffect, useState} from "react";
import axios from "axios";
import styled from "styled-components";
import {Link, useNavigate} from "react-router-dom";
import Logo from "../assets/Team.png";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {loginRoute} from "../utils/APIRoutes";

export default function Login() {
  // Hook do nawigacji
  const navigate = useNavigate();

  // Stan przechowujący dane formularza logowania
  const [values, setValues] = useState({ username: "", password: "" });

  // Opcje dla komunikatu Toastify
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

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

  // Funkcja walidująca formularz
  const validateForm = () => {
    const { username, password } = values;
    if (username === "" || password === "") {
      // Wyświetl komunikat o błędzie, jeśli pola są puste
      toast.error("Username and password are required.", toastOptions);
      return false;
    }
    return true;
  };

  // Funkcja obsługująca wysłanie formularza
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });

      // Sprawdź status odpowiedzi serwera
      if (data.status === false) {
        // Wyświetl komunikat o błędzie, jeśli logowanie nie powiodło się
        toast.error(data.msg, toastOptions);
      }

      if (data.status === true) {
        // Zapisz dane użytkownika w lokalnym magazynie
        localStorage.setItem(
            process.env.REACT_APP_LOCALHOST_KEY,
            JSON.stringify(data.user)
        );

        // Przekieruj użytkownika do strony głównej
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>TeamTone</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
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
    padding: 5rem;
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
