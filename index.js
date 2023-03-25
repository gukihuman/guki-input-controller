const { cloneDeep, remove } = require("./lib.js")

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
      _previouslyPressed: [],
      pressed: [],
      justPressed: [],
      axes: [0, 0, 0, 0],
    }
    addEventListener("keydown", (event) => {
      this.keyboard._buttonsToAdd.push(event.key)
    })
    addEventListener("keyup", (event) => {
      this.keyboard._buttonsToRemove.push(event.key)
    })

    addEventListener("mousemove", (event) => {
      this.mouse.x = event.offsetX
      this.mouse.y = event.offsetY
    })
    addEventListener("mousedown", (event) => {
      this.mouse._buttonsToAdd.push(event.button)
    })
    addEventListener("mouseup", (event) => {
      this.mouse._buttonsToRemove.push(event.button)
    })
  }

  _processInputDevice(inputDevice) {
    inputDevice._previouslyPressed = cloneDeep(inputDevice.pressed)
    inputDevice._buttonsToAdd.forEach((buttonToAdd) => {
      if (!inputDevice.pressed.includes(buttonToAdd)) {
        inputDevice.pressed.push(buttonToAdd)
      }
    })
    let delayRemove = []
    inputDevice._buttonsToRemove.forEach((buttonToRemove) => {
      if (!inputDevice._buttonsToAdd.includes(buttonToRemove)) {
        remove(inputDevice.pressed, (button) => button === buttonToRemove)
      } else {
        delayRemove.push(buttonToRemove)
      }
    })
    inputDevice.justPressed = inputDevice.pressed.filter(
      (button) => !inputDevice._previouslyPressed.includes(button)
    )
    inputDevice._buttonsToAdd = []
    inputDevice._buttonsToRemove = []
    delayRemove.forEach((button) => inputDevice._buttonsToRemove.push(button))
  }
  update() {
    this._processInputDevice(this.keyboard)
    this._processInputDevice(this.mouse)
  }
}

module.exports = GukiInputController
