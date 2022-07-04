import createElement from "./utils.js";

const getLoopSelect = (eventPair, loopTimes) => {
  const loopSelect = createElement({
    divType: 'select',
    attributes: [['id', 'loops-select'], ['name', 'loops']],
    eventListener: eventPair
  });
  for (let v = 0; v < 16; v++) {
    let optionValue = v + 1;
    let loopOption = document.createElement('option');
    loopOption.textContent = optionValue.toString();
    loopOption.value = optionValue.toString();
    if (optionValue === loopTimes) {
      loopOption.setAttribute('selected', 'selected');
    }
    loopSelect.appendChild(loopOption);
  }
  return loopSelect;
}

export default getLoopSelect;