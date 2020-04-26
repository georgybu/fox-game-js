import Renderer from "./render";
import State from "./state";
import Game from "./game";

import { DAY_LENGTH, NIGHT_LENGTH, RAIN_CHANCE, TICK_RATE } from "./app-config";

const renderer = new Renderer();
const initialState = new State();

const game = new Game(renderer, initialState, {
  RAIN_CHANCE,
  DAY_LENGTH,
  NIGHT_LENGTH,
});

game.init();

let nextTimeToTick = Date.now();

function nextAnimationFrame() {
  const now = Date.now();
  if (nextTimeToTick <= now) {
    game.tick();
    nextTimeToTick = now + TICK_RATE;
  }
  requestAnimationFrame(nextAnimationFrame);
}

nextAnimationFrame();
