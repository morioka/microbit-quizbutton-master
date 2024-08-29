radio.onReceivedNumber(function (receivedNumber) {
    if (R == 0) {
        // 最初の解答者のIDを打ち返す。解答権を与える
        if (receivedNumber > 0) {
            radio.sendNumber(receivedNumber)
            R = receivedNumber
            basic.showNumber(receivedNumber)
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.PowerUp), music.PlaybackMode.InBackground)
        }
    }
    // 解答者の応答順に保持しておく
    if (R > 0) {
        if (receivedNumber > 0) {
            配列.push(receivedNumber)
        }
    }
})
// 解答者の応答順を、順次表示する。エンドでビープ
input.onButtonPressed(Button.A, function () {
    if (配列.length == 0) {
        basic.showString("M")
    } else {
        basic.showNumber(配列[配列インデックス])
        配列インデックス += 1
        if (配列.length == 配列インデックス) {
            配列インデックス = 0
            music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        }
    }
})
// 状態をリセット
input.onButtonPressed(Button.B, function () {
    radio.sendNumber(0)
    R = 0
    配列 = []
    basic.showString("M")
})
let R = 0
let 配列インデックス = 0
let 配列: number[] = []
radio.setGroup(1)
radio.setTransmitPower(7)
配列 = []
配列インデックス = 0
basic.showString("M")
