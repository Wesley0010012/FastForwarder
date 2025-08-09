const speedRange = document.getElementById("speedRange");
const speedValue = document.getElementById("speedValue");
const applyBtn = document.getElementById("applyBtn");
const resetBtn = document.getElementById("resetBtn");

const DEFAULT_SPEED = 1.0;

const FAST_FORWARD_LOCAL_STORAGE_KEY = "fast_forwarder_latest_speed";

let actualSpeed = DEFAULT_SPEED;
const MIN_SPEED = Number(speedRange.min);
const MAX_SPEED = Number(speedRange.max);

function updateRangeBackground() {
  const percent = ((actualSpeed - MIN_SPEED) / (MAX_SPEED - MIN_SPEED)) * 100;
  speedRange.style.background = `linear-gradient(90deg, #1a73e8 ${percent}%, #ddd ${percent}%)`;
}

function setSpeedValue() {
  speedValue.value = actualSpeed.toFixed(3);
}

function setSpeedRange() {
  speedRange.value = actualSpeed;
}

function updateActualSpeed(value) {
  if (Number.isNaN(value)) {
    return;
  }

  if (value > MAX_SPEED) {
    value = MAX_SPEED;
  }

  if (value < MIN_SPEED) {
    value = MIN_SPEED;
  }

  actualSpeed = value;

  setSpeedValue();
  setSpeedRange();

  updateRangeBackground();
}

document.addEventListener("DOMContentLoaded", () => {
  const savedSpeed = parseFloat(
    localStorage.getItem(FAST_FORWARD_LOCAL_STORAGE_KEY)
  );

  updateActualSpeed(savedSpeed);
});

resetBtn.addEventListener("click", () => {
  updateActualSpeed(DEFAULT_SPEED);
});

speedRange.addEventListener("input", () => {
  const val = Number.parseFloat(speedRange.value);
  updateActualSpeed(val);
});

speedValue.addEventListener("input", () => {
  const val = Number.parseFloat(speedValue.value);
  updateActualSpeed(val);
});

applyBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "setSpeed",
        speed: actualSpeed,
      });
    }
  });

  localStorage.setItem(FAST_FORWARD_LOCAL_STORAGE_KEY, actualSpeed);

  window.close();
});
