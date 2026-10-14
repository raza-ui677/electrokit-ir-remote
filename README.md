# Electrokit IR Remote for micro:bit

MakeCode extension for a 17-button NEC infrared remote control, compatible with BBC micro:bit V2.

![Electrokit IR Remote](remote.jpg)

This extension provides correct button mapping for the 17-button IR remote with numeric buttons at the top and directional buttons at the bottom.

**Features**
- All 17 buttons supported
- Button press detection
- Last received button
- Button hold detection
- Button release detection
- Compatible with Microsoft MakeCode for micro:bit
 
# Electrokit IR Remote v0.2

For BBC micro:bit V2 and the 17-key Electrokit NEC remote with number keys at top. Depends on MakerBit IR Receiver.

## New in v0.2
- `lastButton()` returns the NEC command byte (number), e.g. OK = 0x38 = 56.
- `isHeld(button)` returns true while IR datagrams continue arriving within the timeout.
- `onButtonReleased(button, callback)` fires after no datagram has been seen for the timeout.
- `setReleaseTimeout(ms)` sets timeout from 100 to 1000 ms (default 300).

**Important:** NEC IR has no dedicated button-release frame. Held/released are inferred from received datagrams. Some remotes and MakerBit decoding do not forward repeat frames; in that case a long press may be interpreted as release after 300 ms. Test this before controlling motors.

## Installation
Upload these files to the root of your existing GitHub repository (replace main.ts, pxt.json and README.md). In MakeCode refresh/update the extension or open a new project and add the repository URL.

## Example
```typescript
electrokitIR.connect(DigitalPin.P0)
electrokitIR.onButtonPressed(ElectrokitButton.OK, function () {
    basic.showIcon(IconNames.Heart)
})
electrokitIR.onButtonReleased(ElectrokitButton.OK, function () {
    basic.clearScreen()
})
```

This is a community prototype, not officially associated with Electrokit.
