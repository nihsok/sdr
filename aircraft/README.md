# ACARS (Aircraft Communication Addressing and Reporting System)
```
#依存ライブラリのインストール
sudo apt install zlib1g-dev libxml2-dev
git clone https://github.com/szpajder/libacars
cd libacars
mkdir build
cd build
cmake ..
make
sudo make install
sudo ldconfig
#本体のインストール（rtl_sdrを使っている場合）
git clone https://github.com/TLeconte/acarsdec.git
cd acarsdec
cd build
cmake .. -Drtl=ON
make
sudo make install
#実行
acarsdec -v -l acars.log -r 0 131.250 131.450 131.950
```
# ADS-B (Automatic Dependent Surveillance-Broadcast)
fr24feedをインストールすると、Flightradar24へのアップロードまでまとめてセットアップしてくれる。

公式 (https://www.flightradar24.com/share-your-data) で推奨されているインストール方法
```
sudo bash -c "$(wget -O - https://repo-feed.flightradar24.com/install_fr24_rpi.sh)"
```
対話形式で設定を進める。とちゅうで緯度経度,海抜高度の入力を求められる。
- 設定を変更する際は`fr24feed --reconfigure`
と思っていたが、この方法ではdump1090-mutabilityがインストールされてしまう。単体だと問題なく動いたが、サポート終了しているためかfr24feedがうまく動かなかった(dump1090をインストールしようとする）ので、dump1090-faを使うようにした。
```
git clone https://github.com/flightaware/dump1090 dump1090-fa
cd dump1090-fa
sudo apt install libbladerf-dev libhackrf-dev liblimesuite-dev libncurses5-dev debhelper
dpkg-buildpackage -b --no-sign
sudo dpkg -i ../dump1090-fa_3.8.0_arm64.deb
sudo systemctl enable dump1090-fa.service #自動起動
sudo service dump1090-fa start
sudo fr24feed --reconfigure
#Enter your receiver type (1-7)$:4 #ModeS Beast
#Enter your connection type (1-2)$:1
#Step 4.3A - Please enter your receiver's IP address/hostname$:127.0.0.1
#Step 4.3B - Please enter your receiver's data port number$:30005
sudo service fr24feed restart
```
しばらくすると
```
fr24feed-status
[ ok ] FR24 Feeder/Decoder Process: running.
[ ok ] FR24 Stats Timestamp:.
[ ok ] FR24 Link: connected [UDP].
[ ok ] FR24 Radar: T-RJAF117.
[ ok ] FR24 Tracked AC:.
[ ok ] Receiver: connected ( MSGS/ SYNC).
[ ok ] FR24 MLAT: ok [UDP].
[ ok ] FR24 MLAT AC seen: 2.
```
の結果を得る。
http://192.168.0.100:8754 flightradar24のステータスを確認できる（IPアドレスは適宜変更の必要あり）
http://192.168.0.100/skyaware/ dump1090-faのステータスを確認できる（IPアドレスは適宜変更の必要あり）
https://gato.intaa.net/archives/21706 FlightRadar24の設定について詳しい。
http://www17.plala.or.jp/y9500/ads-b.html 熱対策とアンテナの工夫について参考になる。

# VDL2 (VHF Data Link - Mode 2)
```
git clone https://github.com/szpajder/dumpvdl2.git
cd dumpvdl2
mkdir build
cd build
cmake ..
make
sudo make install
#実行
dumpvdl2 --rtlsdr 0 136975000 --gain 49.6 --output decoded:text:file:path=vdl2.log
```

参考: https://ishikawa-lab.com/RasPi_SDR.html
