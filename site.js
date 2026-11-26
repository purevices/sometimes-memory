const player = document.querySelector(".player");
const song = player.querySelector("audio");
const playerError = player.querySelector(".player-error");
const stop = player.querySelector(".stop");
const soundToggle = document.querySelector(".sound-toggle");
let returnFocus;
let clicks = true;
let context;

function clickSound() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio || !clicks) return;
  context ??= new Audio();
  if (context.state === "suspended") context.resume().catch(() => {});
  const note = context.createOscillator();
  const gain = context.createGain();
  const time = context.currentTime;
  note.type = "sine";
  note.frequency.setValueAtTime(810, time);
  note.frequency.exponentialRampToValueAtTime(360, time + .05);
  gain.gain.setValueAtTime(.045, time);
  gain.gain.exponentialRampToValueAtTime(.001, time + .07);
  note.connect(gain).connect(context.destination);
  note.start(time);
  note.stop(time + .075);
}

document.addEventListener("click", (event) => {
  if (event.target.closest("a, button") && event.target !== soundToggle) clickSound();
});

soundToggle.addEventListener("click", () => {
  clicks = !clicks;
  soundToggle.setAttribute("aria-pressed", String(clicks));
  soundToggle.textContent = clicks ? "Clicks on" : "Clicks off";
  clickSound();
});

document.querySelectorAll("[data-play]").forEach((button) => {
  button.addEventListener("click", () => {
    returnFocus = button;
    player.hidden = false;
    playerError.hidden = true;
    song.play().catch((error) => {
      if (error.name === "AbortError") return;
      playerError.textContent = "The song couldn't start. Try the play button in the player.";
      playerError.hidden = false;
    });
    stop.focus({ preventScroll: true });
  });
});

song.addEventListener("playing", () => {
  playerError.hidden = true;
  document.body.classList.add("listening");
});
song.addEventListener("pause", () => document.body.classList.remove("listening"));

function closePlayer() {
  song.pause();
  player.hidden = true;
  document.body.classList.remove("listening");
  returnFocus?.focus({ preventScroll: true });
}

stop.addEventListener("click", closePlayer);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !player.hidden) closePlayer();
});

