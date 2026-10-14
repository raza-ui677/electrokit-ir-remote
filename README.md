# Electrokit IR Remote v0.3.0

MakeCode extension for the 17-button Electrokit NEC IR remote (numbers at top, arrow keys at bottom).

## Changes in 0.3
- Built-in NEC decoder; no MakerBit dependency.
- NEC repeat frames refresh the held-button timer.
- `onButtonPressed` runs once per press; `isHeld` remains true while repeats arrive.
- `onButtonReleased` estimates release after a configurable timeout (default 300 ms).
- Correct mapping for all 17 keys.

## Usage
```typescript
electrokitIR.connect(DigitalPin.P0)
electrokitIR.onButtonPressed(ElectrokitButton.OK, function () { basic.showIcon(IconNames.Heart) })
basic.forever(function () {
    if (electrokitIR.isHeld(ElectrokitButton.Up)) led.plot(2, 0)
    else led.unplot(2, 0)
    basic.pause(30)
})
```

**Important:** Do not initialize MakerBit's IR decoder on the same pin in the same program. This release is a candidate and has not been compiled/tested on a physical micro:bit. IR release is estimated, not transmitted by the remote.

## License
MIT. Decoder design adapted from the MIT-licensed MakerBit IR Receiver by 1010Technologies.
