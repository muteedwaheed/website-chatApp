import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
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
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login.</Link>
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
    h1 {
      color: white;
      text-transform: uppercase;
      font-size: 1.5rem; /* Adjusted for mobile screens */
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: #075e54;
    border-radius: 2rem;
    padding: 2rem 3rem; /* Reduced padding for smaller screens */
    width: 90%; /* Ensure the form fits mobile screens */
    max-width: 400px; /* Restrict width on larger screens */
  }

  input {
    background-color: transparent;
    padding: 0.8rem; /* Slightly smaller padding */
    border: 0.1rem solid #128c7e;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 0.9rem; /* Reduced font size */
    &:focus {
      border: 0.1rem solid #25d366;
      outline: none;
    }
  }

  button {
    background-color: #25d366;
    color: white;
    padding: 0.8rem 1.5rem; /* Adjusted padding for better fit */
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 0.9rem; /* Slightly smaller font size */
    text-transform: uppercase;
    &:hover {
      background-color: #dcf8c6;
      color: #25d366;
    }
  }

  span {
    color: white;
    text-transform: uppercase;
    font-size: 0.8rem; /* Adjusted font size for mobile */
    a {
      color: #25d366;
      text-decoration: none;
      font-weight: bold;
    }
  }

  @media (max-width: 480px) {
    form {
      padding: 1.5rem 2rem; /* More compact padding for small screens */
    }

    .brand h1 {
      font-size: 1.2rem; /* Further reduce title size for very small screens */
    }

    input {
      padding: 0.7rem; /* Compact input padding */
      font-size: 0.8rem; /* Smaller font size for inputs */
    }

    button {
      padding: 0.7rem 1rem; /* Adjust button size */
      font-size: 0.8rem; /* Smaller button font size */
    }

    span {
      font-size: 0.7rem; /* Adjust span text size */
    }
  }
`;
