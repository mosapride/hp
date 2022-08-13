---
title: Introduction
description: NestJSの技術的な情報を書く。あくまで個人の意見なのでもっと良い実装方法があればgithubで書いて欲しい。
---

# Introduction

NestJSの**私が学んだこと**の技術的な情報を書く。ワンオペで２つプロジェクトをNestJSで実装した訳だが、使いまわしができそうなところ、実装が大変だったところの知見を残す。

学習用プロジェクトを[GitHub mosapride/learn-nestjs](https://github.com/mosapride/learn-nestjs)に置いておく。これは[Learn NestJS](/NestJS/learn-nestjs.html)にて使用する動くサンプルとなる。使用方法なども[Learn NestJS](/NestJS/learn-nestjs.html)に記載している。

なにか間違いや、他のより良い実装方法、ベストプラクティス的なものがあれば、[GitHubに公開](https://github.com/mosapride/learn-nestjs)しているのでissuesやpull request、[Twitter](https://twitter.com/v_kurore)などで教えてくれるとマダガスカル。

RESTfulについては大手企業がドキュメントを出してたりする。私の記事より断然よいし、一読しといて損はない。

* [Web API 設計のベスト プラクティス - Azure Architecture Center](https://docs.microsoft.com/ja-jp/azure/architecture/best-practices/api-design)
* [REST API 規則 - IBM Documentation](https://www.ibm.com/docs/ja/urbancode-release/6.2.0?topic=reference-rest-api-conventions)

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>

## (一応)NestJSとは

Angular＋Express＋Database＝NestJS。みたいなイメージ。

Angularの機能を使っているというより、設計概念を取り入れている。Angularはユーザーインターフェイスを作成支援するためのFWであり、NestJSはRESTful APIのFWであるため役割がまったく異なる。Angularの設計概念というのは、ディレクトリ構成やDIの指定方法などがほぼほぼ同じ。componentの構成要素である、HTML-template、HTML-style、componetがcontrollerに置き換わっているぐらいの違い。

controllerとはRESTful APIのリクエスト、レスポンスを返すインターフェイス部分を指す。

Webエンジンは[Express](https://expressjs.com/)と[Fastify](https://www.fastify.io/)の選択が可能。デフォルトではExpressとなるが好みで良い。

Databaseは好みで良いだろう。私のスキル上、RDBMSが好みであるため、MySQLを使用している。

Database接続には[TypeORM](https://typeorm.io/)を使用する。githubリポジトリにある[最古のTagsが0.0.2](https://github.com/typeorm/typeorm/tree/0.0.2)があり、2016/12/6が初版のようだ。ORM FWの中では若い部類になる。新しいものが良いとは言えないが、TypeScriptで作成されているため、型情報を頑張る必要はない。Databaseから取得したデータがいい感じにJSON形式になるのがすごくいい。

若い分、資料が少ないのが難点。日本語の資料は期待しないほうがよい。

必要な知識は下記の通り

* [NestJS](https://nestjs.com/)
* [Angular](https://angular.io/)
* [Exspress](https://expressjs.com/)
* [TypeORM](https://typeorm.io/)
* SQL

その他、データベース全般の知識、セキュリティなども必要になってくる。
