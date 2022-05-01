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
