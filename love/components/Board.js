import createElement from './utils.js';
import playNoteKey from '../PlayNoteKey.js';
import noteValues from '../NoteValues.js';

const boardChords = [
  ['Eb', 'G', 'Bb'], // Eb
  ['C', 'Eb', 'G', 'Bb'], // Cm7
  ['G', 'Bb', 'D'], // Gm
  ['F', 'Ab', 'C'], // Fm
  ['C', 'Eb', 'G'], // Cm
];

const getAllNotes = (chord) => {
  const notes = [];
  [...noteValues.keys()].forEach((noteName) => {
    let note = noteName.slice(0, -1);
    if (chord.includes(note)) notes.push(noteName);
  })
  return notes;
}

const playNoteEvent = (e) => {
  playNoteKey(e.target);
}

const Board = (chords = null) => {
  let board = createElement({
    classList: ['board'],
    attributes: [['id', 'sound-board']]
  });
  if ( chords === null) {
    chords = boardChords;
  }
  chords.forEach(chord => {
    let chordDiv = createElement({classList: ['chord']});
    let chordNotes = getAllNotes(chord);
    chordNotes.forEach((note) => {
      let noteDiv = createElement({classList: ['press', 'key']});
      noteDiv.addEventListener('pointerdown', playNoteEvent)
      let kbd = document.createElement('kbd');
      kbd.textContent = note;
      noteDiv.appendChild(kbd);
      chordDiv.appendChild(noteDiv);
    })
    board.appendChild(chordDiv);
  });
  return board;
}

export default Board;