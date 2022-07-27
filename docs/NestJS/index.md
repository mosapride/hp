---
title: Introduction
description: NestJSの技術的な情報を書く。あくまで個人の意見なのでもっと良い実装方法があればgithubで書いて欲しい。
---

# Introduction

NestJSの技術的な情報を書く。自身で２つプロジェクトをNestJSを使ってRESTful APIを実装した訳だが、使いまわしができそうなところ、実装が大変だったところの知見を残す。

入門書ではない。

あくまで個人の意見なのでもっと良い実装方法があればgithubで書いて欲しい。

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>

## (一応)NestJSとは

Angular＋Express＋Database＝NestJS。みたいなイメージ。

NestJSのWebエンジンはExpressがデフォルトであるため、ここでもExpressを使用する。
DBには適当にMySQL、接続にはTypeORMを使用する。

使用するフレームワークはほぼほぼTypeScriptをサポートされているため、結構助かる。（正確にはFWがTypeScriptで作成されてたり、MWに@typesが存在するだけだが）

Angularの設計思想を引き継いでいるが、クライアントサイドのフレームワークではないためHTMLを実装したりすることはレアケースってかほぼない。ディレクトリ構成や役割がAngularの思想を引き継いでいるためAngular使いならば学習コストは低くなると思いたいが、その他の学習コストが高いため、Angular使いなら簡単に実装できるとは言えない。それは他のRESTful フレームワークを使っていても同じ事かもしれない。

必要な知識は下記の通り

* [NestJS](https://nestjs.com/)
* [Angular](https://angular.io/)
* [Exspress](https://expressjs.com/)
* [TypeORM](https://typeorm.io/)
* SQL

その他、データベース全般の知識、セキュリティなども必要になってくる。
