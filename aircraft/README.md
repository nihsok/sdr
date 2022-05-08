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
fr24feedをインストールすると、Flightradar24へのフィード送信までまとめてセットアップしてくれる。

公式 (https://www.flightradar24.com/share-your-data) で推奨されているインストール方法
```
sudo bash -c "$(wget -O - https://repo-feed.flightradar24.com/install_fr24_rpi.sh)"
```
対話形式で設定を進める。途中で緯度経度,海抜高度の入力を求められる。

この方法ではdump1090-mutabilityがインストールされる。単体では問題なく動いたが、サポート終了しているためか？fr24feedがうまく動かなかった（dump1090 をインストールしようとする）ので、dump1090-faを使うように変更した。(https://gato.intaa.net/archives/21706)
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
しばらくすると（直後ではだめなので、10分くらい待つ）
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
の結果を得る。flightradar24 のMy data sharingに反映されるまではもう半日くらいかかる。

デフォルトでは/run/dump1090-fa/以下に取得データが書き込まれる。SDカードへの書き込み回数を減らすため、データの記録先を/tmp/dump1090-fa/に変更した。まず/lib/systemd/system/dump1090-fa.service を編集
```
#before
ExecStart=/usr/share/dump1090-fa/start-dump1090-fa --write-json %t/dump1090-fa
#after
ExecStartPre=/usr/bin/install -m 777 -o dump1090 -g nogroup -d /tmp/dump1090-fa
ExecStart=/usr/share/dump1090-fa/start-dump1090-fa --write-json /tmp/dump1090-fa
```
次に、Web表示にも反映させるため/etc/lighttpd/conf-available/89-skyaware.conf のなかの/run/dump1090-fa/をすべて/tmp/dump1090-fa/に書き換える（3か所くらい）。その後
```
sudo systemctl restart lighttpd
```
（dump1090-faも再起動が必要なはずだが、記憶にない）
- http://192.168.0.100:8754 flightradar24のステータスを確認できる（IPアドレスは適宜変更の必要あり）
- http://192.168.0.100/skyaware/ dump1090-faのステータスを確認できる（IPアドレスは適宜変更の必要あり）
- http://www17.plala.or.jp/y9500/ads-b.html 熱対策とアンテナの工夫について参考になる。

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
