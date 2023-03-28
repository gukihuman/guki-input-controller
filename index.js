import { cloneDeep, remove } from "./lib.js"

export default class GukiInputController {
  constructor(viewport = "default") {
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
      buttonMap: [
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
    if (viewport === "default") {
      addEventListener("mousemove", (event) => {
        this.mouse.x = event.clientX
        this.mouse.y = event.clientY
      })
    } else {
      addEventListener("mousemove", (event) => {
        this.mouse.x = event.clientX - viewport.getBoundingClientRect().left
        this.mouse.y = event.clientY - viewport.getBoundingClientRect().top
        if (this.mouse.x < 0) this.mouse.x = 0
        if (this.mouse.y < 0) this.mouse.y = 0
        if (this.mouse.x > viewport.getBoundingClientRect().width) {
          this.mouse.x = viewport.getBoundingClientRect().width
        }
        if (this.mouse.y > viewport.getBoundingClientRect().height) {
          this.mouse.y = viewport.getBoundingClientRect().height
        }
        this.mouse.x = Math.floor(this.mouse.x)
        this.mouse.y = Math.floor(this.mouse.y)
      })
    }
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
          const buttonName = this.gamepad.buttonMap[i]
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
