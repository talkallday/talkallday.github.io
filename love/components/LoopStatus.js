import createElement from "./utils.js";

const LoopStatus = (loopTimes) => {
  const loopStatus = createElement({classList: ['cell'], attributes: [['id', 'play-status']]});
  loopStatus.textContent = `Loop 0 of ` + loopTimes;
  return loopStatus;
}

export default LoopStatus;