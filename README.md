# Electrokit IR Remote v0.3.2 (test build)

17-button NEC remote for micro:bit V2.

This update improves held-state recovery and adds `active`, `last`, `age`, `fullAge`, `repeatAge`, and `restored` to `debugSnapshot()`.

## Test

```typescript
electrokitIR.connect(DigitalPin.P0)
electrokitIR.setReleaseTimeout(350)
basic.forever(function () {
    led.toggle(0, 0) // heartbeat: program is running
    if (electrokitIR.isHeld(ElectrokitButton.Up)) {
        led.plot(2, 0)
    } else {
        led.unplot(2, 0)
    }
    serial.writeLine(electrokitIR.debugSnapshot())
    basic.pause(200)
})
```

Hold Up for 3 seconds. `repeat` should rise, `age` should stay under ~350 ms, and `active=24` should persist. If not, share 8-12 console lines.

Note: NEC has no physical release message. A release is inferred from missing repeats. This version is not hardware-validated; do not use for safety-critical motor stop.
