const State = {
  stopped: true,
  playing: false,
  currentLoop: 0,
  loopTimes: 4,
  synth: null,
  defMaxVolume: 0.1,
  measure: 2.5,
  measureSubdivisions: 4,
  noteDuration: (1 / 4) * (2.5 * 1000)
}

export default State;
