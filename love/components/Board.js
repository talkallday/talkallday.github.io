import createElement from '../utils/createElement.js';
import playNoteKey from '../utils/playNoteKey.js';
import noteValues from '../utils/NoteFrequencies.js';

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
      let noteDiv = createElement({classList: ['cell', 'key']});
      noteDiv.addEventListener('pointerdown', playNoteEvent)
      noteDiv.textContent = note;
      chordDiv.appendChild(noteDiv);
    })
    board.appendChild(chordDiv);
  });
  return board;
}

export default Board;