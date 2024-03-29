目標：Software Defined Radio (SDR、ソフトウェアラジオ、ソフトウェア無線）を使用してあまり労力をかけずに電波（データ）を受信する装置を作る（ための情報収集）。
# 一般的な構成
## ハードウェア
- SDR受信機制御用PC
  - Raspberry PiなどのLinux PC （Raspberry Pi 3B相当のスペックが必要と聞いたこともあるが、未検証。4Bでは安定して動いた。ネットにはZeroで動かしている例もある）
  - ノートPCでも可
- SDR受信機（ドングル）
  - RTL-SDR Blog V3 R820T2 RTL2832U 1PPM TCXO SMA Software Defined Radio (https://www.rtl-sdr.com/buy-rtl-sdr-dvb-t-dongles/) が一番コスパよさそう。約$30。ただし結構熱くなる。
  - HiLetgo® USB2.0 デジタル DVB-T SDR+ DAB+ FM HDTV TVチューナー 受信機 (https://www.amazon.co.jp/dp/B01MF6TQEA/) これも安い。すぐ売り切れるので都度関連商品から探す必要があるが、選べば2000円くらいで買える。ただし**R820T2が搭載されているもの**を選ぶ。R820T2は生産中止しているという噂があるので、代替チューナー（FC0012だと948.6MHzまでしか受信できない）搭載品を間違って買わないよう注意。外見は同じなので、買ってチップを直接見るまでわからない？受信帯域が違うだけなら低周波受信用にまわせばよいが、感度も弱くなるとか。
- アンテナ
  - いろいろな方向に位置する対象からの電波を受信したいので、無指向性のもの
  - 特定の対象（衛星など）を追いかけるためにローテーターを使うという選択肢もあるが、維持管理コストがかかるのでここでは考えない。
## ソフトウェア
- rtl-sdr：受信機を制御するためのコマンド群
  - rtl_test：受信機をテストする
  - rtl_fm：復調を行う（一番よく使う）
  - rtl_tcp：受信データをTCPプロトコルで送る（他のPCから見られるようにする）
~~~
apt install rtl-sdr
~~~
でインストールできる。（273kB程度）

SDR受信機の情報を設定ファイル（/etc/udev/rules.d/rtl-sdr.rules）に書き込む必要がある。ファイルがなければ新しく作成し、https://github.com/keenerd/rtl-sdr/blob/master/rtl-sdr.rules の内容を貼り付ける。
- sox/play/rec：復調されたrawデータをwav等の音声に変換、再生する
~~~
apt install sox
~~~
でインストールできる。（1,309 kB程度）

1台の受信機につき1つの周波数（帯）しか受信できないので、同時に複数の周波数（帯）を受信したければ受信機の数を増やす必要がある。制御にはそれなりに負荷がかかるので何本の受信機を接続できるかはPCのスペック次第。
## 裏技：WebSDR
WebSDR (http://websdr.org) という世界中のSDRを使わせてもらえるサービスを利用すれば、受信機を用意しなくてもSDRを活用できる。
- 使い方は？
- 制約
- 自動運用との相性

# できること
## FMラジオの受信
~~~
timeout 10 rtl_fm -f 84.0e6 -M wbfm|sox -t raw -r 24k -es -b16 - tmp.wav
~~~
とすると84.0MHzのFMラジオの音声が10秒間tmp.wavファイルに保存される。聞きたい局の周波数、時間を指定してatやcronでスケジュールしておけば、自動で録音できる。オプション次第で音質アップ？
### FMラジオの電波から流星エコーを検出
流星電波観測国際プロジェクト (https://www.amro-net.jp/) に詳しい。
- HRO (Ham-band Radio Observation)
- FRO (FM Observation)
- VOR (VHF Omni directional range)
- MURO (MU Radar Observation)
## 人工衛星データの受信
主な流れとしては、
1. 軌道計算により、自局の上を衛星が通過する時刻を求める。

  predictというコマンドで計算できる。
~~~
apt install predict
~~~
  ただし、クセが強い。
  - 自分の位置の情報は`~/.predict/predict.qth`に保存されている。
    - 単に`predict`だけ、あるいはオプションを間違えると自局位置情報編集ウィザードへ飛ばされる。
    - 経度は**西経**（東経の場合はマイナス）
  - 軌道計算に必要なtleファイルは www.celestrak.com/NORAD/elements/ などからダウンロードしておく。
    - `predict -p "衛星の名前" -t 軌道要素ファイル` とすると**次に**衛星が通過するときの情報が出力される。
      - デフォルトのフォーマットは[UNIX time, 曜日, 日付, 時刻 (UTC), 高度, ...]
      - 水平線（高度0m）から登ってきて再び水平線に沈むまでの途中の時刻と位置を適当な時間間隔刻みで表示してくれる。
      - 出力がないことがある（今後数時間視界に入らない？）
  - 単に`predict -t weather.txt`とするとリアルタイム実況モードに入れる。
  - 太陽や月の軌道も人工衛星同様に計算できたり、このコマンドからローテーターを制御できたりと、ポテンシャルは高い。

2. 自分の上を衛星が通過している間受信する

  predictで求めた時刻にatなどでジョブをスケジュールしておく。

3. （受信したデータを音声に復調する）
4. 受信したデータ（あるいは音声）から画像などのデータを作成する

衛星によっては復調プログラムがすでに開発されている。
### NOAA APT
https://noaa-apt.mbernardi.com.ar/
### ISS SSTV

### SatNOGS (https://satnogs.org/)
世界各地でいろいろな衛星の電波を受信して、共有する試み。詳細はsatnogs_setup.mdに示す。
## 航空機データの受信
航空機が発信しているデータとしては、
- ACARS (Aircraft Communications Addressing and Reporting System)
- ADS-B (Automatic Dependent Surveillance-Broadcast)
- VDL2 (VHF Data Link - Mode 2)
がある。詳細はaircraftのディレクトリに記述。
## WSPR (Weak Signal Propagation Reporter)
アマチュア無線により位置情報を送り、受信した側はオンラインで共有し、どこに伝播したかを知る

情報集約先：https://www.wsprnet.org/drupal/

rtl-sdrによる制御：https://github.com/Guenael/rtlsdr-wsprd
## 短波FAX
### Fldigi
解説資料: http://www.hotozuka.com/fax/pdf/fldigi.pdf
