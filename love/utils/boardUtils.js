import State from '../State.js';

export const getNoteName = (key) => {
  return key.textContent.replace(/\s/g, '');
}

const stopElement = (key) => {
  key.classList.remove('playing');
}

export const playElement = (keyElement) => {
  keyElement.classList.add('playing');
  setTimeout(() => {
      stopElement(keyElement);
    },
    State.noteDuration
  )
}