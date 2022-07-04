import createElement from "./utils.js";
import {
    loopPlay,
    submitTimes,
    toggleSynth
 } from "../listeners.js";
import ChordStatus from './ChordStatus.js'
import LoopStatus from './LoopStatus.js'
import PlayButton from './PlayButton.js'
import TimesForm from './TimesForm.js'
import ToneJSOption from './ToneJSOption.js'
import State from '../State.js';

const BottomBar = () => {
  const footerDiv = createElement({classList: ['chord']});

  footerDiv.appendChild(PlayButton(['pointerup', loopPlay]));
  footerDiv.appendChild(TimesForm(['change', submitTimes], State.loopTimes));
  footerDiv.appendChild(LoopStatus(State.loopTimes));
  footerDiv.appendChild(ChordStatus());
  footerDiv.appendChild(ToneJSOption(['click', toggleSynth]));

  return footerDiv;
}

export default BottomBar;