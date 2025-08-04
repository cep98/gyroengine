import { socket } from "./socket.js";

const container = document.getElementById("device-list");
const gameStatus = document.getElementById("game-status");
const smoothingSlider = document.getElementById("smoothing");
const smoothingLabel = document.getElementById("smooth-value");

const devices = {};
const gameClients = new Set();

smoothingSlider.addEventListener("input", () => {
  const percent = Number(smoothingSlider.value);
  smoothingLabel.textContent = percent + "%";
  const factor = percent / 100;
  socket.emit("smoothing", factor);
});

function createDeviceBlock(id) {
  const block = document.createElement("div");
  block.className = "device";
  block.innerHTML = `
    <div><strong>ID:</strong> ${id}</div>
    <div class="label">Alpha: <span id="alpha-${id}">0</span></div>
    <div id="bar-alpha-${id}" class="bar"></div>
    <div class="label">Beta: <span id="beta-${id}">0</span></div>
    <div id="bar-beta-${id}" class="bar"></div>
    <div class="label">Gamma: <span id="gamma-${id}">0</span></div>
    <div id="bar-gamma-${id}" class="bar"></div>
  `;
  container.appendChild(block);
  devices[id] = true;
}

function updateBar(id, type, value) {
  document.getElementById(`${type}-${id}`).textContent = value.toFixed(1);
  const bar = document.getElementById(`bar-${type}-${id}`);
  bar.style.width = `${Math.min(Math.abs(value), 180)}px`;
  bar.style.background = value > 0 ? "#4caf50" : "#f44336";
}

function renderGameList() {
  let output = "<h3>Verbundene game.html:</h3><ul>";
  for (const id of gameClients) {
    output += `<li>${id}</li>`;
  }
  output += "</ul>";
  gameStatus.innerHTML = output;
}

socket.on("clientType", (data) => {
  if (data.type === "game") {
    gameClients.add(data.id);
    renderGameList();
  }
});

socket.on("gyroData", (data) => {
  const id = data.id;
  if (!devices[id]) createDeviceBlock(id);

  updateBar(id, "alpha", data.alpha || 0);
  updateBar(id, "beta", data.beta || 0);
  updateBar(id, "gamma", data.gamma || 0);
});
