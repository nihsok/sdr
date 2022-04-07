目標：ほったらかしで自動で電波（データ）を受信してくれる装置を作る。
# 一般的な構成
## ハードウェア
- Software Defined Radio (SDR）受信機制御用PC
  - Raspberry PiなどのLinux PC （Raspberry Pi 3B相当のスペックが必要と聞いたこともあるが、未検証。4Bでは安定して動いた。ネットにはZeroで動かしている例もある）
  - ノートPCでも可
- SDR受信機（ドングル）
  - RTL-SDR Blog V3 R820T2 RTL2832U 1PPM TCXO SMA Software Defined Radio (https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/) が一番コスパよさそう。ただし結構熱くなる。
  - HiLetgo® USB2.0 デジタル DVB-T SDR+ DAB+ FM HDTV TVチューナー 受信機 (https://www.amazon.co.jp/dp/B01MF6TQEA/) これも安いので試してみたい。
- アンテナ
  - いろいろな方向に位置する対象からの電波を受信するため、無指向性のもの
## ソフトウェア
- rtl-sdr：受信機を制御するためのコマンド群
  - rtl_fm：復調を行う（一番よく使う）
  - rtl_test：受信機をテストする
  - rtl_tcp：受信データをTCPプロトコルで送る（他のPCから見られるようにする）
~~~
apt install rtl-sdr 
~~~
でインストールできる。（273kB程度）
- sox/play/rec：復調されたrawデータをwav等の音声に変換、再生する
~~~
apt install sox 
~~~
でインストールできる。（1,309 kB程度）

1台の受信機につき1つの周波数（帯）しか受信できないので、同時に複数の周波数（帯）を受信したければ受信機の数を増やす必要がある。制御にはそれなりに負荷がかかるので1台のPCに何本まで受信機を接続できるかはスペック次第。
## 裏技：WebSDR
WebSDR (http://websdr.org) という世界中のSDRを使わせてもらえるサービスを利用すれば、受信機を用意しなくてもSDRを活用できる。
- 使い方は？
- 制約
- 自動運用との相性

# ラジオの受信

## FMラジオの電波から流星エコーを検出

# 人工衛星データの受信

## NOAA APT

## ISS SSTV

## SATNOGS

# 航空機が発信しているデータの受信

# 短波FAX
