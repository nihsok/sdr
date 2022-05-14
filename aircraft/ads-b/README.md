# 機能
1. reform.py: history_\*.jsonを読んでデータを成型→history_\*.csv
2. watch.sh: reform.pyの実行と、history_\*.csvを合体→data.csv（crontabの設定が必要）
3. index.html,\*.js: 可視化

# 観測値の求め方
## 気温 (T)
マッハ数*M*は、相対風速 (True AirSpeed; TAS) と音速*V*sの比で与えらえる。

<img src="https://latex.codecogs.com/svg.image?M=\frac{TAS}{V_s}">

音速の定義は比熱比κ、乾燥空気の気体定数R、気温*T*を用いて、

<img src="https://latex.codecogs.com/svg.image?\inline&space;V_s=\sqrt{\kappa&space;RT}">

この2式から*T*について求めると、

<img src="https://latex.codecogs.com/svg.image?T=\frac{TAS^2}{\kappa&space;RM^2}=\frac{TAS^2}{1.4\times&space;287\times&space;M^2}=\frac{TAS^2}{401.8M^2}">

### 予備知識
航空機の速度はTAS以外に
- 指示対気速度 (Indicated AirSpeed; IAS) 
- 較正対気速度 (Calibrated AirSpeed; CAS) 
- 等価対気速度 (Equivalent AirSpeed; EAS) 

がある。これら3種はほぼ同じ値で（厳密には異なる）、TASがなくてもIASのデータが得られることがある。そこで、IASを用いて気温を求める方法を考える。
**大気の圧縮性を無視できるとき**（M≦0.3: https://ja.wikipedia.org/wiki/マッハ数 ）、IASとTASの関係は以下のように与えられる。(https://en.wikipedia.org/wiki/Equivalent_airspeed)

<img src="https://latex.codecogs.com/svg.image?IAS\approx&space;EAS=TAS\sqrt{\frac{\rho}{\rho_0}}">

大気の密度*ρ*は等温を仮定すると、地上での密度*ρ*0からスケールハイト*H*を使って高度*z*とともに指数関数的に減少する。

<img src="https://latex.codecogs.com/svg.image?\rho=\rho_0&space;e^{-\frac{z}{H}}">

これを代入すると

<img src="https://latex.codecogs.com/svg.image?TAS\approx&space;IAS\sqrt{\frac{\rho_0}{\rho}}=IAS\times&space;e^{\frac{z}{2H}}">

*T*を求める式は、

<img src="https://latex.codecogs.com/svg.image?T=\frac{e^{\frac{z}{H}}}{\kappa&space;R}\frac{IAS^2}{M^2}">

ここで、平均的な気温約273K（仮定）のとき、*H*は8000m。

**大気の圧縮性を無視できないとき** (M>0.3) はIASとTASの変換式は使えず、TASとMからTを求める式をTASについて変形した形

<img src="https://latex.codecogs.com/svg.image?TAS=M\sqrt{\kappa&space;RT}">

で求める。この式でTは求められないので、TASの情報がないときにIASから気温を求められるのはM≦0.3のときに限られる。実際に上空を航行しているときはほとんどM>0.3なので、今回は実装しない。

## 風速 (U,V)
飛行機は風の影響を受けながら進むため、対地速度**Vg**は飛行機自体の速度**Vt**と風速**V**の合計になる。

<img src="https://latex.codecogs.com/svg.image?\mathbf{V}_g=\mathbf{V}_t&plus;\mathbf{V}" title="https://latex.codecogs.com/svg.image?\mathbf{V}_g=\mathbf{V}_t+\mathbf{V}" />

よって、風速は

<img src="https://latex.codecogs.com/svg.image?\binom{u}{v}=\binom{u}{v}_g-\binom{u}{v}_t=\binom{V_{gs}\sin\theta_{track}-V_{TAS}\sin(\theta_{heading}&plus;\alpha)}{V_{gs}\cos\theta_{track}-V_{TAS}\cos{(\theta_{heading}&plus;\alpha)}">

ここで*V*gs、*V*TASはそれぞれ対地速度と相対風速、*θ*trackと*θ*headingはそれぞれtrack angle（航路）とheading angle（針路）に対応する。

αは地磁気偏角で、緯度、経度、高度、時間によって決まる。NOAAのサイト (https://www.ngdc.noaa.gov/geomag/calculators/magcalc.shtml) で計算できる。今回は2020年1月1日における高度10kmの10度ごとの値を取得し、内挿により求める。
- 数年のスケールでは問題ないと思われるが、地磁気は変化するので適宜更新が必要。
- この方法では細かい水平構造（例えばhttps://www.gsi.go.jp/common/000237171.pdf） は再現できていないと思われる。
- 風速の不確実性の原因にはなると思われる。
- 気温と同様、マッハ数が小さいときはIASからTASを求めることができるが、今回は実装しない。

参考文献：Haan et al (2011) https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2010JD015264

## 計算の流れ
```mermaid
flowchart TD
  A(相対速度TAS) --> C{気温の計算}
  B(マッハ数M) --> C
  C --> D[気温T]
  E(指示対気速度IAS) --> F{M0.3以下}
  G(高度z) --> F
  F -.-> A
  B -.-> F
  
  H(航路角θtrack) --> I
  J(対地速度Vgs) --> I{{対地速度ベクトル}}

  M(緯度経度) --> N(偏角α)
  N --> K{{移動風速ベクトル}}
  L(針路角θheadihg) --> K
  A --> K

  I --> O{和}
  K --> O
  O --> P[風速u,v]
```
