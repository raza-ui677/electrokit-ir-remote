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
    let handlers: ButtonHandler[] = []

    class ButtonHandler {
        button: ElectrokitButton
        callback: () => void
        constructor(button: ElectrokitButton, callback: () => void) {
            this.button = button
            this.callback = callback
        }
    }

    /** Connect the IR receiver. Use the same signal pin as before. */
    //% blockId=electrokit_ir_connect block="connect Electrokit IR receiver to pin %pin"
    //% pin.defl=DigitalPin.P0
    //% weight=100
    export function connect(pin: DigitalPin): void {
        if (started) return
        started = true
        makerbit.connectIrReceiver(pin, IrProtocol.NEC)
        makerbit.onIrDatagram(function () {
            const code = makerbit.irButton()
            lastCode = code
            for (let i = 0; i < handlers.length; i++) {
                const h = handlers[i]
                if (h.button === ElectrokitButton.Any || h.button === code) {
                    h.callback()
                }
            }
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
        return makerbit.irDatagram()
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
