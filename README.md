# guki-input-controller

This is a lightweight JavaScript module that provides a simple input controller class for loop-based game development. It supports keyboard, mouse, and gamepad.

_current version: 0.8.0_

## Installation

```
npm install guki-input-controller
```

## Usage

```javascript
import GukiInputController from "guki-input-controller"

const gic = new GukiInputController()

function gameLoop() {
  gic.update()

  if (gic.keyboard.pressed.includes("A")) {
    console.log("Move forward")
  }
  if (gic.keyboard.justPressed.includes("B")) {
    console.log("Switch weapons")
  }
}
```

## Methods

### **update()**

The controller has only one method, which needs to be called in the game loop. Make sure to update the controller before checking for its states.

```javascript
function gameLoop() {
  gic.update()

  // check controller states
}
```

## Properties

### **keyboard.pressed**

### **keyboard.justPressed**

While **pressed** is used for held-down buttons, **justPressed** for one-time taps. Let's say we pressed two buttons. On first iteration we would have this controller state :

```javascript
keyboard.pressed = ["A", "B"]
keyboard.justPressed = ["A", "B"]
```

We can check it to make some actions:

```javascript
if (gic.keyboard.pressed.includes("A")) {
  console.log("Move forward")
  // true, will work
}
if (gic.keyboard.justPressed.includes("B")) {
  console.log("Switch weapons")
  // true, will work
}
```

Even one-tap presses are long enough to take place in a couple of iterations. So on the second iteration both A and B are still pressed. However, switch weapons won`t trigger again, because **justPressed** is empty.

```javascript
keyboard.pressed = ["A", "B"]
keyboard.justPressed = []
```

```javascript
if (gic.keyboard.pressed.includes("A")) {
  ceonsole.log("Move forward")
  e // true, will work again
}
if (gic.keyboard.justPressed.includes("B")) {
  console.log("Switch weapons")
  // false, won`t work
}
```

### **mouse.pressed**

### **mouse.justPressed**

Works similarly to the keyboard, but instead of using strings, it uses integers. These integers are constants that are predefined by the browser's JavaScript environment and are related to specific mouse buttons. In this example, both the left and right buttons have been pressed for the first time.

```javascript
mouse.pressed = [0, 2]
mouse.justPressed = [0, 2]
```

**0** - Left <br>
**1** - Middle <br>
**2** - Right <br>
**3** - Back <br>
**4** - Forward <br>

### **mouse.x**

### **mouse.y**

By default, coordinates are screen-relative.

```javascript
mouse.x = 228
mouse.y = 282
```

However, you can associate the coordinates with a specific DOM object, typically the application's viewport. Unlike offsetX and Y on the typical mouse move event, these coordinates will work **regardless of how many other objects are present on top**, as determined by their z-index. To associate with the viewport, provide it as an argument when instantiating the controller.

```javascript
import GukiInputController from "guki-input-controller"

// Assuming you have a DOM element with the "viewport" id
const viewport = getElementById("viewport")

const gic = new GukiInputController(viewport)

function gameLoop() {
  gic.update()

  console.log(gic.mouse.x + " " + gic.mouse.y)
  // These coordinates are related to the viewport DOM element.
}
```

### **gamepad.pressed**

### **gamepad.justPressed**

Works just as the keyboard, but instead of symbols, it uses specific button names based on the Xbox button map.

```javascript
gamepad.pressed = ["Start", "LB"]
gamepad.justPressed = ["Start", "LB"]
```

### **gamepad.buttonMap**

Default Xbox-based button map:

```javascript
gic.gamepad.buttonMap = [
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
]
```

_If this module becomes more popular, it may be extended to support additional gamepads. However, currently, if you need a different button map, you will need to implement the remapping yourself. You can do this by modifying the **buttonMap** value to match your specific buttons._

### **gamepad.axes**

An array of four floating-point numbers between -1 and 1. The first and second correspond to the **X** and **Y** axes of the left stick, while the third and fourth respectively of the right.

```javascript
gamepad.axes = [0, 1, -0.912, 0.13]
```

```javascript
const speed = 100

function move() {
  // Assuming you have an "entity" variable which is drawn based on its x and y
  entity.x += speed * gic.gamepad.axes[0]
  entity.y += speed * gic.gamepad.axes[1]
}
function gameLoop() {
  gic.update()

  move()
}
```

### **gamepad.connected**

### **gamepad.justConnected**

### **gamepad.justDisconnected**

Works similarly to the **pressed** and **justPressed**, but instead of relying on strings or integers, it uses booleans.

```javascript
gamepad.connected = true
gamepad.justConnected = true
gamepad.justDisconnected = false
```

```javascript
if (gic.gamepad.connected) {
  console.log("Hide cursor")
}
if (gic.gamepad.justConnected) {
  console.log("Show message")
}
```

---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

© 2023 Ivan F. Sokolov
