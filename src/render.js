class Renderer {
  constructor() {
    this.app = document.getElementById("app");
    this.icons = document.getElementById("icons");
    this.debugInfo = document.getElementById("debug-info");
  }

  initListeners(onLeftClick, onRightClick, onActionClick) {
    document.querySelectorAll(".btn").forEach((node) => {
      node.addEventListener("click", ({ target }) => {
        if (target.classList.contains("left-btn")) {
          onLeftClick();
        }
        if (target.classList.contains("right-btn")) {
          onRightClick();
        }
        if (target.classList.contains("middle-btn")) {
          onActionClick();
        }
      });
    });
  }

  render(state) {
    this.app.innerHTML = `
      <div class="game ${state.scene}"></div>
      <div class="fox fox-${state.fox}"></div>
      <div class="poop-bag ${state.poopBug}"></div>
      <div class="foreground-rain"></div>
      <div class="frame"></div>
      <div class="modal">
        <div class="modal-inner">${state.modal}</div>
      </div>
    `;
  }

  renderIcons(state) {
    this.icons.innerHTML = `
      <div class="icons">
        <div class="icon ${
          state.action === "fish" ? "highlighted" : ""
        } fish-icon"></div>
        <div class="icon ${
          state.action === "poop" ? "highlighted" : ""
        } poop-icon"></div>
        <div class="icon ${
          state.action === "weather" ? "highlighted" : ""
        } weather-icon"></div>
      </div>
    `;
  }

  renderDebugInfo(o) {
    const max = Math.max(...Object.keys(o).map((key) => o[key]));

    const getProgress = (label, value) => `
      <p>${label}: ${value}</p>
      <progress value="${value}" max="${max}">${value}</progress>
    `;

    this.debugInfo.innerHTML = `
      ${getProgress("clock", o.clock)}
      ${getProgress("wakeTime", o.wakeTime)}
      ${getProgress("sleepTime", o.sleepTime)}
      ${getProgress("hungryTime", o.hungryTime)}
      ${getProgress("dieTime", o.dieTime)}
      ${getProgress("poopTime", o.poopTime)}
      ${getProgress("timeToStartCelebrating", o.timeToStartCelebrating)}
      ${getProgress("timeToEndCelebrating", o.timeToEndCelebrating)}
      <p>Max: ${max}</p>
    `;
  }
}

export default Renderer;
