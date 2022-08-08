---
title: 自宅サーバーを立てたv２。
description: 現状2022/08現在のネットワークやサーバーの状態です。自宅サーバーを推奨するものでもなく、クラウドを卑下するものでもありません。お金があれば大容量のクラウドを契約したいです。
---

# 自宅サーバーを立てたv２。

現状2022/08現在のネットワークやサーバーの状態です。自宅サーバーを推奨するものでもなく、クラウドを卑下するものでもありません。お金があれば大容量のクラウドを契約したいです。

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>

## 設備情報

1. マンションに付属している無料のネット回線
2. 残ったパーツで作った自作サーバー
3. VPSサーバー1台

### IPアドレスについて

マンションの無料ネット回線を使用しているので、プライベートアドレスが割り当てられます。プロバイダとの契約もマンションオーナーが行っているため、固定IPや公開IPが取得できません。一般的には固定IPを契約しておくのが無難。

これを言うと元も子もないが、自宅サーバーを立てるよりも、VPSなり、クラウド契約した方が賢い。

## プライベートアドレスでも公開させる

プライベートアドレスを世間に公開する方法はありません。

しかし、VPNを利用し、外部に公開されているサーバーと繋ぐことでプライベートアドレスが設定されているPCを公開させることができます。

![エビフライトライアングル](/images/blog/server_network.png)

このためVPSサーバーが必要となります。ユーザーがアクセスするサーバーはすべてVPSになります。

## 仕組みの詳細

VPSサーバーは、[OpenVPN](https://www.openvpn.jp/)と[nginx](https://nginx.org/)が動いています。

VPNの多くはセキュリティのために使用される事が多いのですが、ここでの使い方は、VPSと自宅サーバーを**同じ仮想のネットワークに同居させる**のが目的です。VPNで双方を繋ぐことにより、VPSからPUSH通知が可能になります。

nginxはProxyサーバーとして利用します。VPS本体にはWebサービス機能はありません。80ポート、443ポートのアクセスがあった場合に、すべて自宅サーバーにupstreamを利用してデータを流すようにしています。

***nginx.confサンプルイメージ***

```atom
upstream webserver {
    server 1.2.3.4:80;  ## 自宅サーバーの仮想IPアドレス
}

server {
    listen  0.0.0.0:80;
    proxy_pass webserver;
}
```

### nginxの注意点

サービスはすべてDocker化しています。[docker-hubにあるnginx](https://hub.docker.com/_/nginx)はWebサービスを特化しているようで、**streamには対応していません**。そのため自身でソースコードを取得し、コンパイル時にstreamを有効にするためのオプションが必要となります。

**dockerファイルの一部抜粋**

```docker
RUN wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz \
    && tar -zxvf nginx-${NGINX_VERSION}.tar.gz \
    && cd nginx-${NGINX_VERSION} \
    && ./configure --prefix=${NGINX_PREFIX} --user=nginx --group=nginx --with-http_ssl_module --with-threads --with-stream  --with-stream_ssl_module --with-stream_realip_module --with-http_v2_module \
         --conf-path=${NGINX_PREFIX}/nginx.conf \
         --sbin-path=/usr/sbin/nginx \
         --with-debug 
```

### 通信の暗号化は必要か？

upstreamにて通信を行っている訳ですから、**平文での双方向の通信**になります。しかしVPNにてトンネル化され、そこで暗号化されているので問題がないと言う認識です。

upstreamを暗号化すると、さらにVPNにて暗号化されてしまい通信が2重暗号化状態になってしまいます。**これが良い選択なのかはわかりません**。


<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>
