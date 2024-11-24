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
  grid-template-columns: 10% 90%; /* Adjusting the layout to make buttons smaller on mobile */
  background-color: #dcf8c6;
  padding: 0 2rem;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  /* Mobile screen styling */
  @media screen and (max-width: 719px) {
    grid-template-columns: 15% 70% 15%; /* More space for input on mobile */
    padding: 0.5rem;
    gap: 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 2px;
    position: relative;
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
    gap: 5rem; /* Reduced gap for better mobile responsiveness */
    background-color: #bbbbbb;
    color: white;

    input {
      width: 100%;
      height: 50px;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.1rem; /* Slightly smaller font size for mobile */
      overflow: hidden;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }

      /* Font size adjustment for mobile */
      @media screen and (max-width: 719px) {
        font-size: 1rem; /* Smaller font size on mobile */
      }
    }

    button {
      padding: 0.3rem 1rem;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #25d366;
      border: none;
      cursor: pointer;

      svg {
        font-size: 1.5rem;
        color: white;
      }

      /* Responsive button size */
      @media screen and (max-width: 719px) {
        padding: 0.3rem;
        svg {
          font-size: 1.2rem;
        }
      }

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1.5rem;
        }
      }
    }
  }
`;
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-end;
//   align-items: center;
//   background-color: #dcf8c6;
//   padding: 0 2rem;
//   width: 100%;

//   .input-container {
//     display: flex;
//     align-items: center;
//     width: 100%;
//     background-color: #eeeeee;
//     border-radius: 20px;
//     padding: 10px 0;
//     position: relative;
//     box-sizing: border-box;
//   }

//   .input-wrapper {
//     display: flex;
//     align-items: center;
//     width: 100%;
//     margin-right: 10px;
//     position: relative;
//     background-color: transparent;
//   }

//   .emoji {
//     position: absolute;
//     left: 10px;
//     cursor: pointer;
//     font-size: 1.5rem;
//   }

//   input {
//     width: 100%;
//     height: 0px;
//     padding-left: 35px; /* Adjust padding to accommodate emoji icon */
//     background-color: transparent;
//     border: none;
//     color: #333;
//     font-size: 1rem;
//     border-radius: 15px;
//     box-sizing: border-box;

//     &:focus {
//       outline: none;
//     }
//   }

//   .button-container {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     position: absolute;
//     right: 10px;

//     button {
//       padding: 10px;
//       border-radius: 50%;
//       background-color: #25d366;
//       color: white;
//       border: none;
//       cursor: pointer;

//       svg {
//         font-size: 1.5rem;
//       }
//     }
//   }

//   /* Responsive styling for mobile */
//   @media screen and (max-width: 719px) {
//     padding: 0 1rem;
//     .input-container {
//       padding: 8px 0;
//     }

//     .input-wrapper {
//       margin-right: 0;
//     }

//     input {
//       font-size: 0.9rem;
//       padding-left: 30px;
//     }

//     .button-container {
//       gap: 5px;

//       button {
//         padding: 8px;
//         svg {
//           font-size: 1.3rem;
//         }
//       }
//     }
//   }

//   /* Responsive styling for tablet/laptop screens */
//   @media screen and (min-width: 720px) and (max-width: 1080px) {
//     padding: 0 1rem;
//     .input-container {
//       padding: 10px 0;
//     }

//     input {
//       font-size: 1rem;
//       padding-left: 35px;
//     }
//   }
// `;

