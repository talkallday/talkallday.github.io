import createElement from '../utils/createElement.js';

const ToneJSOption = (eventPair) => {
  const synthOption = createElement({
    classList: ['cell'],
    attributes: [['id', 'synth-option']],
    eventListener: eventPair
})
  synthOption.textContent = `Turn ToneJS On`;
  return synthOption;
}

export default ToneJSOption;