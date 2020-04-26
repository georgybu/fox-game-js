class Game {
  constructor(renderer, state, config) {
    this.renderer = renderer;
    this.state = state;
    this.config = config;
    this.clock = 1;

    this.clearTimes();
  }

  init() {
    this.state.resetState();
    this.renderer.initListeners(
      () => this.onLeftClick(),
      () => this.onRightClick(),
      () => this.onActionClick()
    );
    this.render();
    this.renderer.renderIcons(this.state.getState());
  }

  render(gameState) {
    if (gameState) {
      this.state.setGameState(gameState);
    }
    this.renderer.render(this.state.getState());
  }

  onLeftClick() {
    this.state.setPrevAction();
    this.renderer.renderIcons(this.state.getState());
  }

  onRightClick() {
    this.state.setNextAction();
    this.renderer.renderIcons(this.state.getState());
  }

  onActionClick() {
    const { game, action } = this.state.getState();

    const unManagedStates = [
      this.state.GAME.SLEEP,
      this.state.GAME.FEEDING,
      this.state.GAME.CELEBRATING,
      this.state.GAME.HATCHING,
    ];

    const endOfGameStates = [this.state.GAME.INIT, this.state.GAME.DEAD];

    if (unManagedStates.includes(game)) {
      return;
    }

    if (endOfGameStates.includes(game)) {
      this.render(this.state.GAME.HATCHING);
      this.wakeTime = this.clock + 3;
      return;
    }

    switch (action) {
      case this.state.ACTION.WEATHER:
        this.state.changeWeather();
        this.render();
        break;
      case this.state.ACTION.POOP:
        if (game === this.state.GAME.POOPING) {
          this.dieTime = -1;
          this.hungryTime = Math.floor(Math.random() * 3) + 8 + this.clock;
          this.render(this.state.GAME.CELEBRATING);
        }
        break;
      case this.state.ACTION.FISH:
        if (game === this.state.GAME.HUNGRY) {
          this.dieTime = -1;
          this.poopTime = Math.floor(Math.random() * 3) + 8 + this.clock;
          this.timeToStartCelebrating = this.clock + 2;
          this.render(this.state.GAME.FEEDING);
        }
        break;
    }
  }

  getStartingGameState() {
    if (Math.random() < this.config.RAIN_CHANCE) {
      return this.state.GAME.IDLING_RAIN;
    }
    return this.state.GAME.IDLING;
  }

  clearTimes() {
    this.wakeTime = -1;
    this.sleepTime = -1;
    this.hungryTime = -1;
    this.dieTime = -1;
    this.poopTime = -1;
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = -1;
  }

  tick() {
    this.clock++;

    switch (true) {
      case this.clock === this.wakeTime:
        this.render(this.getStartingGameState());
        this.wakeTime = -1;
        this.sleepTime = this.clock + this.config.DAY_LENGTH;
        this.hungryTime = Math.floor(Math.random() * 3) + 8 + this.clock;
        break;
      case this.clock === this.sleepTime:
        this.render(this.state.GAME.SLEEP);
        this.clearTimes();
        this.wakeTime = this.clock + this.config.NIGHT_LENGTH;
        break;
      case this.clock === this.hungryTime:
        this.render(this.state.GAME.HUNGRY);
        this.dieTime = Math.floor(Math.random() * 3) + 3 + this.clock;
        this.hungryTime = -1;
        break;
      case this.clock === this.timeToStartCelebrating:
        this.render(this.state.GAME.CELEBRATING);
        this.timeToStartCelebrating = -1;
        this.timeToEndCelebrating = this.clock + 2;
        break;
      case this.clock === this.timeToEndCelebrating:
        this.render(this.getStartingGameState());
        this.timeToEndCelebrating = -1;
        break;
      case this.clock === this.poopTime:
        this.render(this.state.GAME.POOPING);
        this.poopTime = -1;
        this.dieTime = Math.floor(Math.random() * 3) + 3 + this.clock;
        break;
      case this.clock === this.dieTime:
        this.render(this.state.GAME.POOPING);
        this.clearTimes();
        break;
    }

    this.renderer.renderDebugInfo({
      clock: this.clock,
      wakeTime: this.wakeTime,
      sleepTime: this.sleepTime,
      hungryTime: this.hungryTime,
      dieTime: this.dieTime,
      poopTime: this.poopTime,
      timeToStartCelebrating: this.timeToStartCelebrating,
      timeToEndCelebrating: this.timeToEndCelebrating,
    });
    return this.clock;
  }
}

export default Game;
