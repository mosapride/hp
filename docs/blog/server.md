---
title: 自宅サーバーを立てた。
description: マイクラサーバーを建てる場合はメモリが重要になる。クラウドやVPSで構築するには維持費は個人運用の場合はかなりの出費になる
---

# 自宅サーバーを立てた。

動いている訳です。現在は[箱庭](https://hako.v-kurore.com)とマイクラサーバーとして運用中。

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>

## 自宅サーバーを立てた経緯

箇条書きの方が説明しやすい

1. 今住んでいるマンションが無料インターネットを始め、２回線持っている状態になる
2. 契約しているプロバイダが半固定IP
3. DDNS対応のルータを持ってる
4. DNSは契約している
5. 自作PCをしているため、余りパーツがある
6. マイクラサーバーを立ててみたい
7. 初期費用が掛からずサーバーが建てれるな！！←結論

## これはサーバーです

壁にぶら下げています。ケースなんて無い！！紐で壁に掛けてます。

<img :src="$withBase('/images/blog/server01.png')" width="600px" >

|key|val|
|---|---|
|OS|Ubuntu 20.04.2 LTS|
|CPU|Ryzen 7 1700|
|マザボ|X370 Pro4|
|メモリ|8GB x 2枚|
|SSD|256GB|
|電源ユニット|Cooler Master V650|

Ryzen 7 1700はグラフィック機能が無いのですが、余っているグラボで初期インストール後に**外しました**。操作はSSHリモートで行うため、キーボード、マウス、ディスプレイなどのユーザーインターフェースは一切接続していません。

### グッバイLED

Ryzen 7 1700付属のCPUクーラーを使用していますが標準でLOGOのLEDが光ります。Windows 10の場合はドライバがありLEDを消すことができるようですが、Linux用の公式ドライバはありません。サーバーに不要なソフトを入れるのは嫌なので、マザボを調べてみましたが、どうも制御できないみたいです。なのでテープを貼ってLEDを**物理的に遮断**しています。PCパーツは光らせる事が主流ですね。人気モデルは少なからずピカピカしてます。個人的には**高級感やデザインなんてどうでも良くて無駄な機能をつけないで**欲しいですね。

<img :src="$withBase('/images/blog/server02.png')" >

## レンタルサーバーにしない理由

VPSは借りています。が！！マイクラサーバはメモリをたくさん食べる。それをクラウドやVPSなどで契約する場合は安いところでも15,000円/月ぐらい掛かる。会社で借りる場合はともかく個人での出費となるとかなり痛い。

趣味サーバーでハードウェア障害が起きてデータが飛んでも「おぉ、壊れたか」ぐらいの感覚なのでいいかなっと

ワットメーターで計測した所、電気代は600円/月と予想より安かった。計測したときは特に負荷を掛けていない状態だったが高負荷時が続いても倍にはならないだろうと思っている。Ryzen 7 1700は定格65Wと使用電力も低く、ストレージもSSDを使用していることが低消費電力の理由だと思う。

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>

## 危惧しているところ

### 回線問題

マンションに住んでいるので時間帯によって回線スピードが左右されます。ベストエフォートは100Mbpsですが、実測値で快適な時は30Mbps、ゴールデンタイムは1Mbpsとかなり差があります。遅くなる時間帯では2回線とも速度低下が起きるためVDSLがボトルネックになっていると予想。

おそらく無料回線はASAHIネットのIPv6プラン。自分で契約しているのは光コラボなので、根本的に回線速度を改善するためには部屋に光回線を引く必要がありますが、そこまで労力をかけるほどの熱意はないため放置です。自宅サーバーに飽きたら、複数回線を所持する意味が無いので契約を解約すれば月に5000円近く浮きますし。

### 騒音問題

CPUクーラーはマザーボードの設定で回転数を制御しているのでまったく気にならない。問題なのは電源ユニットのCooler Master V650で、常時ファンが回転しています。PCケースに入れていればなんの問題の無いレベルの音ですが、裸で置いているので多少気になる時がありますね。

NZXTのC650は電源の出力が30％未満の場合はファンを停止する、セミファンレス機能を持っているので気が狂ったら購入しようと思ってます。たぶんしないけど。

## OSの話

サーバーOSはUbuntu 20.04.2 LTSで動かしています。サーバーOSの場合Linuxディストリビューションが多いため結構悩みます。

本サーバーはDocker上でコンテナサービスをメインで運用しているため、OSには依存しないようにしています。つまり私がOSに求めることは

1. 無料であること
2. Dockerが動くこと
3. maintenanceが長いこと
4. そこそこのシェアがあること

maintenanceが長いことが利点だったCentOSは方針を転換しCentOS Streamとなるようです。最新版のCentOS 8よりCentOS 7の方がメンテナンス期間が長く2024-06-30までらしいです。CentOS 8はCensOS Stream-8となり2024-05-31となっていますが、どのような運営方針になるのか不確定要素が多いので避けました。

Docker専用と言っても良いOSとしてRed Hatが提供しているRHCOS、その傘下のFedora CoreOSがあります。当初はFedora CoreをホストOSとしようとしましたが辞めました。

昔はContainer OSを使用しておりました。それをRed Hatが吸収したため、Container OSは終了し、新しくRHCOSとFedora CoreOSが生まれたのですがOSとしての作業範囲が広くなった感じが大きいです。さらにスケジュールノートが公開されていないのか見つけることができません。

運用当時のContainer OSは初期設定では通信用のSSHとDockerサービスしか動かない設定でホストOS上では何もできない仕様でした。ファイアウォールすら提供していません。これはListenするポートがDockerで開くポートであり、ポートをオープンにしておいてもListenするサービスは公開するサービスのみだから不要だと考えられます。もしFWのような機能を提供したい場合もContainerでサービス化すれば良いため、まさにOSと疎結合で扱いやすかったです。

個人ボランティアのみで成り立つLinux、企業による支援があるLinuxなど運用形態は様々ですし開発者の核となる人が離脱することにより大きなサービスが終了することも珍しくありません。ベストな回答を求めることは不可能ですが現状を見るとUbuntuが一番無難かなと結論を出した訳です。

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>
