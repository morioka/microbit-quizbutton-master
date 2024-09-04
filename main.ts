radio.onReceivedNumber(function (receivedNumber) {
    司会者_解答ボタン受付(receivedNumber)
    解答者_指示受付(receivedNumber)
})
function 初期設定 () {
    if (動作モード.includes("初期設定")) {
        radio.setGroup(1)
        radio.setTransmitPower(7)
        機器番号 = randint(0, 4)
        初期設定_表示()
    }
}
function 司会者_解答者順を確認 () {
    if (動作モード.includes("司会者")) {
        if (解答待ち配列.length > 0) {
            配列インデックス = 0
            while (配列インデックス <= 解答待ち配列.length - 1) {
                basic.showNumber(解答待ち配列[配列インデックス])
                basic.pause(500)
                配列インデックス += 1
            }
            music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        }
        機器番号_表示()
    }
}
input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    司会者_次の解答者へ()
})
function 初期設定_確定 () {
    if (動作モード.includes("初期設定")) {
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Double)), music.PlaybackMode.InBackground)
        if (機器番号 == 0) {
            動作モード = "司会者"
            serial.redirect(
            SerialPin.USB_TX,
            SerialPin.USB_RX,
            BaudRate.BaudRate115200
            )
            司会者_初期設定()
        } else {
            動作モード = "解答者"
        }
    }
    機器番号_表示()
}
input.onButtonPressed(Button.A, function () {
    解答者_解答ボタン押下()
    司会者_不正解通知()
    初期設定_機器番号down()
})
function 司会者_不正解通知 () {
    if (動作モード.includes("司会者")) {
        if (解答者ID > 0) {
            // 解答者に「不正解」を通知する
            子機への指示 = 指示_不正解通知
            機器へ指示を送信(解答者ID, 子機への指示)
            serial.writeNumbers([解答者ID, 子機への指示])
            basic.showIcon(IconNames.No)
            音_ブブー()
        }
    }
}
function 機器へ指示を送信 (機器番号: number, 指示: number) {
    radio.sendNumber(機器番号 + 指示 * 100)
}
function 機器番号_表示 () {
    if (機器番号 == 0) {
        basic.showString("M")
    } else {
        basic.showNumber(機器番号)
    }
}
function 音_ブブー () {
    music.play(music.tonePlayable(131, music.beat(BeatFraction.Half)), music.PlaybackMode.UntilDone)
    basic.pause(100)
    music.play(music.tonePlayable(131, music.beat(BeatFraction.Whole)), music.PlaybackMode.InBackground)
}
function 司会者_初期設定 () {
    if (動作モード.includes("司会者")) {
        解答者ID = 0
        受信した子機ID = 0
        子機への指示 = 0
        解答待ち配列 = []
        解答済配列 = []
        機器番号_表示()
        serial.writeNumbers([0, 0])
    }
}
function 解答者_指示受付 (receivedNumber2: number) {
    if (動作モード.includes("解答者")) {
        受信した子機ID = receivedNumber2 % 100
        受信した指示 = Math.idiv(receivedNumber2, 100)
        // 自分が指定されていれば、解答権を得た
        if (受信した子機ID == 機器番号) {
            if (受信した指示 == 指示_解答権通知) {
                basic.showIcon(IconNames.Heart)
                音_ピンポン()
            } else if (受信した指示 == 指示_正解通知) {
                basic.showIcon(IconNames.Yes)
                音_ピンポン()
            } else if (受信した指示 == 指示_不正解通知) {
                basic.showIcon(IconNames.No)
                音_ブブー()
            } else {
                // 未定義。テスト用
                basic.showIcon(IconNames.Happy)
                basic.pause(2000)
                basic.showNumber(機器番号)
            }
        } else {
            // 指示_場のクリア
            basic.showNumber(機器番号)
        }
    }
}
function 音_ピンポン () {
    music.play(music.tonePlayable(659, music.beat(BeatFraction.Half)), music.PlaybackMode.UntilDone)
    music.play(music.tonePlayable(523, music.beat(BeatFraction.Whole)), music.PlaybackMode.InBackground)
}
function 解答者_解答ボタン押下 () {
    if (動作モード.includes("解答者")) {
        機器へ指示を送信(機器番号, 指示_解答ボタン押下通知)
    }
}
input.onButtonPressed(Button.AB, function () {
    司会者_初期状態へ()
    初期設定_確定()
})
function 初期設定_機器番号up () {
    if (動作モード.includes("初期設定")) {
        機器番号 += 1
        if (機器番号 == 5) {
            機器番号 = 0
        }
        初期設定_表示()
    }
}
function 初期設定_機器番号down () {
    if (動作モード.includes("初期設定")) {
        機器番号 = 機器番号 - 1
        if (機器番号 == -1) {
            機器番号 = 4
        }
        初期設定_表示()
    }
}
input.onButtonPressed(Button.B, function () {
    司会者_正解通知()
    初期設定_機器番号up()
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    司会者_解答者順を確認()
})
function 司会者_初期状態へ () {
    if (動作モード.includes("司会者")) {
        司会者_初期設定()
        機器へ指示を送信(0, 指示_場のクリア)
    }
}
function 司会者_次の解答者へ () {
    if (動作モード.includes("司会者")) {
        if (解答待ち配列.length > 0) {
            解答済配列.push(解答待ち配列[0])
            解答待ち配列.shift()
            if (解答待ち配列.length > 0) {
                解答者ID = 解答待ち配列[0]
                機器へ指示を送信(解答者ID, 指示_解答権通知)
                serial.writeNumbers([解答者ID, 指示_解答権通知])
                basic.showNumber(解答者ID)
                音_ピンポン()
            } else {
                音_ブブー()
            }
        }
    }
}
function 司会者_正解通知 () {
    if (動作モード.includes("司会者")) {
        // 解答者に「正解」を通知する
        if (解答者ID > 0) {
            子機への指示 = 指示_正解通知
            機器へ指示を送信(解答者ID, 子機への指示)
            serial.writeNumbers([解答者ID, 子機への指示])
            basic.showIcon(IconNames.Yes)
            音_ピンポン()
        }
    }
}
function 初期設定_表示 () {
    if (機器番号 == 0) {
        basic.showLeds(`
            # . # . #
            # # # . #
            # . # . #
            # . # . #
            # . # . #
            `)
    }
    if (機器番号 == 1) {
        basic.showLeds(`
            . # . . #
            # # . . #
            . # . . #
            . # . . #
            # # # . #
            `)
    }
    if (機器番号 == 2) {
        basic.showLeds(`
            # # # . #
            . . # . #
            . # # . #
            # . . . #
            # # # . #
            `)
    }
    if (機器番号 == 3) {
        basic.showLeds(`
            # # # . #
            . . # . #
            # # # . #
            . . # . #
            # # . . #
            `)
    }
    if (機器番号 == 4) {
        basic.showLeds(`
            . . # . #
            . # # . #
            # . # . #
            # # # # #
            . . # . #
            `)
    }
}
function 司会者_解答ボタン受付 (receivedNumber3: number) {
    if (動作モード.includes("司会者")) {
        受信した子機ID = receivedNumber3 % 100
        // 解答者の応答順を保持しておく。重複なし
        if (受信した子機ID > 0) {
            if (解答待ち配列.indexOf(受信した子機ID) == -1 && 解答済配列.indexOf(受信した子機ID) == -1) {
                解答待ち配列.push(受信した子機ID)
                serial.writeNumbers([受信した子機ID, 0])
            }
        }
        if (解答者ID == 0) {
            解答者ID = 解答待ち配列[0]
            子機への指示 = 指示_解答権通知
            機器へ指示を送信(解答者ID, 子機への指示)
            serial.writeNumbers([解答者ID, 子機への指示])
            basic.showNumber(解答者ID)
            音_ピンポン()
        }
    }
}
let 受信した指示 = 0
let 子機への指示 = 0
let 解答者ID = 0
let 配列インデックス = 0
let 機器番号 = 0
let 動作モード = ""
let 指示_不正解通知 = 0
let 指示_正解通知 = 0
let 指示_解答権通知 = 0
let 指示_解答ボタン押下通知 = 0
let 指示_場のクリア = 0
let 解答待ち配列: number[] = []
let 解答済配列: number[] = []
let 受信した子機ID = 0
受信した子機ID = 0
解答済配列 = []
解答待ち配列 = []
指示_場のクリア = 0
指示_解答ボタン押下通知 = 0
指示_解答権通知 = 1
指示_正解通知 = 2
指示_不正解通知 = 3
// 初期化手順
radio.setGroup(1)
radio.setTransmitPower(7)
動作モード = "初期設定"
初期設定()
loops.everyInterval(15000, function () {
    if (動作モード.includes("司会者")) {
        serial.writeLine("WDT")
    }
})
