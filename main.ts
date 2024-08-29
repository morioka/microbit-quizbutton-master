radio.onReceivedNumber(function (receivedNumber) {
    受信した子機番号 = receivedNumber % 100
    if (解答者あり == 0) {
        // 最初の解答者に解答権を与える
        if (受信した子機番号 > 0) {
            解答者あり = 1
            子機への指示 = 100
            radio.sendNumber(受信した子機番号 + 子機への指示)
            basic.showNumber(受信した子機番号)
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.InBackground)
        }
    }
    // 解答者の応答順を保持しておく
    if (解答者あり == 1) {
        if (受信した子機番号 > 0) {
            配列.push(受信した子機番号)
        }
    }
})
input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    if (解答者あり == 1) {
        // 解答者に「不正解」を通知する
        子機への指示 = 300
        radio.sendNumber(受信した子機番号 + 子機への指示)
        basic.showIcon(IconNames.No)
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerDown), music.PlaybackMode.InBackground)
    }
})
input.onButtonPressed(Button.A, function () {
    if (配列.length == 0) {
        basic.showString("M")
    } else {
        // 解答者の応答順を、順次表示する。エンドでビープ
        basic.showNumber(配列[配列インデックス])
        配列インデックス += 1
        if (配列.length == 配列インデックス) {
            配列インデックス = 0
            music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        }
    }
})
input.onButtonPressed(Button.B, function () {
    // 状態をリセットする
    radio.sendNumber(0)
    解答者あり = 0
    配列 = []
    配列インデックス = 0
    受信した子機番号 = 0
    basic.showString("M")
})
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    // 解答者に「正解」を通知する
    if (解答者あり == 1) {
        子機への指示 = 200
        radio.sendNumber(受信した子機番号 + 子機への指示)
        basic.showIcon(IconNames.Yes)
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.InBackground)
    }
})
let 配列インデックス = 0
let 配列: number[] = []
let 子機への指示 = 0
let 受信した子機番号 = 0
let 解答者あり = 0
radio.setGroup(1)
radio.setTransmitPower(7)
解答者あり = 0
受信した子機番号 = 0
子機への指示 = 0
配列 = []
配列インデックス = 0
basic.showString("M")
