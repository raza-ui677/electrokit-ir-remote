/** Buttons on the 17-key Electrokit IR remote (number pad above arrows). */
//% blockNamespace=electrokitIR
const enum ElectrokitButton {
    //% block="any"
    Any = -1,
    //% block="1"
    One = 0xA2,
    //% block="2"
    Two = 0x62,
    //% block="3"
    Three = 0xE2,
    //% block="4"
    Four = 0x22,
    //% block="5"
    Five = 0x02,
    //% block="6"
    Six = 0xC2,
    //% block="7"
    Seven = 0xE0,
    //% block="8"
    Eight = 0xA8,
    //% block="9"
    Nine = 0x90,
    //% block="*"
    Star = 0x68,
    //% block="0"
    Zero = 0x98,
    //% block="#"
    Hash = 0xB0,
    //% block="up"
    Up = 0x18,
    //% block="left"
    Left = 0x10,
    //% block="OK"
    OK = 0x38,
    //% block="right"
    Right = 0x5A,
    //% block="down"
    Down = 0x4A
}

//% color=#008B9A icon="\uf1eb" block="Electrokit IR"
namespace electrokitIR {
    let started = false
    let lastCode = -1
    let activeCode = -1
    let lastSeen = 0
    let releaseDelay = 300
    let handlers: ButtonHandler[] = []
    let releaseHandlers: ButtonHandler[] = []
    let bitsReceived = 0
    let addressBits = 0
    let commandBits = 0
    let pulseMark = 0
    let rawFrame = "0x00000000"
    class ButtonHandler {
        button: ElectrokitButton
        callback: () => void
        constructor(button: ElectrokitButton, callback: () => void) {
            this.button = button
            this.callback = callback
        }
    }
    function releaseActive(): void {
        if (activeCode < 0) return
        const old = activeCode
        activeCode = -1
        for (let i = 0; i < releaseHandlers.length; i++) {
            const h = releaseHandlers[i]
            if (h.button === ElectrokitButton.Any || h.button === old) {
                control.inBackground(h.callback)
            }
        }
    }
    function onCompleteFrame(): void {
        const command = (commandBits >> 8) & 0xff
        const inverse = commandBits & 0xff
        if ((command ^ inverse) !== 0xff) return
        rawFrame = "0x" + toHex16(addressBits) + toHex16(commandBits)
        lastCode = command
        lastSeen = input.runningTime()
        if (activeCode !== command) {
            releaseActive()
            activeCode = command
            for (let i = 0; i < handlers.length; i++) {
                const h = handlers[i]
                if (h.button === ElectrokitButton.Any || h.button === command) {
                    control.inBackground(h.callback)
                }
            }
        }
    }
    function toHex16(n: number): string {
        let result = ""
        for (let i = 0; i < 4; i++) {
            const digit = n & 15
            result = "0123456789ABCDEF".charAt(digit) + result
            n = n >> 4
        }
        return result
    }
    function decodePulse(duration: number): void {
        if (duration < 1600) {
            appendBit(0)
        } else if (duration < 2700) {
            appendBit(1)
        } else {
            bitsReceived = 0
            if (duration >= 9500 && duration < 12500) {
                // NEC repeat leader: 9 ms mark + 2.25 ms space.
                if (activeCode >= 0) lastSeen = input.runningTime()
            }
            // 13.5 ms is the start of a full NEC frame.
        }
    }
    function appendBit(bit: number): void {
        bitsReceived++
        if (bitsReceived <= 16) {
            addressBits = ((addressBits << 1) | bit) & 0xffff
        } else if (bitsReceived <= 32) {
            commandBits = ((commandBits << 1) | bit) & 0xffff
        }
        if (bitsReceived === 32) {
            bitsReceived = 0
            onCompleteFrame()
        }
    }
    /** Connect the NEC IR receiver. Do not connect another IR decoder to the same pin. */
    //% blockId=electrokit_ir_connect block="connect Electrokit IR receiver to pin %pin"
    //% pin.defl=DigitalPin.P0
    //% weight=100
    export function connect(pin: DigitalPin): void {
        if (started) return
        started = true
        pins.setPull(pin, PinPullMode.PullNone)
        pins.onPulsed(pin, PulseValue.Low, function () {
            pulseMark = pins.pulseDuration()
        })
        pins.onPulsed(pin, PulseValue.High, function () {
            const space = pins.pulseDuration()
            decodePulse(pulseMark + space)
        })
        basic.forever(function () {
            if (activeCode >= 0 && input.runningTime() - lastSeen > releaseDelay) {
                releaseActive()
            }
            basic.pause(25)
        })
    }
    /** Run when a remote button is pressed. */
    //% blockId=electrokit_ir_on_button block="on Electrokit button %button pressed"
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% weight=90
    export function onButtonPressed(button: ElectrokitButton, callback: () => void): void {
        handlers.push(new ButtonHandler(button, callback))
    }

    /** Most recently received button command (-1 before first reception). */
    //% blockId=electrokit_ir_last_button block="last Electrokit button code"
    //% weight=85
    export function lastButton(): number {
        return lastCode
    }

    /** True while a button is considered held (based on recent IR frames). */
    //% blockId=electrokit_ir_is_held block="Electrokit button %button is held"
    //% weight=80
    export function isHeld(button: ElectrokitButton): boolean {
        if (activeCode < 0 || input.runningTime() - lastSeen > releaseDelay) return false
        return button === ElectrokitButton.Any || activeCode === button
    }

    /** Fires when no IR frame has arrived for the release timeout. This is an estimated release, not a physical release signal. */
    //% blockId=electrokit_ir_on_released block="on Electrokit button %button released (estimated)"
    //% weight=75
    export function onButtonReleased(button: ElectrokitButton, callback: () => void): void {
        releaseHandlers.push(new ButtonHandler(button, callback))
    }

    /** Release timeout in milliseconds (100..1000). */
    //% blockId=electrokit_ir_timeout block="set IR release timeout to %ms ms"
    //% ms.min=100 ms.max=1000 ms.defl=300
    //% weight=65
    export function setReleaseTimeout(ms: number): void {
        releaseDelay = Math.max(100, Math.min(1000, ms))
    }

    /** Returns the most recent NEC command, or -1 before receiving one. */
    //% blockId=electrokit_ir_last_command block="last Electrokit IR command"
    //% weight=70
    export function lastCommand(): number {
        return lastCode
    }

    /** Returns the 32-bit NEC frame as a hexadecimal string. */
    //% blockId=electrokit_ir_raw_code block="last Electrokit IR hex code"
    //% weight=60
    export function rawCode(): string {
        return rawFrame
    }

    /** Returns the NEC command for a selected physical button. */
    //% blockId=electrokit_ir_button_code block="Electrokit button %button command"
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% weight=50
    export function buttonCode(button: ElectrokitButton): number {
        return button as number
    }
}
