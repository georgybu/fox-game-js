import { SceneStates } from "./states/SceneStates.enum";
import { FoxStates } from "./states/FoxStates.enum";
import { PoopBugStates } from "./states/PoopBugStates.enum";
import { ModalStates } from "./states/ModalStates.enum";
import { ActionStates } from "./states/ActionStates.enum";
import { GameStates } from "./states/GameStates.enum";

class State {
  // Public enums
  // --------------------------------------------------------------------------
  get ACTION() {
    return ActionStates;
  }

  get GAME() {
    return GameStates;
  }

  // Getter/Setter State
  // --------------------------------------------------------------------------
  getState() {
    return this.state;
  }

  setState(obj) {
    this.state = { ...this.state, ...obj };
  }

  resetState() {
    this.state = {
      scene: SceneStates.DAY,
      fox: FoxStates.HIDDEN,
      poopBug: PoopBugStates.HIDDEN,
      modal: ModalStates.START,
      action: ActionStates.NONE,
      game: GameStates.INIT,
    };
  }

  // State Machine
  // --------------------------------------------------------------------------
  setGameState(gameState) {
    this.setState({ game: gameState });

    switch (gameState) {
      case GameStates.INIT:
        this.setState({
          scene: SceneStates.DAY,
          fox: FoxStates.HIDDEN,
          poopBug: PoopBugStates.HIDDEN,
          modal: ModalStates.START,
          action: ActionStates.NONE,
        });
        break;
      case GameStates.HATCHING:
        this.setState({
          scene: SceneStates.DAY,
          fox: FoxStates.EGG,
          modal: ModalStates.HIDDEN,
        });
        break;
      case GameStates.SLEEP:
        this.setState({
          scene: SceneStates.NIGHT,
          fox: FoxStates.SLEEP,
          modal: ModalStates.HIDDEN,
        });
        break;
      case GameStates.HUNGRY:
        this.setState({
          fox: FoxStates.HUNGRY,
        });
        break;
      case GameStates.CELEBRATING:
        this.setState({
          fox: FoxStates.CELEBRATE,
        });
        break;
      case GameStates.IDLING:
        this.setState({
          fox: FoxStates.IDLING,
          poopBug: PoopBugStates.HIDDEN,
          modal: ModalStates.HIDDEN,
        });
        break;
      case GameStates.IDLING_RAIN:
        this.setState({
          scene: SceneStates.RAIN,
          fox: FoxStates.RAIN,
          poopBug: PoopBugStates.HIDDEN,
          modal: ModalStates.HIDDEN,
        });
        break;
      case GameStates.POOPING:
        this.setState({
          fox: FoxStates.POOPING,
          modal: ModalStates.HIDDEN,
        });
        break;
      case GameStates.CLEAN_UP:
        this.setState({
          scene: SceneStates.DAY,
          fox: FoxStates.IDLING,
          poopBug: PoopBugStates.SHOWN,
          modal: ModalStates.HIDDEN,
        });
        break;
      case GameStates.FEEDING:
        this.setState({
          fox: FoxStates.EATING,
          modal: ModalStates.HIDDEN,
        });
        break;
      case GameStates.DEAD:
        this.setState({
          scene: SceneStates.DEAD,
          fox: FoxStates.DEAD,
          modal: ModalStates.DEAD,
        });
        break;
    }
  }

  // Action Management
  // --------------------------------------------------------------------------
  setNextAction() {
    const next = {
      [ActionStates.FISH]: ActionStates.POOP,
      [ActionStates.POOP]: ActionStates.WEATHER,
      [ActionStates.WEATHER]: ActionStates.FISH,
    };
    this.setState({ action: next[this.state.action] || ActionStates.FISH });
  }

  setPrevAction() {
    const prev = {
      [ActionStates.FISH]: ActionStates.WEATHER,
      [ActionStates.WEATHER]: ActionStates.POOP,
      [ActionStates.POOP]: ActionStates.FISH,
    };
    this.setState({ action: prev[this.state.action] || ActionStates.WEATHER });
  }

  // Weather Management
  // --------------------------------------------------------------------------
  changeWeather() {
    if (this.state.scene === SceneStates.RAIN) {
      this.setState({
        scene: SceneStates.DAY,
        fox: FoxStates.IDLING,
      });
    } else {
      this.setState({
        scene: SceneStates.RAIN,
        fox: FoxStates.RAIN,
      });
    }
  }
}

export default State;
