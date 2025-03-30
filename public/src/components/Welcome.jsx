// Welcome.jsx

import React, {useEffect, useState} from "react";
import styled from "styled-components";

export default function Welcome() {
    // Stan przechowujący nazwę użytkownika
    const [userName, setUserName] = useState("");

    // Efekt pobierający nazwę użytkownika z lokalnego magazynu po zamontowaniu komponentu
    useEffect(async () => {
        // Pobierz nazwę użytkownika z lokalnego magazynu
        setUserName(
            await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            ).username
        );
    }, []);

    // Renderowanie komponentu
    return (
        <Container>
            {/* Nagłówek powitalny */}
            <h1>
                Welcome, <span>{userName}!</span>
            </h1>
        </Container>
    );
}

// Stylizowany kontener powitania
const Container = styled.div`
    // Stylizacja kontenera
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    flex-direction: column;

    // Opcjonalna stylizacja obrazu
    img {
        height: 20rem;
    }

    // Stylizacja spana z kolorowym tekstem
    span {
        color: #4e0eff;
    }
`;
