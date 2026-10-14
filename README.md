# Electrokit IR Remote for micro:bit

MakeCode extension for the **17-key Electrokit infrared remote** with the numeric keypad at the top and arrow pad at the bottom. Tested IR command mapping supplied by the remote owner; extension itself still needs testing on physical hardware.

Uses the NEC decoder from [MakerBit IR Receiver](https://github.com/1010Technologies/pxt-makerbit-ir-receiver), licensed under MIT. This extension adds its own correct button mapping and MakeCode blocks.

## Setup

Connect the receiver's signal output to micro:bit P0 (or your selected pin), VCC and GND as required by the receiver board. In MakeCode, use **connect Electrokit IR receiver to pin P0** inside `on start`, then add **on Electrokit button [OK] pressed** events. Do not separately connect the MakerBit receiver or install another IR decoder in the same project.

## NEC command map

| Key | Command |
|---|---|
| 1 | A2 |
| 2 | 62 |
| 3 | E2 |
| 4 | 22 |
| 5 | 02 |
| 6 | C2 |
| 7 | E0 |
| 8 | A8 |
| 9 | 90 |
| * | 68 |
| 0 | 98 |
| # | B0 |
| Up | 18 |
| Left | 10 |
| OK | 38 |
| Right | 5A |
| Down | 4A |

## Limitations

This first version triggers on full IR datagrams. It does not yet implement key-repeat or release events. The underlying MakerBit extension is a dependency. Hardware verification and MakeCode compilation are still pending.
