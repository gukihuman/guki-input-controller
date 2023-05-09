import GukiInputController from "./index.js"

describe("GukiInputController", () => {
  let gic
  let errorCount = 0
  let i = 0

  beforeEach(() => {
    gic = new GukiInputController()
    gic.init()
    errorCount = 0
    i = 0
  })
  test("Keyboard", (done) => {
    const keydownEvents = {
      123: "A",
      187: "B",
    }
    const keyupEvents = {
      125: "A",
      261: "B",
    }
    let mainTestLoop = setInterval(() => {
      // run gic.update() every 30 iterations
      if (i % 30 === 0) {
        gic.update()
      }
      // imitate button presses
      if (keydownEvents[i]) {
        const button = keydownEvents[i]
        const event = new KeyboardEvent("keydown", { key: button })
        window.dispatchEvent(event)
      }
      if (keyupEvents[i]) {
        const button = keyupEvents[i]
        const event = new KeyboardEvent("keyup", { key: button })
        window.dispatchEvent(event)
      }
      if (i === 150) {
        if (
          gic.keyboard.justPressed.includes("A") &&
          gic.keyboard.pressed.includes("A")
        ) {
          console.log("Button A pressed correctly")
        } else {
          console.log("Button A not pressed correctly")
          errorCount++
        }
      }
      if (i === 180) {
        if (
          gic.keyboard.justPressed.length === 0 &&
          gic.keyboard.pressed.length === 0
        ) {
          console.log("Keyboard arrays are empty")
        } else {
          console.log("Keyboard arrays not empty")
          errorCount++
        }
      }
      if (i === 210) {
        if (
          gic.keyboard.justPressed.includes("B") &&
          gic.keyboard.pressed.includes("B")
        ) {
          console.log("Button B pressed correctly")
        } else {
          console.log("Button B not pressed correctly")
          errorCount++
        }
      }
      if (i === 240) {
        if (
          gic.keyboard.justPressed.length === 0 &&
          gic.keyboard.pressed.includes("B")
        ) {
          console.log("Button B held correctly")
        } else {
          console.log("Button B not held correctly")
          errorCount++
        }
      }
      if (i === 250) {
        if (gic.lastActiveDevice === "keyboard") {
          console.log("Last active device is keyboard")
        } else {
          console.log("Last active device is not keyboard")
          errorCount++
        }
      }
      if (i === 270) {
        if (
          gic.keyboard.justPressed.length === 0 &&
          gic.keyboard.pressed.length === 0
        ) {
          console.log("Keyboard arrays are empty")
        } else {
          console.log("Keyboard arrays not empty")
          errorCount++
        }
        clearInterval(mainTestLoop)
        expect(errorCount).toBe(0)
        done()
      }

      i++
    }, 1000 / 300) // test run for 1 second
  })
  test("Mouse", (done) => {
    const mouseDownEvents = {
      123: 0, // left button down
      187: 2, // right button down
    }
    const mouseUpEvents = {
      125: 0, // left button up
      261: 2, // right button up
    }
    const mouseMoveEvents = {
      5: { clientX: 50, clientY: 50 },
      45: { clientX: 500, clientY: 500 },
    }
    let mainTestLoop = setInterval(() => {
      // run gic.update() every 30 iterations
      if (i % 30 === 0) {
        gic.update()
      }
      // imitate button presses
      if (mouseDownEvents[i] !== undefined) {
        const button = mouseDownEvents[i]
        const event = new MouseEvent("mousedown", { button })
        window.dispatchEvent(event)
      }
      if (mouseUpEvents[i] !== undefined) {
        const button = mouseUpEvents[i]
        const event = new MouseEvent("mouseup", { button })
        window.dispatchEvent(event)
      }
      if (mouseMoveEvents[i]) {
        const { clientX, clientY } = mouseMoveEvents[i]
        const event = new MouseEvent("mousemove", { clientX, clientY })
        window.dispatchEvent(event)
      }
      if (i === 30) {
        if (gic.mouse.x === 50 && gic.mouse.y === 50) {
          console.log("x and y coordinates updated correctly")
        } else {
          console.log("x and y coordinates not updated correctly")
          errorCount++
        }
      }
      if (i === 60) {
        if (gic.mouse.x === 500 && gic.mouse.y === 500) {
          console.log("x and y coordinates updated correctly")
        } else {
          console.log("x and y coordinates not updated correctly")
          errorCount++
        }
      }
      if (i === 150) {
        if (
          gic.mouse.justPressed.includes(0) &&
          gic.mouse.pressed.includes(0)
        ) {
          console.log("Left button pressed correctly")
        } else {
          console.log("Left button not pressed correctly")
          errorCount++
        }
      }
      if (i === 180) {
        if (
          gic.mouse.justPressed.length === 0 &&
          gic.mouse.pressed.length === 0
        ) {
          console.log("Mouse arrays are empty")
        } else {
          console.log("Mouse arrays not empty")
          errorCount++
        }
      }
      if (i === 210) {
        if (
          gic.mouse.justPressed.includes(2) &&
          gic.mouse.pressed.includes(2)
        ) {
          console.log("Right button pressed correctly")
        } else {
          console.log("Right button not pressed correctly")
          errorCount++
        }
      }
      if (i === 240) {
        if (
          gic.mouse.justPressed.length === 0 &&
          gic.mouse.pressed.includes(2)
        ) {
          console.log("Right button held correctly")
        } else {
          console.log("Right button not held correctly")
          errorCount++
        }
        if (gic.mouse.x === 500 && gic.mouse.y === 500) {
          console.log("x and y coordinates kept correctly")
        } else {
          console.log("x and y coordinates not kept correctly")
          errorCount++
        }
      }
      if (i === 250) {
        if (gic.lastActiveDevice === "mouse") {
          console.log("Last active device is mouse")
        } else {
          console.log("Last active device is not mouse")
          errorCount++
        }
      }
      if (i === 270) {
        if (
          gic.mouse.justPressed.length === 0 &&
          gic.mouse.pressed.length === 0
        ) {
          console.log("Mouse arrays are empty")
        } else {
          console.log("Mouse arrays not empty")
          errorCount++
        }
        clearInterval(mainTestLoop)
        expect(errorCount).toBe(0)
        done()
      }

      i++
    }, 1000 / 300) // test run for 1 second
  })
  test("Gamepad", (done) => {
    // create a mock gamepad
    const gamepad = {
      // A and B buttons
      buttons: [{ pressed: false }, { pressed: false }],
      axes: [0, 0.5, -0.5, 0],
    }
    gic.gamepad.connected = true
    // mock the getGamepads function to return the mock gamepad
    window.navigator.getGamepads = () => [gamepad]

    let mainTestLoop = setInterval(() => {
      // run gic.update() every 30 iterations
      if (i % 30 === 0) {
        gic.update()
      }

      if (i === 30) {
        if (
          gic.gamepad.axes[0] === 0 &&
          gic.gamepad.axes[1] === 0.5 &&
          gic.gamepad.axes[2] === -0.5 &&
          gic.gamepad.axes[3] === 0
        ) {
          console.log("Gamepad axes updated correctly")
        } else {
          console.log("Gamepad axes not updated correctly")
          errorCount++
        }
      }
      if (i === 43) {
        gamepad.axes = [0, 0.3, -0.5, 0]
      }
      if (i === 60) {
        if (gic.gamepad.axes[1] === 0.3) {
          console.log("Gamepad axes updated correctly")
        } else {
          console.log("Gamepad axes not updated correctly")
          errorCount++
        }
      }
      if (i === 123) {
        gamepad.buttons = [{ pressed: true }, { pressed: false }]
      }
      if (i === 150) {
        if (
          gic.gamepad.justPressed.includes("A") &&
          gic.gamepad.pressed.includes("A")
        ) {
          console.log("Button A pressed correctly")
        } else {
          console.log("Button A not pressed correctly")
          errorCount++
        }
      }
      if (i === 173) {
        gamepad.buttons = [{ pressed: false }, { pressed: false }]
      }
      if (i === 180) {
        if (
          gic.gamepad.justPressed.length === 0 &&
          gic.gamepad.pressed.length === 0
        ) {
          console.log("Gamepad buttons arrays are empty")
        } else {
          console.log("Gamepad buttons arrays not empty")
          errorCount++
        }
      }
      if (i === 193) {
        gamepad.buttons = [{ pressed: false }, { pressed: true }]
      }
      if (i === 210) {
        if (
          gic.gamepad.justPressed.includes("B") &&
          gic.gamepad.pressed.includes("B")
        ) {
          console.log("Button B pressed correctly")
        } else {
          console.log("Button B not pressed correctly")
          errorCount++
        }
      }
      if (i === 240) {
        if (
          gic.gamepad.justPressed.length === 0 &&
          gic.gamepad.pressed.includes("B")
        ) {
          console.log("Button B held correctly")
        } else {
          console.log("Button B not held correctly")
          errorCount++
        }
      }
      if (i === 250) {
        if (gic.lastActiveDevice === "gamepad") {
          console.log("Last active device is gamepad")
        } else {
          console.log("Last active device is not gamepad")
          errorCount++
        }
      }
      if (i === 253) {
        gamepad.buttons = [{ pressed: false }, { pressed: false }]
      }
      if (i === 270) {
        if (
          gic.gamepad.justPressed.length === 0 &&
          gic.gamepad.pressed.length === 0
        ) {
          console.log("Gamepad buttons arrays are empty")
        } else {
          console.log("Gamepad buttons arrays not empty")
          errorCount++
        }
        clearInterval(mainTestLoop)
        expect(errorCount).toBe(0)
        done()
      }

      i++
    }, 1000 / 300) // test run for 1 second
  })
})
