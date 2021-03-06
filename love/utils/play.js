import playNoteKey from './playNoteKey.js';
import playElement from './playElement.js';
import getNoteName from './getNoteName.js';
import State from '../State.js';

const colorNames = {
  'rgb(255, 0, 0)': 'red',
  'rgb(255, 165, 0)': 'orange',
  'rgb(255, 255, 0)': 'yellow',
  'rgb(0, 128, 0)': 'green',
  'rgb(0, 0, 255)': 'blue',
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

const playRandomNotes = async (chord) => {
  chord.style.backgroundColor = 'gray';
  for (let i = 0; i < State.measureSubdivisions; i++) {
    if (State.stopped) {break;}
    let randomChordKeys = getRandomKeys(chord, 4);
    let firstKey = randomChordKeys[0];
    let style = getComputedStyle(firstKey);
    const currentColor = colorNames[style.backgroundColor];
    const playColor = document.getElementById('play-color');
    playColor.style.backgroundColor = currentColor;
    playColor.innerHTML = `PLAY: ` + currentColor.toUpperCase();
    if (State.synth) {
      let randomNotes = [];
      randomChordKeys.forEach(key => {
        randomNotes.push(getNoteName(key));
        playElement(key);
      });
      State.synth.triggerAttackRelease(randomNotes, "8n");
    } else {
      randomChordKeys.forEach(keyElement => playNoteKey(keyElement))
    }
    await new Promise(resolve => setTimeout(resolve, State.noteDuration));
  }
  chord.style.backgroundColor = 'black';
}

const setBasePlayColor = () => {
  const playColor = document.getElementById('play-color');
  playColor.innerHTML = `Not Playing`;
  playColor.style.backgroundColor = 'black';
}

const play = async () => {
  if (State.playing) return;
  State.playing = true;
  const board = document.getElementById('sound-board');
  const chords = [...board.children];
  const firstChord = chords[0];
  const secondChord = chords[1];
  const thirdChord = chords[2];
  const fourthChord = chords[3];
  const fifthChord = chords[4];
  !State.stopped ? await playRandomNotes(firstChord) : setBasePlayColor();
  !State.stopped ? await playRandomNotes(secondChord) : setBasePlayColor();
  !State.stopped ? await playRandomNotes(thirdChord) : setBasePlayColor();
  !State.stopped ? await playRandomNotes(thirdChord) : setBasePlayColor();
  !State.stopped ? await playRandomNotes(fourthChord) : setBasePlayColor();
  !State.stopped ? await playRandomNotes(fourthChord) : setBasePlayColor();
  !State.stopped ? await playRandomNotes(fifthChord) : setBasePlayColor();
  !State.stopped ? await playRandomNotes(fifthChord) : setBasePlayColor();
  State.playing = false;
}

export default play;