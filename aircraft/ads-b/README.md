# やること
1. history_\*.jsonを読んでデータを成型: reform.py（定期的にwatch.shを動かすためにcrontabを設定する必要がある。）
2. 可視化: huga.py

# 観測値の求め方
## 気温 (T)
マッハ数Mは、相対風速Vrと音速Vsの比で与えらえる。

<img src="https://latex.codecogs.com/svg.image?M=\frac{V_r}{V_s}">

音速の定義は比熱比κ、乾燥空気の気体定数R、気温Tを用いて、

<img src="https://latex.codecogs.com/svg.image?\inline&space;V_s=\sqrt{\kappa&space;RT}">

この2式からTについて求めると、

<img src="https://latex.codecogs.com/svg.image?T=\frac{V_r^2}{\kappa&space;RM^2}=\frac{V_r^2}{1.4\times&space;287\times&space;M^2}=\frac{V_r^2}{401.8M^2}">

https://doi.org/10.1371/journal.pone.0205029 ここにはもう少し詳しい求め方が載っている（マッハ数で条件分岐する）
```mermaid
flowchart TD
  A(相対速度Vr) --> C{eq.}
  B(マッハ数M) --> C
  C --> D[気温T]
```
