import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );

        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <h1>encouraged</h1>
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
  background-color: #dcf8c6;

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
      font-size: 2rem; /* Adjusted for mobile */
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #075e54;
    border-radius: 1.5rem; /* Slightly smaller for mobile */
    padding: 3rem; /* Reduced padding for smaller screens */
    width: 90%; /* Set width relative to screen size */
    max-width: 400px; /* Restrict width for larger screens */
  }

  input {
    background-color: transparent;
    padding: 0.8rem; /* Reduced padding for better fit */
    border: 0.1rem solid #128c7e;
    border-radius: 0.4rem;
    color: white;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #25d366;
      outline: none;
    }
  }

  button {
    background-color: #25d366;
    color: white;
    padding: 0.8rem 1.5rem; /* Reduced padding for buttons */
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #dcf8c6;
      color: #25d366;
    }
  }

  span {
    color: white;
    text-transform: uppercase;
    font-size: 0.9rem; /* Adjusted for readability on smaller screens */
    a {
      color: #25d366;
      text-decoration: none;
      font-weight: bold;
    }
  }

  /* Responsive Design */
  @media screen and (max-width: 768px) {
    form {
      padding: 2rem; /* Smaller padding for tablets and mobile */
      gap: 1.5rem; /* Reduced gap */
    }
    .brand h1 {
      font-size: 1.5rem; /* Smaller brand font size */
    }
    button {
      padding: 0.8rem; /* Adjust button padding for mobile */
      font-size: 0.9rem;
    }
    input {
      padding: 0.7rem; /* Smaller input padding */
      font-size: 0.9rem; /* Adjust input text size */
    }
    span {
      font-size: 0.8rem; /* Adjust span text size */
    }
  }

  @media screen and (max-width: 480px) {
    form {
      padding: 1.5rem; /* Compact padding for smaller screens */
    }
    .brand h1 {
      font-size: 1.2rem; /* Smaller font for mobile screens */
    }
    input,
    button {
      font-size: 0.8rem; /* Smaller text size for input and buttons */
    }
    span {
      font-size: 0.7rem;
    }
  }
`;
