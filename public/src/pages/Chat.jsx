import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {io} from "socket.io-client";
import styled from "styled-components";
import {allUsersRoute, host} from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  // Hook do nawigacji
  const navigate = useNavigate();

  // Ref do przechowywania obiektu socket.io
  const socket = useRef();

  // Stan przechowujący listę kontaktów
  const [contacts, setContacts] = useState([]);

  // Stan przechowujący informacje o aktualnie otwartym czacie
  const [currentChat, setCurrentChat] = useState(undefined);

  // Stan przechowujący informacje o aktualnie zalogowanym użytkowniku
  const [currentUser, setCurrentUser] = useState(undefined);

  // Efekt sprawdzający, czy użytkownik jest zalogowany
  useEffect(async () => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      // Jeśli nie jest zalogowany, przejdź do strony logowania
      navigate("/login");
    } else {
      // Jeśli jest zalogowany, ustaw informacje o użytkowniku
      setCurrentUser(
          await JSON.parse(
              localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )
      );
    }
  }, []);

  // Efekt inicjalizujący połączenie z serwerem socket.io po uzyskaniu informacji o użytkowniku
  useEffect(() => {
    if (currentUser) {
      // Utwórz obiekt socket.io i dodaj użytkownika do listy połączonych
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  // Efekt pobierający listę kontaktów użytkownika z serwera
  useEffect(async () => {
    if (currentUser) {
      // Pobierz listę kontaktów użytkownika z serwera
      const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
      setContacts(data.data);
    }
  }, [currentUser]);

  // Funkcja do obsługi zmiany aktualnego czatu
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  // Renderowanie komponentu
  return (
      <>
        {/* Kontener główny */}
        <Container>
          <div className="container">
            {/* Komponent listy kontaktów */}
            <Contacts contacts={contacts} changeChat={handleChatChange} />

            {/* Warunek renderowania komponentu powitania lub kontenera czatu */}
            {currentChat === undefined ? (
                <Welcome />
            ) : (
                <ChatContainer currentChat={currentChat} socket={socket} />
            )}
          </div>
        </Container>
      </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
