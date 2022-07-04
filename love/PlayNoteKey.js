import { getNoteName, playElement } from './boardUtils.js';
import noteValues from './NoteValues.js';
import State from './State.js';

const context = new AudioContext();
let frequencies = new Set();

const sineWaveAt = (sampleNumber, tone) => {
  let sampleFreq = context.sampleRate / tone;
  return Math.sin(sampleNumber / (sampleFreq / (Math.PI * 2)))
}

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

const playTone = (frequency) => {
  if (frequencies.has(frequency)) return;

  frequencies.add(frequency)

  let arr = [],
    seconds = State.measure * (1 / State.measureSubdivisions) - .001,
    srs = context.sampleRate * seconds,
    earlyCut = srs * 0.2,
    lateCut = srs * 0.8

  for (let i = 0; i < srs; i++) {
    let volume = State.defMaxVolume;
    if (i < earlyCut) {
      volume *= (i / earlyCut);
    } else if (i > lateCut) {
      volume *= ((srs - i) / earlyCut);
    }
    if (volume > State.defMaxVolume) {
      volume = State.defMaxVolume;
    }
    arr[i] = sineWaveAt(i, frequency) * volume;
  }

  playSound(arr);
  frequencies.delete(frequency);
}

const playNoteKey = (key) => {
  playElement(key);
  let noteName = getNoteName(key);
  let frequency = noteValues.get(noteName);
  playTone(frequency);
}

export default playNoteKey;
