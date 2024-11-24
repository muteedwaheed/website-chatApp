import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Robot from "../assets/robot.gif";
export default function Welcome() {
  const [userName, setUserName] = useState("");
  useEffect(async () => {
    setUserName(
      await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      ).username
    );
  }, []);
  return (
    <Container>
      <img src={Robot} alt="" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to Start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  text-align: center;
  height: 100vh;
  padding: 0 1rem;

  img {
    height: 20rem;
    width: auto;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 2rem;
    margin: 10px 0;
  }

  h3 {
    font-size: 1.2rem;
    margin: 5px 0;
  }

  span {
    color: #25d366;
  }

  /* Responsive for mobile screens */
  @media screen and (max-width: 719px) {
    img {
      height: 10rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 1rem;
    }
  }

  /* Responsive for tablet/laptop screens */
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    img {
      height: 15rem;
    }

    h1 {
      font-size: 1.8rem;
    }

    h3 {
      font-size: 1.1rem;
    }
  }
`;