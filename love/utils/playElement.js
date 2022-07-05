import State from '../State.js';

const stopElement = (key) => {
  key.classList.remove('playing');
}

const playElement = (keyElement) => {
  keyElement.classList.add('playing');
  setTimeout(() => {
      stopElement(keyElement);
    },
    State.noteDuration
  )
}

export default playElement;