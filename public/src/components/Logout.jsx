import React from "react";
import {useNavigate} from "react-router-dom";
import {BiPowerOff} from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import {logoutRoute} from "../utils/APIRoutes";

export default function Logout() {
  // Hook do nawigacji
  const navigate = useNavigate();

  // Obsługa kliknięcia przycisku wylogowania
  const handleClick = async () => {
    // Pobierz ID z lokalnego magazynu
    const id = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;

    // Wywołaj żądanie wylogowania na serwerze
    const data = await axios.get(`${logoutRoute}/${id}`);

    // Sprawdź, czy żądanie zostało pomyślnie zakończone
    if (data.status === 200) {
      // Wyczyść dane z lokalnego magazynu
      localStorage.clear();
      // Przejdź do strony logowania
      navigate("/login");
    }
  };

  // Renderowanie przycisku wylogowania
  return (
      <Button onClick={handleClick}>
        <BiPowerOff />
      </Button>
  );
}

// Stylizowany przycisk wylogowania
const Button = styled.button`
  // Stylizacja przycisku
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;

  // Stylizacja ikony
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;