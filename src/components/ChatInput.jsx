import React, { useEffect, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend, IoIosMic, IoIosMicOff } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChatInput({ handleSendMsg }) {
  const [typedMsg, setTypedMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    alert(`Browser doesn't support speech recognition.`);
  }
  const toastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    setTypedMsg(prevMsg => prevMsg + emojiObject.emoji);
  };

  const startListening = () => {
    setTypedMsg(""); // Clear the input when starting to listen
    SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (listening) {
      setShowWarning(true); // Show warning message if listening is active
      toast.error("First Stop Recording then send message.", toastOptions);
    } else {
      setShowWarning(false)
      const finalMsg = typedMsg || transcript;
      if (finalMsg.trim() !== "") {
        handleSendMsg(finalMsg);
        setTypedMsg("");
        // Clear the transcript after sending the message
        resetTranscript();
      }
    }
  };

  useEffect(() => {
    if (listening) {
      setTypedMsg(transcript)
    }
  }, [transcript, listening])

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setTypedMsg(inputValue);
  
    // Manually reset transcript if input is empty
    if (inputValue === "") {
      resetTranscript();
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill style={{color:"#25D366"}} onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={handleInputChange}
          value={typedMsg} // Display the typed message in the input field
        />
        <div className="button-container">
          <button type="submit">
            <IoMdSend />
          </button>
          {!listening ? <button className="btn" type="button" onClick={startListening}><IoIosMic /></button> :
            <button className="btn" type="button" onClick={stopListening}><IoIosMicOff /></button>}
        </div>
        <ToastContainer />
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #dcf8c6;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 2px;
    position : relative ;
    margin-right: -32px;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #bbbbbb	;
    color:white;
    input {
      width: 120%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;
      overflow: hidden;
  
      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #25d366;
      border: none;
      cursor: pointer;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }  
`;
