// frequencies currently playing
import { playNoteName, measure, getAllNotes, measureSubdivisions, defMaxVolume } from './utils.js';

let playing = false;
let currentLoop = 0;
let stopped = true;
let loopTimes = 4;
const msPerMeasure = measure * 1000;
const noteDuration = (1 / measureSubdivisions) * msPerMeasure;
const colorNames = {
  'rgb(255, 0, 0)': 'red',
  'rgb(255, 165, 0)': 'orange',
  'rgb(255, 255, 0)': 'yellow',
  'rgb(0, 128, 0)': 'green',
  'rgb(0, 0, 255)': 'blue',
}

const playElement = (keyElement) => {
  keyElement.classList.add('playing');
  setTimeout(() => {
      stopElement(keyElement);
    },
    noteDuration
  )
}

const stopElement = (key) => {
  key.classList.remove('playing');
}

const playNoteKey = (key) => {
  playElement(key);
  let noteName = getNoteName(key);
  playNoteName(noteName);
}

const playNoteEvent = (e) => {
  playNoteKey(e.target);
}

const createBoard = (chords) => {
  const board = document.createElement('div');
  board.classList.add('board');
  board.setAttribute('id', 'sound-board');
  chords.forEach(chord => {
    const chordDiv = document.createElement('div');
    chordDiv.classList.add('chord');
    const chordNotes = getAllNotes(chord);
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

const getRandomKeys = (chordDiv, n) => {
  let keyDivs = chordDiv.children;
  let randomKeys = [];
  let keyIndices = Array(keyDivs.length).fill().map((x,i)=>i);
  for (let i = 0; i < n; i++) {
    let randomKeyIndex = Math.floor(Math.random() * keyIndices.length);
    let keyIndex = keyIndices[randomKeyIndex];
    let randomKey = keyDivs[keyIndex];
    randomKeys.push(randomKey);
    keyIndices.splice(randomKeyIndex, 1);
  }
  return randomKeys;
}

const getNoteName = (key) => {
  return key.textContent.replace(/\s/g, '');
}

const playRandomNotes = async (chord) => {
  chord.style.backgroundColor = 'gray';
  for (let i = 0; i < measureSubdivisions; i++) {
    if (stopped) {break;}
    let randomChordKeys = getRandomKeys(chord, 4);
    let firstKey = randomChordKeys[0];
    let style = getComputedStyle(firstKey);
    const playColor = document.getElementById('play-color');
    const currentColor = colorNames[style.backgroundColor];
    playColor.style.backgroundColor = currentColor;
    playColor.innerHTML = `Playing: ` + currentColor.toUpperCase();
    if (synth) {
      let randomNotes = [];
      randomChordKeys.forEach(key => {
        randomNotes.push(getNoteName(key));
        playElement(key);
      });
      synth.triggerAttackRelease(randomNotes, "8n");
    } else {
      randomChordKeys.forEach(keyElement => playNoteKey(keyElement))
    }
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

const updatePlayStatus = () => {
  document.getElementById('play-status').innerHTML = `Loop ` + currentLoop + ` of ` + loopTimes;
}

const loopPlay = async () => {
  const playButton = document.getElementById('play');
  playButton.innerHTML = `&#128721;`;
  stopped = false;
  for (let i = 0; i < loopTimes; i++) {
    currentLoop += 1;
    updatePlayStatus();
    await play();
    if (stopped) { break; }
  }
  currentLoop = 0;
  stopped = true;
  playButton.innerHTML = `&#9654; `;
  updatePlayStatus();
}

const setTimes = (numTimes) => {
  loopTimes = numTimes;
}

const toggleSynth = () => {
  let synthOption = document.getElementById('synth-option');
  if (synth) {
    synth = null
    synthOption.style.backgroundColor = 'black'
    synthOption.style.color = 'white'
    synthOption.textContent = `Turn ToneJS On`
  } else {
    synth = new Tone.PolySynth();
    const gain = new Tone.Gain(defMaxVolume);
    const autoPanner = new Tone.AutoPanner("4n").toDestination();
    synth.chain(gain, autoPanner);
    synthOption.style.backgroundColor = 'white'
    synthOption.style.color = 'black'
    synthOption.textContent = `Turn ToneJS Off`
  }
}

let synth = null;

const submitTimes = (event) => {
  event.preventDefault();
  const timesInput = document.getElementById('loops-select');
  setTimes(timesInput.value);
  updatePlayStatus();
}

const getLoopLabel = () => {
  const loopLabel = document.createElement('label');
  loopLabel.setAttribute('for', 'loops-select');
  loopLabel.textContent = `Loops`;
  loopLabel.style.color = 'white';
  return loopLabel;
}

const getLoopSelect = () => {
  const loopSelect = document.createElement('select');
  loopSelect.setAttribute('id', 'loops-select');
  loopSelect.setAttribute('name', 'loops');
  loopSelect.addEventListener('change', submitTimes);
  for (let v = 0; v < 16; v++) {
    let optionValue = v + 1;
    let loopOption = document.createElement('option');
    loopOption.textContent = optionValue.toString();
    loopOption.value = optionValue.toString();
    if (optionValue === loopTimes) {
      loopOption.setAttribute('selected', 'selected');
    }
    loopSelect.appendChild(loopOption);
  }
  return loopSelect;
}

const getTimesForm = () => {
  const timesForm = document.createElement('form');
  timesForm.setAttribute('id', 'loop-form');
  timesForm.appendChild(getLoopSelect());
  timesForm.appendChild(getLoopLabel());
  return timesForm;
}

const footer = () => {
  const footerDiv = document.createElement('div');
  footerDiv.classList.add('chord');

  // color chord status
  const rowColor = document.createElement('div');
  rowColor.classList.add('press');
  rowColor.setAttribute('id', 'play-color');
  rowColor.innerHTML = 'Not Playing';
  footerDiv.appendChild(rowColor);

  // play button
  const playButton = document.createElement('div');
  playButton.classList.add('press');
  playButton.setAttribute('id', 'play');
  playButton.innerHTML = `&#9654;`;
  playButton.addEventListener('pointerdown', loopPlay);
  footerDiv.appendChild(playButton);

  // to change number of loops
  footerDiv.appendChild(getTimesForm());

  // loop status
  const loopStatus = document.createElement('div');
  loopStatus.classList.add('press');
  loopStatus.setAttribute('id', 'play-status');
  loopStatus.textContent = `Loop 0 of ` + loopTimes;
  footerDiv.appendChild(loopStatus);

  // allow use of ToneJS for autoplay
  const synthOption = document.createElement('div');
  synthOption.classList.add('press');
  synthOption.setAttribute('id', 'synth-option');
  synthOption.addEventListener("click", toggleSynth);
  synthOption.textContent = `Turn ToneJS On`;
  footerDiv.appendChild(synthOption);

  return footerDiv;
}

const boardChords = [
  ['Eb', 'G', 'Bb'], // Eb
  ['C', 'Eb', 'G', 'Bb'], // Cm7
  ['G', 'Bb', 'D'], // Gm
  ['F', 'Ab', 'C'], // Fm
  ['C', 'Eb', 'G'], // Cm
];

export const setUpApp = () => {
  const app = document.getElementById('app');
  app.appendChild(createBoard(boardChords))
  app.appendChild(footer());
}

window.onload = () => {
  setUpApp();
}
