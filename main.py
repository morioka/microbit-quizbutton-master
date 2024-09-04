def on_received_number(receivedNumber):
    司会者_解答ボタン受付(receivedNumber)
    解答者_指示受付(receivedNumber)
radio.on_received_number(on_received_number)

def 初期設定():
    global 機器番号2
    if 動作モード.includes("初期設定"):
        radio.set_group(1)
        radio.set_transmit_power(7)
        機器番号2 = randint(0, 4)
        初期設定_表示()
def 司会者_解答者順を確認():
    if 動作モード.includes("司会者"):
        if len(解答待ち配列) > 0:
            配列インデックス = 0
            while 配列インデックス <= len(解答待ち配列) - 1:
                basic.show_number(解答待ち配列[配列インデックス])
                basic.pause(500)
                配列インデックス += 1
            music.play(music.tone_playable(262, music.beat(BeatFraction.WHOLE)),
                music.PlaybackMode.UNTIL_DONE)
        機器番号_表示()

def on_logo_long_pressed():
    司会者_次の解答者へ()
input.on_logo_event(TouchButtonEvent.LONG_PRESSED, on_logo_long_pressed)

def 初期設定_確定():
    global 動作モード
    if 動作モード.includes("初期設定"):
        music.play(music.tone_playable(262, music.beat(BeatFraction.DOUBLE)),
            music.PlaybackMode.IN_BACKGROUND)
        if 機器番号2 == 0:
            動作モード = "司会者"
            serial.redirect(SerialPin.USB_TX, SerialPin.USB_RX, BaudRate.BAUD_RATE115200)
            司会者_初期設定()
        else:
            動作モード = "解答者"
    機器番号_表示()

def on_button_pressed_a():
    解答者_解答ボタン押下()
    司会者_不正解通知()
    初期設定_機器番号down()
input.on_button_pressed(Button.A, on_button_pressed_a)

def 司会者_不正解通知():
    global 子機への指示
    if 動作モード.includes("司会者"):
        if 解答者ID > 0:
            # 解答者に「不正解」を通知する
            子機への指示 = 指示_不正解通知
            機器へ指示を送信(解答者ID, 子機への指示)
            serial.write_numbers([解答者ID, 子機への指示])
            basic.show_icon(IconNames.NO)
            music._play_default_background(music.built_in_playable_melody(Melodies.POWER_DOWN),
                music.PlaybackMode.IN_BACKGROUND)
def 機器へ指示を送信(機器番号: number, 指示: number):
    radio.send_number(機器番号 + 指示 * 100)
def 機器番号_表示():
    if 機器番号2 == 0:
        basic.show_string("M")
    else:
        basic.show_number(機器番号2)
def 司会者_初期設定():
    global 解答者ID, 受信した子機ID, 子機への指示, 解答待ち配列, 解答済配列
    if 動作モード.includes("司会者"):
        解答者ID = 0
        受信した子機ID = 0
        子機への指示 = 0
        解答待ち配列 = []
        解答済配列 = []
        機器番号_表示()
        serial.write_numbers([0, 0])
def 解答者_指示受付(receivedNumber2: number):
    global 受信した子機ID, 受信した指示
    if 動作モード.includes("解答者"):
        受信した子機ID = receivedNumber2 % 100
        受信した指示 = Math.idiv(receivedNumber2, 100)
        # 自分が指定されていれば、解答権を得た
        if 受信した子機ID == 機器番号2:
            if 受信した指示 == 指示_解答権通知:
                basic.show_icon(IconNames.HEART)
                music._play_default_background(music.built_in_playable_melody(Melodies.BA_DING),
                    music.PlaybackMode.UNTIL_DONE)
            elif 受信した指示 == 指示_正解通知:
                basic.show_icon(IconNames.YES)
                music._play_default_background(music.built_in_playable_melody(Melodies.POWER_UP),
                    music.PlaybackMode.UNTIL_DONE)
            elif 受信した指示 == 指示_不正解通知:
                basic.show_icon(IconNames.NO)
                music._play_default_background(music.built_in_playable_melody(Melodies.POWER_DOWN),
                    music.PlaybackMode.UNTIL_DONE)
            else:
                # 未定義。テスト用
                basic.show_icon(IconNames.HAPPY)
                basic.pause(2000)
                basic.show_number(機器番号2)
        else:
            # 指示_場のクリア
            basic.show_number(機器番号2)
def 解答者_解答ボタン押下():
    if 動作モード.includes("解答者"):
        機器へ指示を送信(機器番号2, 指示_解答ボタン押下通知)

def on_button_pressed_ab():
    司会者_初期状態へ()
    初期設定_確定()
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def 初期設定_機器番号up():
    global 機器番号2
    if 動作モード.includes("初期設定"):
        機器番号2 += 1
        if 機器番号2 == 5:
            機器番号2 = 0
        初期設定_表示()
def 初期設定_機器番号down():
    global 機器番号2
    if 動作モード.includes("初期設定"):
        機器番号2 = 機器番号2 - 1
        if 機器番号2 == -1:
            機器番号2 = 4
        初期設定_表示()

def on_button_pressed_b():
    司会者_正解通知()
    初期設定_機器番号up()
input.on_button_pressed(Button.B, on_button_pressed_b)

def on_logo_pressed():
    司会者_解答者順を確認()
input.on_logo_event(TouchButtonEvent.PRESSED, on_logo_pressed)

def 司会者_初期状態へ():
    if 動作モード.includes("司会者"):
        司会者_初期設定()
        機器へ指示を送信(0, 指示_場のクリア)
def 司会者_次の解答者へ():
    global 解答者ID
    if 動作モード.includes("司会者"):
        if len(解答待ち配列) > 0:
            解答済配列.append(解答待ち配列[0])
            解答待ち配列.shift()
            if len(解答待ち配列) > 0:
                解答者ID = 解答待ち配列[0]
                機器へ指示を送信(解答者ID, 指示_解答権通知)
                serial.write_numbers([解答者ID, 指示_解答権通知])
                basic.show_number(解答者ID)
                music._play_default_background(music.built_in_playable_melody(Melodies.POWER_UP),
                    music.PlaybackMode.IN_BACKGROUND)
            else:
                music._play_default_background(music.built_in_playable_melody(Melodies.POWER_DOWN),
                    music.PlaybackMode.IN_BACKGROUND)
def 司会者_正解通知():
    global 子機への指示
    if 動作モード.includes("司会者"):
        # 解答者に「正解」を通知する
        if 解答者ID > 0:
            子機への指示 = 指示_正解通知
            機器へ指示を送信(解答者ID, 子機への指示)
            serial.write_numbers([解答者ID, 子機への指示])
            basic.show_icon(IconNames.YES)
            music._play_default_background(music.built_in_playable_melody(Melodies.POWER_UP),
                music.PlaybackMode.IN_BACKGROUND)
def 初期設定_表示():
    if 機器番号2 == 0:
        basic.show_leds("""
            # . . # #
            # # # # .
            # . . # .
            # . . # .
            # . . # #
            """)
    if 機器番号2 == 1:
        basic.show_leds("""
            . . # . #
            . # # . .
            . . # . .
            . . # . .
            . . # . #
            """)
    if 機器番号2 == 2:
        basic.show_leds("""
            # # # . #
            . . . # .
            . # # . .
            # . . . .
            # # # . #
            """)
    if 機器番号2 == 3:
        basic.show_leds("""
            # # # # #
            . . . # .
            . . # . .
            # . . # .
            . # # . #
            """)
    if 機器番号2 == 4:
        basic.show_leds("""
            . . # . #
            . # # . .
            # . # . .
            # # # # .
            . . # . #
            """)
def 司会者_解答ボタン受付(receivedNumber3: number):
    global 受信した子機ID, 解答者ID, 子機への指示
    if 動作モード.includes("司会者"):
        受信した子機ID = receivedNumber3 % 100
        # 解答者の応答順を保持しておく。重複なし
        if 受信した子機ID > 0:
            if 解答済配列.index(受信した子機ID) == -1 and 解答待ち配列.index(受信した子機ID) == -1:
                解答待ち配列.append(受信した子機ID)
                serial.write_numbers([受信した子機ID, 0])
        if len(解答待ち配列) > 0:
            解答者ID = 解答待ち配列[0]
            子機への指示 = 指示_解答権通知
            機器へ指示を送信(解答者ID, 子機への指示)
            serial.write_numbers([解答者ID, 子機への指示])
            basic.show_number(解答者ID)
            music._play_default_background(music.built_in_playable_melody(Melodies.POWER_UP),
                music.PlaybackMode.IN_BACKGROUND)
受信した指示 = 0
子機への指示 = 0
解答者ID = 0
機器番号2 = 0
動作モード = ""
指示_不正解通知 = 0
指示_正解通知 = 0
指示_解答権通知 = 0
指示_解答ボタン押下通知 = 0
指示_場のクリア = 0
解答待ち配列: List[number] = []
受信した子機ID = 0
解答済配列: List[number] = []
# 定数
指示_場のクリア = 0
指示_解答ボタン押下通知 = 0
指示_解答権通知 = 1
指示_正解通知 = 2
指示_不正解通知 = 3
# 初期化手順
radio.set_group(1)
radio.set_transmit_power(7)
動作モード = "初期設定"
初期設定()

def on_every_interval():
    if 動作モード.includes("司会者"):
        serial.write_line("WDT")
loops.every_interval(15000, on_every_interval)
