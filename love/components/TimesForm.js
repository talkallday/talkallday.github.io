import createElement from "./utils.js";
import getLoopLabel from "./LoopLabel.js";
import getLoopSelect from "./LoopSelect.js";

const TimesForm = (eventPair, loopTimes) => {
  const timesForm = createElement({
    divType: 'form',
    attributes: [['id', 'loop-form']]
  });
  timesForm.appendChild(getLoopSelect(eventPair, loopTimes));
  timesForm.appendChild(getLoopLabel());
  return timesForm;
}

export default TimesForm;
