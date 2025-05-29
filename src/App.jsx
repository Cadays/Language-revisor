import { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import './App.css'
import { sentences } from './assets/Const';

function App() {
  const inputRef = useRef(null);
  const [notes, setNotes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [randomText, setRandomText] = useState("");
  const [errorCount, setErrorCount] = useState(0);

  const popup = () => {
    const randomPhrase = sentences[Math.floor(Math.random() * sentences.length)];
    setRandomText(randomPhrase);
    setErrorCount(0);
    setShowPopup(true);
  }

  // send correction using Enter
  const keyPressed = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      correctText();
    }
  }

  // check correction
  const correctText = () => {
    const noteText = inputRef.current.value.toLowerCase().trim();
    const correction = sentences.find(phrase => phrase.correct.toLowerCase() === noteText);

    if (!correction) {
      setErrorCount(prev => prev + 1);
      if (errorCount === 0) {
        // display help
        document.getElementById("sentence-display").innerHTML = randomText.help
      } else {
        alert("Try again");
      } return;
    }

    // add the correct note in the list
    const correctNote = correction.correct;
    setNotes(prevNotes => [...prevNotes, { id: uuidv4(), text: correctNote }]);
    setShowPopup(false);
  }

  const deleteNote = (noteId) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  }

  const displayText = () => {
    const text = notes.map(note => (
      <li key={note.id}>
        <span>{note.text}</span>
        <div className='salved-notes-container' id='salved-notes-container'>
          <button
            className='delete-note'
            onClick={() => deleteNote(note.id)}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      </li>
    ));
    return text;
  }

  return (
    <div className='body'>
      {showPopup && (
        <div className='popup-note'>
          <div className='note-content'>
            <h1 id='sentence-display'>{randomText.incorrect}</h1>
            <textarea
              ref={inputRef}
              placeholder='...'
              rows="10"
              onKeyDown={keyPressed}>
            </textarea>
            <div className='buttons'>
              <button className='b-submit' onClick={correctText}>Send</button>
              <button className='b-close' onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )
      }
      <header>
        <img src="https://cdn-icons-png.flaticon.com/512/323/323315.png" alt="French flag-fr" />
        <h1>Language Revisor</h1>
      </header>
      <main className='container'>
        <div className='add-note-container'>
          <div className='add-note' onClick={popup}>
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
        <div className='salved-notes-container'>
          <div className='salved-notes'>
            <ul>{displayText()}</ul>
          </div>
        </div>
      </main>
    </div >
  )
}

export default App
