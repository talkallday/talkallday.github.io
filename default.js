// frequencies currently playing
let frequencies = new Set();
let playing = false;
let stopped = true;
const measure = 2.5;
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
const noteValues = {
  'C0': 16.35,
  'C#0': 17.32,
  'Db0': 17.32,
  'D0': 18.35,
  'D#0': 19.45,
  'Eb0': 19.45,
  'E0': 20.60,
  'F0': 21.83,
  'F#0': 23.12,
  'Gb0': 23.12,
  'G0': 24.50,
  'G#0': 25.96,
  'Ab0': 25.96,
  'A0': 27.50,
  'A#0': 29.14,
  'Bb0': 29.14,
  'B0': 30.87,
  'C1': 32.70,
  'C#1': 34.65,
  'Db1': 34.65,
  'D1': 36.71,
  'D#1': 38.89,
  'Eb1': 38.89,
  'E1': 41.20,
  'F1': 43.65,
  'F#1': 46.25,
  'Gb1': 46.25,
  'G1': 49.00,
  'G#1': 51.91,
  'Ab1': 51.91,
  'A1': 55.00,
  'A#1': 58.27,
  'Bb1': 58.27,
  'B1': 61.74,
  'C2': 65.41,
  'C#2': 69.30,
  'Db2': 69.30,
  'D2': 73.42,
  'D#2': 77.78,
  'Eb2': 77.78,
  'E2': 82.41,
  'F2': 87.31,
  'F#2': 92.50,
  'Gb2': 92.50,
  'G2': 98.00,
  'G#2': 103.83,
  'Ab2': 103.83,
  'A2': 110.00,
  'A#2': 116.54,
  'Bb2': 116.50,
  'B2': 123.47,
  'C3': 130.81,
  'C#3': 138.59,
  'Db3': 138.59,
  'D3': 146.83,
  'D#3': 155.56,
  'Eb3': 155.56,
  'E3': 164.81,
  'F3': 174.61,
  'F#3': 185.00,
  'Gb3': 185.00,
  'G3': 196.00,
  'G#3': 207.65,
  'Ab3': 207.65,
  'A3': 220.00,
  'A#3': 233.08,
  'Bb3': 233.00,
  'B3': 246.94,
  'C4': 261.63,
  'C#4': 277.18,
  'Db4': 277.18,
  'D4': 293.66,
  'D#4': 311.13,
  'Eb4': 311.13,
  'E4': 329.63,
  'F4': 349.23,
  'F#4': 369.99,
  'Gb4': 369.99,
  'G4': 392.00,
  'G#4': 415.30,
  'Ab4': 415.30,
  'A4': 440.00,
  'A#4': 466.16,
  'Bb4': 466.00,
  'B4': 493.88,
  'C5': 523.25,
  'C#5': 554.37,
  'Db5': 554.37,
  'D5': 587.33,
  'D#5': 622.25,
  'Eb5': 622.25,
  'E5': 659.26,
  'F5': 698.46,
  'F#5': 739.99,
  'Gb5': 739.99,
  'G5': 783.99,
  'G#5': 830.61,
  'Ab5': 830.61,
  'A5': 880.00,
  'A#5': 932.33,
  'Bb5': 932.00,
  'B5': 987.77,
  'C6': 1046.50,
  'C#6': 1108.73,
  'Db6': 1108.73,
  'D6': 1174.66,
  'D#6': 1244.51,
  'Eb6': 1244.51,
  'E6': 1318.51,
  'F6': 1396.91,
  'F#6': 1479.98,
  'Gb6': 1479.98,
  'G6': 1567.98,
  'G#6': 1661.22,
  'Ab6': 1661.22,
  'A6': 1760.00,
  'A#6': 1864.66,
  'Bb6': 1864.66,
  'B6': 1975.53,
  'C7': 2093.00,
  'C#7': 2217.46,
  'Db7': 2217.46,
  'D7': 2349.32,
  'D#7': 2489.02,
  'Eb7': 2489.02,
  'E7': 2637.02,
  'F7': 2793.83,
  'F#7': 2959.96,
  'Gb7': 2959.96,
  'G7': 3135.96,
  'G#7': 3322.44,
  'Ab7': 3322.44,
  'A7': 3520.00,
  'A#7': 3729.31,
  'Bb7': 3729.31,
  'B7': 3951.07,
  'C8': 4186.01
};

const playSound = (arr) => {
  let buf = new Float32Array(arr.length);
  for (let i = 0; i < arr.length; i++) buf[i] = arr[i];
  let buffer = context.createBuffer(1, buf.length, context.sampleRate);
  buffer.copyToChannel(buf, 0);
  let source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
}

const sineWaveAt = (sampleNumber, tone) => {
  let sampleFreq = context.sampleRate / tone;
  return Math.sin(sampleNumber / (sampleFreq / (Math.PI * 2)))
}

const playTone = (frequency, maxVolume) => {
  if (frequencies.has(frequency)) return;

  frequencies.add(frequency)

  let arr = [],
    seconds = measure * .249,
    srs = context.sampleRate * seconds,
    earlyCut = srs * 0.1,
    lateCut = srs * 0.9

  for (let i = 0; i < srs; i++) {
    let volume = maxVolume;
    if (i < earlyCut) {
      volume *= (i / earlyCut);
    } else if (i > lateCut) {
      volume *= ((srs - i) / earlyCut);
    } else {
      volume = maxVolume;
    }
    if (volume > maxVolume) {
      volume = maxVolume;
    }
    arr[i] = sineWaveAt(i, frequency) * volume;
  }

  playSound(arr);
  frequencies.delete(frequency);
}

const context = new AudioContext();

const playNoteName = (noteName, maxVolume) => {
  let frequency = noteValues[noteName];
  playTone(frequency, maxVolume);
}

const playElement = (key) => {
  key.classList.add('playing');
  let style = getComputedStyle(key);
  const playColor = Array.from(document.querySelectorAll('.play-color'))[0];
  const currentColor = colorNames[style.backgroundColor];
  playColor.style.backgroundColor = currentColor;
  playColor.innerHTML = `Playing: ` + currentColor.toUpperCase();
  let noteName = key.textContent.replace(/\s/g, '');
  playNoteName(noteName, autoVolume);
}

const stopElement = (key) => {
  key.classList.remove('playing');
}

const playNote = (e) => {
  e.target.classList.add('playing');
  let noteName = e.target.textContent.replace(/\s/g, '');
  playNoteName(noteName, defMaxVolume);
  setTimeout(() => {
      stopElement(e.target);
    },
    noteDuration
  )
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
  playRandomNote(chord);
  playRandomNote(chord);
  playRandomNote(chord);
  await new Promise(resolve => setTimeout(resolve, noteDuration));
  playRandomNote(chord);
  playRandomNote(chord);
  playRandomNote(chord);
  await new Promise(resolve => setTimeout(resolve, noteDuration));
  playRandomNote(chord);
  playRandomNote(chord);
  playRandomNote(chord);
  await new Promise(resolve => setTimeout(resolve, noteDuration));
  chord.style.backgroundColor = 'black';
}

const play = async () => {
  if (playing) {return}
  playing = true;
  const board = document.querySelectorAll('.board')[0];
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
  const playStatusDiv = Array.from(document.querySelectorAll('.play-status'))[0];
  playStatusDiv.innerHTML = newTime + ` Times Through`;
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
  const playButton = Array.from(document.querySelectorAll('.play'))[0];
  loopTimes = numTimes;
  playButton.innerHTML = `Press To Play ` + loopTimes + ` Times`;
}

const toggleModal = () => {
  const modal = Array.from(document.querySelectorAll(".modal"))[0];
  modal.classList.toggle("show-modal");
}

const submitTimes = () => {
  const timesInput = document.getElementById('loops-select');
  setTimes(timesInput.value);
  toggleModal();
}

window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.onload = () => {
  const keys = Array.from(document.querySelectorAll('.key'));
  keys.forEach(key => key.addEventListener('pointerdown', playNote));

  // set default number of times and the
  const playButton = Array.from(document.querySelectorAll('.play'))[0];
  setTimes(loopTimes);
  playButton.addEventListener('pointerdown', loopPlay);

  const playStatusDiv = Array.from(document.querySelectorAll('.play-status'))[0];
  playStatusDiv.innerHTML = 0 + ` Times Through`;

  const playColor = Array.from(document.querySelectorAll('.play-color'))[0];
  playColor.innerHTML = 'Not Playing';

  const stopButton = Array.from(document.querySelectorAll('.stop-button'))[0];
  stopButton.innerHTML = 'Press To Stop';
  stopButton.addEventListener('pointerdown', stopLoop);

  const loopsButton = document.querySelector(".set-loops");
  loopsButton.addEventListener("click", toggleModal);

  const closeButton = document.querySelector(".close-button");
  closeButton.addEventListener("click", toggleModal);
}
