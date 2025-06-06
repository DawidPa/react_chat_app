import React, {useEffect, useState} from "react";
import styled from "styled-components";
import Logo from "../assets/Team.png";

export default function Contacts({ contacts, changeChat }) {
  // Stan przechowujący nazwę aktualnie zalogowanego użytkownika
  const [currentUserName, setCurrentUserName] = useState(undefined);

  // Stan przechowujący indeks aktualnie wybranego kontaktu
  const [currentSelected, setCurrentSelected] = useState(undefined);

  // Pobierz nazwę aktualnie zalogowanego użytkownika po montowaniu komponentu
  useEffect(async () => {
    const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    setCurrentUserName(data.username);
  }, []);

  // Funkcja do zmiany aktualnego czatu na podstawie wybranego kontaktu
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  // Renderowanie komponentu
  return (
      <>
        <Container>
          {/* Sekcja z logo i nazwą aplikacji */}
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>TeamTone</h3>
          </div>
          {/* Sekcja z listą kontaktów */}
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                  <div
                      key={contact._id}
                      className={`contact ${
                          index === currentSelected ? "selected" : ""
                      }`}
                      onClick={() => changeCurrentChat(index, contact)}
                  >
                    <div className="username">
                      <h3>{contact.username}</h3>
                    </div>
                  </div>
              );
            })}
          </div>
          {/* Sekcja z informacją o aktualnie zalogowanym użytkowniku */}
          <div className="current-user">
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
