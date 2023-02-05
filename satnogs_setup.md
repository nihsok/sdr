
# SatNOGSのセットアップ
Raspberry Piなら専用のOSが提供されているが、他の用途と共存させるためソフトのみインストールして使うことにした。
## ソフトのインストール (https://wiki.satnogs.org/SatNOGS_Client_Ansible)
Ansibleを使う。クライアントとホストの2台の端末を前提としていることに注意。ここでは
1. クライアントPC（Linuxなど）
2. ホストサーバー（Raspberry Piなど）

の2台を想定する。1→2へのssh接続は設定済みとする。satnogs-*のインストールはクライアント側から行う
~~~
$ sudo apt install ansible git sshpass python-setuptools python3-gps
$ git clone https://gitlab.com/librespacefoundation/satnogs/satnogs-client-ansible.git
$ cd satnogs-client-ansible
$ git checkout stable
$ cp -r production.dist production
$ vi production/inventory/hosts                                # ansible_host: '（ホストサーバーのIP）'、ansible_user: '（ユーザー名）', ansible_port: 80（sshポートが80以外の場合は変更。クオート不要）
$ ansible-playbook -i production/inventory/hosts -K site.yml --private-key=".ssh/id_rsa.pub"  # 公開鍵は適当なパスを指定。-vをふやすと冗長なログが出る (-v, -vv, -vvv, -vvvv) 。
BECOME password: #ホストサーバーでsudoになるためのパスワードを入力
~~~
10分以上かかる。WARNING結構出て心配になる。Ansibleは冪等性を強調しており、何度実行しても同じところにたどり着くはずなので失敗してもあきらめずに試す。（en_USのlocaleを設定していないとエラーになるかも。`sudo locale-gen`してから`sudo dpkg --configure -a`。メモリ不足でlocale-genがこけることもあるらしい。https://freefielder.jp/blog/2022/05/ubuntu-fix-locale.html）

上記のページでは
~~~
It currently supports Raspbian and Debian (stretch and buster).
~~~
と書いてあるが、2023/2/4時点でBullseyeでのみ正常にインストールできた。常に最新のバージョンのみサポートする方針と思われる。（なので、結局はOSをインストールしなおす必要があるかもしれない）
- Raspberry Pi OS Lite (64bit) Bullseye: インストール失敗。setuptoolsのバージョンまわり？
- Raspberry Pi OS Lite (32bit) Buster: インストール失敗。libhdf5-103-1がインストールできない
- Raspberry Pi OS Lite (32bit) Bullseye: インストール成功。

Ansibleを使う方法はマイナーなようだが、フォーラムで悩みが解決するかも。（https://community.libre.space/c/satnogs/software/10 ）

## 実行 (https://wiki.satnogs.org/SatNOGS_Client_Setup)
以降はすべてホストサーバーでの作業
~~~
$ sudo satnogs-setup
~~~
初回はかなり時間がかかる。
- Basic Configurationの変数を設定する
  - このときまでにAPI token、設置場所の緯度経度などを取得しておく
- RF Gainを設定するための設定はAdvancedになっている
- serviceで動いているので、ここまで完了したら基本的には自動で稼働し続ける
- 設定を後から変更するときも同じ（このときも、少し時間がかかる）