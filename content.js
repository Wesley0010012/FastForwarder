const DEFAULT_SPEED = 1.0;

let currentSpeed = DEFAULT_SPEED;

function publishSpeed() {
  document.querySelectorAll("video").forEach((video) => {
    video.playbackRate = currentSpeed;
  });
}

function setSpeed(speed) {
  if (Number.isNaN(speed)) {
    return;
  }

  currentSpeed = speed;

  publishSpeed();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "setSpeed") {
    setSpeed(request?.speed);
  }
});

const observer = new MutationObserver(() => {
  setSpeed(currentSpeed);
});

observer.observe(document.body, { childList: true, subtree: true });

setSpeed(currentSpeed);
