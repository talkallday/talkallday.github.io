// frequencies currently playing
import { playNoteName, measure, getNotes } from './utils.js';

let playing = false;
let stopped = true;
let loopTimes = 4;
const mms = measure * 1000;
const defMaxVolume = 0.4;
const autoVolume = defMaxVolume * 0.5;
const noteDuration = .25 * mms;
const colorNames = {
  'rgb(255, 0, 0)': 'red',
  'rgb(255, 165, 0)': 'orange',
  'rgb(255, 255, 0)': 'yellow',
  'rgb(0, 128, 0)': 'green',
  'rgb(0, 0, 255)': 'blue',
}

const playKeyNote = (key) => {
  key.classList.add('playing');
  let noteName = key.textContent.replace(/\s/g, '');
  playNoteName(noteName, autoVolume);
  setTimeout(() => {
      stopElement(key);
    },
    noteDuration
  )
}

const playElement = (key) => {
  let style = getComputedStyle(key);
  const playColor = document.getElementById('play-color');
  const currentColor = colorNames[style.backgroundColor];
  playColor.style.backgroundColor = currentColor;
  playColor.innerHTML = `Playing: ` + currentColor.toUpperCase();
  playKeyNote(key);
}

const stopElement = (key) => {
  key.classList.remove('playing');
}

const playNoteEvent = (e) => {
  playKeyNote(e.target);
}

const playRandomNote = (chord) => {
  let keys = chord.children;
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  playElement(randomKey);
  setTimeout(() => {
      stopElement(randomKey);
    },
    noteDuration
  )
}

const playRandomNotes = async (chord) => {
  chord.style.backgroundColor = 'gray';
  for (let i = 0; i < 4; i++) {
    if (stopped) {break;}
    playRandomNote(chord);
    playRandomNote(chord);
    playRandomNote(chord);
    await new Promise(resolve => setTimeout(resolve, noteDuration));
  }
  chord.style.backgroundColor = 'black';
}

const play = async () => {
  if (playing) return;
  playing = true;
  const board = document.getElementById('sound-board');
  const chords = [...board.children];
  const firstChord = chords[0];
  const secondChord = chords[1];
  const thirdChord = chords[2];
  const fourthChord = chords[3];
  const fifthChord = chords[4];
  !stopped && await playRandomNotes(firstChord);
  !stopped && await playRandomNotes(secondChord);
  !stopped && await playRandomNotes(thirdChord);
  !stopped && await playRandomNotes(thirdChord);
  !stopped && await playRandomNotes(fourthChord);
  !stopped && await playRandomNotes(fourthChord);
  !stopped && await playRandomNotes(fifthChord);
  !stopped && await playRandomNotes(fifthChord);
  playing = false;
}

const stopLoop = () => {
  stopped = true;
}

const updatePlayStatus = (newTime) => {
  document.getElementById('play-status').innerHTML = newTime + ` Times Through`;
}

const loopPlay = async () => {
  stopped = false;
  const ms = 8 * mms;
  for (let i = 0; i < loopTimes; i++) {
    updatePlayStatus(i);
    await play();
    if (stopped) { break; }
  }
  stopped = true;
}

const setTimes = (numTimes) => {
  const playButton = document.getElementById('play');
  // set global loop times
  loopTimes = numTimes;
  // set visible loop time
  playButton.innerHTML = `Press To Play ` + loopTimes + ` Times`;
}

const toggleModal = () => {
  const modal = Array.from(document.querySelectorAll(".modal"))[0];
  modal.classList.toggle("show-modal");
}

const submitTimes = (event) => {
  event.preventDefault();
  const timesInput = document.getElementById('loops-select');
  setTimes(timesInput.value);
  toggleModal();
}

const modal = () => {
  const timesForm = document.createElement('form');
  timesForm.setAttribute('id', 'loop-form');

  const closeButton = document.createElement('span');
  closeButton.classList.add('close-button');
  closeButton.textContent = `x`;
  closeButton.addEventListener("click", toggleModal);
  timesForm.appendChild(closeButton);

  const loopLabel = document.createElement('label');
  loopLabel.setAttribute('for', 'loops-select');
  loopLabel.textContent = `select how many times to loop: `;
  timesForm.appendChild(loopLabel);

  const loopSelect = document.createElement('select');
  loopSelect.setAttribute('id', 'loops-select');
  loopSelect.setAttribute('name', 'loops');
  for (let v = 0; v < 16; v++) {
    let optionValue = v + 1;
    let loopOption = document.createElement('option');
    loopOption.textContent = optionValue.toString();
    loopOption.value = optionValue.toString();
    loopSelect.appendChild(loopOption);
  }
  timesForm.appendChild(loopSelect);

  const loopButton = document.createElement('button');
  loopButton.setAttribute('type', 'button');
  loopButton.setAttribute('id', 'set-loops');
  loopButton.textContent = `change`;
  timesForm.appendChild(loopButton);

  const modalContentDiv = document.createElement('div');
  modalContentDiv.classList.add('modal-content');

  modalContentDiv.appendChild(timesForm)

  const modalDiv = document.createElement('div');
  modalDiv.classList.add('modal');

  modalDiv.appendChild(modalContentDiv)

  return modalDiv;
}

const boardChords = [
  ['Eb', 'G', 'Bb'], // Eb
  ['C', 'Eb', 'G', 'Bb'], // Cm7
  ['G', 'Bb', 'D'], // Gm
  ['F', 'Ab', 'C'], // Fm
  ['C', 'Eb', 'G'], // Cm
];

const createBoard = (chords) => {
  const board = document.createElement('div');
  board.classList.add('board');
  board.setAttribute('id', 'sound-board');
  chords.forEach(chord => {
    const chordDiv = document.createElement('div');
    chordDiv.classList.add('chord');
    const chordNotes = getNotes(chord);
    chordNotes.forEach((note) => {
      const noteDiv = document.createElement('div');
      noteDiv.classList.add('press', 'key');
      noteDiv.addEventListener('pointerdown', playNoteEvent)
      const kbd = document.createElement('kbd');
      kbd.textContent = note;
      noteDiv.appendChild(kbd);
      chordDiv.appendChild(noteDiv);
    })
    board.appendChild(chordDiv);
  });
  return board;
}

const bottomBoard = () => {
  const boardDiv = document.createElement('div');
  boardDiv.classList.add('chord');

  // set up looper
  const playButton = document.createElement('div');
  playButton.classList.add('press');
  playButton.setAttribute('id', 'play');
  playButton.addEventListener('pointerdown', loopPlay);
  boardDiv.appendChild(playButton);

  // set up visible playing status
  const playStatus = document.createElement('div');
  playStatus.classList.add('press');
  playStatus.setAttribute('id', 'play-status');
  boardDiv.appendChild(playStatus);

  const playColor = document.createElement('div');
  playColor.classList.add('press');
  playColor.setAttribute('id', 'play-color');
  playColor.innerHTML = 'Not Playing';
  boardDiv.appendChild(playColor);

  // set up looper stop
  const stopButton = document.createElement('div');
  stopButton.classList.add('press');
  stopButton.setAttribute('id', 'stop-button');
  stopButton.innerHTML = 'Press To Stop';
  stopButton.addEventListener('pointerdown', stopLoop);
  boardDiv.appendChild(stopButton);

  const modalLoops = document.createElement('div');
  modalLoops.classList.add('press');
  modalLoops.setAttribute('id', 'modal-loops');
  modalLoops.innerHTML = 'Change Loop Times';
  modalLoops.addEventListener("click", toggleModal);
  boardDiv.appendChild(modalLoops);

  return boardDiv;
}

export const setUpApp = () => {
  const app = document.getElementById('app');
  app.appendChild(modal());
  app.appendChild(createBoard(boardChords))
  app.appendChild(bottomBoard());

  // set default number of times and refresh play status
  setTimes(loopTimes);
  updatePlayStatus(0);

  document.getElementById("set-loops").addEventListener("click", submitTimes);

  const closeButton = document.querySelector(".close-button");
}