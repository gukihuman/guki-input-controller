import { cloneDeep, remove } from "./lib.js"

export default class GukiInputController {
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
      _previouslyPressed: [],
      pressed: [],
      justPressed: [],

      _previouslyConnected: false,
      connected: false,
      justConnected: false,
      justDisconnected: false,

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
    addEventListener("gamepadconnected", (event) => {
      this.gamepad.connected = true
    })
    addEventListener("gamepaddisconnected", (event) => {
      this.gamepad.connected = false
    })
  }
  // Keyboard and mouse
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
  _processGamepad() {
    const gamepads = navigator.getGamepads()
    if (gamepads[0]) {
      const buttons = gamepads[0].buttons
      this.gamepad._previouslyPressed = cloneDeep(this.gamepad.pressed)
      this.gamepad.pressed = []
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].pressed) {
          const buttonName = this.gamepad.buttonList[i]
          this.gamepad.pressed.push(buttonName)
        }
      }
      this.gamepad.justPressed = this.gamepad.pressed.filter(
        (button) => !this.gamepad._previouslyPressed.includes(button)
      )
      this.gamepad.axes = gamepads[0].axes
    }
  }
  _processGamepadConnect() {
    if (this.gamepad.connected && !this.gamepad._previouslyConnected) {
      this.gamepad.justConnected = true
    } else {
      this.gamepad.justConnected = false
    }
    if (!this.gamepad.connected && this.gamepad._previouslyConnected) {
      this.gamepad.justDisconnected = true
    } else {
      this.gamepad.justDisconnected = false
    }
    this.gamepad._previouslyConnected = this.gamepad.connected
  }
  update() {
    this._processInputDevice(this.keyboard)
    this._processInputDevice(this.mouse)
    if (this.gamepad.connected) {
      this._processGamepad()
    }
    this._processGamepadConnect()
  }
}
