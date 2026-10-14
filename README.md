# Electrokit IR Remote — diagnostic build 0.3.1

This is a temporary debug build for micro:bit V2, based on v0.3. It counts pulse callbacks, complete NEC frames and recognized repeat frames. **Do not publish this as a stable release.**

MakeCode JavaScript test:

```typescript
electrokitIR.connect(DigitalPin.P0)
basic.forever(function () {
    serial.writeLine("t=" + input.runningTime() + " " + electrokitIR.debugSnapshot())
    basic.pause(500)
})
```

Press and hold UP for 3 seconds. Copy the serial lines before, during and after. `repeat` should increase while held if repeat decoding works. `L` and `H` should increase if pulse callbacks arrive. `longPair` helps detect a mismatched NEC timing threshold.

The diagnostic counters are cumulative and the existing 17-button mappings are unchanged.
