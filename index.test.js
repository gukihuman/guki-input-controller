const GukiInputController = require("./index.js")

describe("GukiInputController", () => {
  let gic = new GukiInputController()
  let errorCount = 0
  let i = 0

  beforeEach(() => {
    errorCount = 0
    i = 0
  })

  //
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
})
