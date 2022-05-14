# 機能
1. reform.py: history_\*.jsonを読んでデータを成型→history_\*.csv
2. watch.sh: reform.pyの実行と、history_\*.csvを合体→data.csv（crontabの設定が必要）
3. index.html,\*.js: 可視化

# 観測値の求め方
## 気温 (T)
マッハ数Mは、相対風速 (True AirSpeed; TAS) と音速Vsの比で与えらえる。

<img src="https://latex.codecogs.com/svg.image?M=\frac{TAS}{V_s}">

音速の定義は比熱比κ、乾燥空気の気体定数R、気温Tを用いて、

<img src="https://latex.codecogs.com/svg.image?\inline&space;V_s=\sqrt{\kappa&space;RT}">

この2式からTについて求めると、

<img src="https://latex.codecogs.com/svg.image?T=\frac{TAS^2}{\kappa&space;RM^2}=\frac{TAS^2}{1.4\times&space;287\times&space;M^2}=\frac{TAS^2}{401.8M^2}">

航空機の速度はTAS以外に指示対気速度 (Indicated AirSpeed; IAS) 、較正対気速度 (Calibrated AirSpeed) 、等価対気速度 (Equivalent AirSpeed) がある。これら3種はほぼ同じ値になり（厳密には異なる）、TASがないときにもIASのデータが得らえることがある。そこで、IASを用いて気温を求める方法も考える。大気の圧縮性を無視できるとき（M≦0.3: https://ja.wikipedia.org/wiki/マッハ数）、IASとTASの関係は以下のように与えられる。(https://en.wikipedia.org/wiki/Equivalent_airspeed)

<img src="https://latex.codecogs.com/svg.image?IAS\approx&space;EAS=TAS\sqrt{\frac{\rho}{\rho_0}}">

大気の密度ρは等温を仮定すると、高度zとともに指数関数的に減少する。

<img src="https://latex.codecogs.com/svg.image?\rho=\rho_0&space;e^{-\frac{z}{H}}">

これを代入すると

<img src="https://latex.codecogs.com/svg.image?TAS\approx&space;IAS\sqrt{\frac{\rho_0}{\rho}}=IAS&space;e^{\frac{z}{2H}}">

Tを求める式は、

<img src="https://latex.codecogs.com/svg.image?T=\frac{e^{\frac{z}{H}}}{\kappa&space;R}\frac{IAS^2}{M^2}">

ここで、気温約273K（仮定）のとき、Hは8000m。

大気の圧縮性を無視できないとき (M>0.3) は密度の比は使えず、TASとMからTを求める式をTASについて変形した形

<img src="https://latex.codecogs.com/svg.image?TAS=M\sqrt{\kappa&space;RT}">

で求める。つまり、IASから気温を求められるのはM≦0.3のときで、離着陸時を除いて上空を航行しているときはほとんどM>0.3なので、今回は実装しない。

## 風速 (U,V)

```mermaid
flowchart TD
  A(相対速度TAS) --> C{気温の計算式}
  B(マッハ数M) --> C
  C --> D[気温T]
```
