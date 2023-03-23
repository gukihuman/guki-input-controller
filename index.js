const { debounce, cloneDeep, remove } = require("./lib.js")

class GukiInputController {
  constructor() {
    this.keyboard = {
      _buttonsToAdd: [],
      _buttonsToRemove: [],
      _previouslyPressed: [],
      pressed: [],
      justPressed: [],
    }
    this.mouse = {
      _buttonsToAdd: [],
      _buttonsToRemove: [],
      _previouslyPressed: [],
      pressed: [],
      justPressed: [],
      x: 0,
      y: 0,
    }
    this.gamepad = {
      buttonList: [
        "A",
        "B",
        "X",
        "Y",
        "LB",
        "RB",
        "LT",
        "RT",
        "Start",
        "Menu",
        "LS",
        "RS",
        "Up",
        "Down",
        "Left",
        "Right",
      ],
      connected: false,
      pressed: [],
      _previouslyPressed: [],
      axes: [0, 0, 0, 0],
      axesActive: false,
    }

    const debouncedClearBoard = debounce(
      () => (this.keyboard.pressed = []),
      500
    )

    addEventListener("keydown", (event) => {
      this.keyboard._buttonsToAdd.push(event.key)

      // in case keyup listener won't register a keyup event (happens rarely)
      debouncedClearBoard()
    })
    addEventListener("keyup", (event) => {
      this.keyboard._buttonsToRemove.push(event.key)
    })
  }
  update() {
    // Keyboard
    this.keyboard._previouslyPressed = cloneDeep(this.keyboard.pressed)
    this.keyboard._buttonsToAdd.forEach((buttonToAdd) => {
      if (!this.keyboard.pressed.includes(buttonToAdd)) {
        this.keyboard.pressed.push(buttonToAdd)
      }
      remove(this.keyboard._buttonsToAdd, (button) => button === buttonToAdd)
    })
    this.keyboard._buttonsToRemove.forEach((buttonToRemove) => {
      remove(this.keyboard.pressed, (button) => button === buttonToRemove)
      remove(
        this.keyboard._buttonsToRemove,
        (button) => button === buttonToRemove
      )
    })
    this.keyboard.justPressed = this.keyboard.pressed.filter(
      (button) => !this.keyboard._previouslyPressed.includes(button)
    )
  }
}

module.exports = GukiInputController
