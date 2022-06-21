// frequencies currently playing
import { playNoteName, measure } from './utils.js';

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

const playNote = (e) => {
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
  for (let i = 0; i < 3; i++) {
    if (stopped) {break;}
    playRandomNote(chord);
    playRandomNote(chord);
    playRandomNote(chord);
    await new Promise(resolve => setTimeout(resolve, noteDuration));
  }
  chord.style.backgroundColor = 'black';
}

const play = async () => {
  if (playing) {return}
  playing = true;
  const board = document.getElementById('sound-board');
  const chords = [...board.children];
  const firstChord = chords[0];
  const secondChord = chords[1];
  const thirdChord = chords[2];
  const fourthChord = chords[3];
  const fifthChord = chords[4];
  !stopped && playRandomNotes(firstChord) && await new Promise(resolve => setTimeout(resolve, mms));
  !stopped && playRandomNotes(secondChord) && await new Promise(resolve => setTimeout(resolve, mms));
  !stopped && playRandomNotes(thirdChord) && await new Promise(resolve => setTimeout(resolve, mms));
  !stopped && playRandomNotes(thirdChord) && await new Promise(resolve => setTimeout(resolve, mms));
  !stopped && playRandomNotes(fourthChord) && await new Promise(resolve => setTimeout(resolve, mms));
  !stopped && playRandomNotes(fourthChord) && await new Promise(resolve => setTimeout(resolve, mms));
  !stopped && playRandomNotes(fifthChord) && await new Promise(resolve => setTimeout(resolve, mms));
  !stopped && playRandomNotes(fifthChord);
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
    play();
    await new Promise(resolve => setTimeout(resolve, ms));
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

export const renderSoundboard = () => {

}

export const setUpSoundboard = () => {
  // set up soundboard
  const keys = Array.from(document.querySelectorAll('.key'));
  keys.forEach(key => key.addEventListener('pointerdown', playNote));

  // set default number of times and refresh play status
  setTimes(loopTimes);
  updatePlayStatus(0);

  // set up visible playing status
  document.querySelector('#play-color').innerHTML = 'Not Playing';

  // set up looper
  document.querySelector('#play').addEventListener('pointerdown', loopPlay);

  // set up looper stop
  const stopButton = document.getElementById('stop-button');
  stopButton.innerHTML = 'Press To Stop';
  stopButton.addEventListener('pointerdown', stopLoop);

  document.getElementById("modal-loops").addEventListener("click", toggleModal);

  document.getElementById("set-loops").addEventListener("click", submitTimes);

  const closeButton = document.querySelector(".close-button");
  closeButton.addEventListener("click", toggleModal);
}

window.onload = () => {
  setUpSoundboard();
}
