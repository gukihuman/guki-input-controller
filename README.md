# guki-input-controller

This is a lightweight JavaScript module that provides a simple input controller class for loop-based game development. It supports keyboard, mouse, and gamepad.

_current version: 0.8.3_

## Overview

### Methods

#### **initialize(** _viewport = "default"_ **)**

This function sets up the controller. It has to be called once before a game loop. The **_viewport_** argument chooses the DOM element for mouse coordinates. The default **_viewport_** makes them screen-relative.

#### **update()**

This function has to be called in the game loop.

### Properties

#### **keyboard.pressed**

An array of strings that contains the keyboard buttons currently pressed.

#### **keyboard.justPressed**

An array of strings that contains the keyboard buttons that have just been pressed in the current iteration.

#### **mouse.pressed**

An array of integers that represent the mouse buttons currently pressed.

#### **mouse.justPressed**

An array of integers that represent the mouse buttons that have just been pressed in the current iteration.

#### **mouse.x**

A number that represents the x-coordinate of the mouse cursor on the screen or on a viewport, which is a specific DOM element that shows part of the document.

#### **mouse.y:**

Same as **mouse.x** but for y-coordinate.

#### **gamepad.pressed**

An array of strings that contains the gamepad buttons currently pressed.

#### **gamepad.justPressed**

An array of strings that contains the gamepad buttons that have just been pressed in the current iteration.

#### **gamepad.buttonMap**

An array of strings that contains the names of the gamepad buttons based on the Xbox button map. It can be modified to support different gamepads.

#### **gamepad.axes**

An array of four numbers between **-1** and **1** that represent the **x** and **y** axes of the left and right sticks of the gamepad.

#### **gamepad.connected**

A boolean that indicates whether a gamepad is connected or not.

#### **gamepad.justConnected**

A boolean that indicates whether a gamepad has just been connected in the current iteration or not.

#### **gamepad.justDisconnected**

A boolean that indicates whether a gamepad has just been disconnected in the current iteration or not.

## Installation

```
npm install guki-input-controller
```

## Usage

```javascript
import GukiInputController from "guki-input-controller"

const gic = new GukiInputController()

gic.initialize()

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

### **initialize(** _viewport = "default"_ **)**

This function has to be called once before a game loop is started. The **_viewport_** argument specifies the DOM element for mouse **x** and **y** coordinates _(a code example with them can be found further down in this document)_. The default **_viewport_** makes the mouse coordinates relative to the screen. Some **addEventListener** methods are added behind the scenes to update the controller states, so **initialize()** has to be called within the global scope with the **window** object.

```javascript
const gic = new GukiInputController()

// The window object has to exist in some parent scope
gic.initialize()

function gameLoop() {
  gic.update()

  // check controller states
}
```

### **update()**

This function has to be called in the game loop before the controller states are checked, as shown in the previous example.

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

By default, coordinates are screen-relative. However, you can associate them with a specific DOM object, usually the application's viewport. Unlike **offsetX** and **offsetY** on a **MouseEvent**, these coordinates will work **regardless of how many other objects are present on top** by their z-index. To associate coordinates with the viewport, provide it as an argument to **initialize()** method.

```javascript
mouse.x = 228
mouse.y = 282
```

```javascript
import GukiInputController from "guki-input-controller"

const gic = new GukiInputController()

// Assuming you have a DOM element with the "viewport" id
const viewport = getElementById("viewport")

gic.initialize(viewport)

function gameLoop() {
  gic.update()

  console.log(gic.mouse.x + " " + gic.mouse.y)
  // These coordinates are going to be relative to the viewport DOM element
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

_If this module becomes more popular, it may be extended to support additional gamepads. However, currently, if you need a different button map, you will need to implement the remapping yourself. You can do this by modifying the **buttonMap** value to match your specific buttons. Doesn`t matter when it is changed, before or after the initialization._

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
