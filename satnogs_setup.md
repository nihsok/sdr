
#SatNOGSのセットアップ
Raspberry Piなら専用のOSが提供されているが、他の用途と共存させるためソフトのみインストールして使う。
##ソフトのインストール (https://wiki.satnogs.org/SatNOGS_Client_Ansible)
Ansibleを使う。clientとhostの2台の端末を前提としていることに注意。ここでは
1. クライアントPC（Linuxなど）
2. ホストサーバー（Raspberry Piなど。Debian Busterのみサポート）
の2台を想定する。1→2へのssh接続は設定済みとする。
ホストサーバー側で必要ソフトを用意
~~~
$ sudo apt install ansible git sshpass python-setuptools python3-gps
~~~
satnogs-*のインストールはクライアント側から行う
~~~
$ git clone https://gitlab.com/librespacefoundation/satnogs/satnogs-client-ansible.git 
$ cd satnogs-client-ansible                                  
$ git checkout stable                                
$ cp -r production.dist production       
$ vi production/inventory/hosts                                # ansible_host: '（ホストサーバーのIP）'、ansible_user: '（ユーザー名）', ansible_port: 80（sshポートが80以外の場合は変更。クオート不要）
$ ansible-playbook -i production/inventory/hosts -K site.yml --private-key=".ssh/id_rsa.pub"  # 公開鍵は適当なパスを指定。-vで冗長なログが出る。
BECOME password: #ホストサーバーでsudoになるためのパスワード？を入力
~~~
10分以上かかる。WARNING結構出て心配になる。Ansibleは冪等性を強調しており、何度実行しても同じところにたどり着くはずなので失敗してもあきらめずに試す。（en_USのlocaleを設定していないとエラーになるかも。`sudo locale-gen`してから`sudo dpkg --configure -a`。メモリ不足でlocale-genがこけることもあるらしい。https://freefielder.jp/blog/2022/05/ubuntu-fix-locale.html）

フォーラムで悩みが解決するかも。（https://community.libre.space/c/satnogs/software/10）
再びホストサーバーにて
~~~
$ sudo satnogs-setup 
~~~
でよいはず。
ところが以下のエラーメッセージで動かず。
~~~
Inconsistency detected by ld.so: get-dynamic-info.h: 138: elf_get_dynamic_info: Assertion `info[DT_RELENT]->d_un.d_val == sizeof (ElfW(Rel))' failed!
~~~
どうやらSDファイルの破損らしい。壊れていないSDカードならちゃんと動くはずなので、新しいSDカードを試すまでこの項目は棚上げ。

##実行 (https://wiki.satnogs.org/SatNOGS_Client_Setup)