import { socket } from "./socket.js";

const output = document.getElementById("gyro-output");

socket.on("gyroData", (data) => {
  const html = `
    <div>
      <strong>${data.id}</strong><br/>
      alpha: ${data.alpha?.toFixed(1)}<br/>
      beta: ${data.beta?.toFixed(1)}<br/>
      gamma: ${data.gamma?.toFixed(1)}<br/>
    </div><hr/>
  `;
  output.innerHTML = html + output.innerHTML;
});