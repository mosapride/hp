---
title: RESTful APIのエンドポイントを考える
description: RESTful APIはURLをめがけてリクエストが飛んでくるが、どのようなエンドポイントにするかはDBのTable、リレーション、用途から決める必要がある。
---

# RESTful APIのエンドポイントを考える

RESTful APIはURLをめがけてリクエストが飛んでくるが、どのようなエンドポイントにするかはDBのTable、リレーション、用途から決める必要がある。

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>

## DBのTable、リレーション。とは

DBのテーブル構成を見るにはER図が非常に有効な手段となる。

下記は[YSchedule(ゆうすけ)](https://yschedule.ement.dev/)のER図である。非常にシンプル。

![YScheduleのER図](/images/NestJS/er.png)

このER図から、グループとそのルートを決める。

ここでの**ルートとは、最上位の親ディレクトリや、superuserの事ではなく、SQLで扱いたいテーブルの根本となるところ**である。

本来のルートの意味とは異なるので間違わないように。

## エンドポイントはルートを中心に考える

ER図からはリレーションを確認できる。そこから、どのようなCREATE、SELECT、UPDATE、DELETEが必要かを考える。アプリケーションから必要なデータを構想するがDatabase構成と一致しているはず。

このリレーション関係から場合は３つに分けてみた。（赤、黄、青の枠線）

![YScheduleのER図](/images/NestJS/er_root.png)

* twitterテーブル - listテーブル - list_infoテーブル - youtuberテーブル
* twitterテーブル - pinテーブル - youtuberテーブル
* videoテーブル - youtuber-テーブル

※youtuberテーブルの枠は省略

REST APIのルールにそって考えると、twitterとvideoがルートとなる。

|エンドポイント|用途|
|---|---|
|/twitter|twitter情報に紐づいた情報(list配下、pin配下含む)を管理する|
|/video|video情報に紐づいた情報を管理する|

例えば`GET /twitter`の場合は、twitterユーザー情報(紐づくデータ含む)をすべて返す。となる。一人のtwitterユーザー情報(紐づくデータ含む)を返す場合は`GET /twitter/:userID`となる。

特定のtwitterユーザーが持つlist情報を取得する場合は`GET twitter/:userID/list`となり。<br>
特定のtwitterユーザーが持つpin情報を取得する場合は`GET twitter/:userID/pin`となる。<br>

この場合はユーザーIDは必ず`:userID`を指定する縛りが出てくる。例えば**全twitterユーザー**のリスト名一覧や、ある文字を含む**全twitterユーザー**リスト一覧を出すなどの仕様には対応できない。

twitterユーザーと疎結合となるデータが必要な仕様の場合は、エンドポイントのルートを増やす必要がある。

|エンドポイント|用途|
|---|---|
|/twitter|twitter情報を管理する|
|/list|twitter情報-list情報に紐づいた情報を管理する|
|/pin|twitter情報-pin情報に紐づいた情報を管理する|
|/video|video情報に紐づいた情報を管理する|

`GET /list`と指定すればすべてのtwitterユーザーのリストを取得できる。特定の条件でリストを取得したいならばURLクエリパラメータを追加すればよい。つまりは。

**`GET /list`が対応するクエリパラメータ**

|key|required|Type|意味|
|---|---|---|---|
|userID|☓|Array\<string\>|list.twitterIDにuserIDを含むリストを返す。|
|keyword|☓|string|list.nameにキーワードを含むリストを返す。|

URLパラメータには配列の概念がないため、特定の文字列を区切り文字にする必要がある。

userIDが、user001とuser002のリスト一覧を取得したい場合は<br>
`GET /list?userID=user001,user002`となる。

userIDが、user001とuser002 AND 「sample」キーワードを含むリストを返す場合は<br>
`GET /list?userID=user001,user002&keyword=sample`となる。


トップレベルのエンドポイントはデータベースのリレーション関係から、どのようにデータを取得したいかを考慮して命名していけば良い。

最適なtable設計ができていれば、ベストではないにしろ、ベターなエンドポイントを決める事ができる。**その最適なtable設計が一番難しいが、その問題を無視すればすべてが解決**する。

[API reference index | Docs | Twitter Developer Platform](https://developer.twitter.com/en/docs/api-reference-index)

### 補足：YSchedule（ゆうすけ）について

YSchedule（ゆうすけ）ってなんぞや？？ってなるはずなので、軽く説明しておく。

[YSchedule(ゆうすけ)](https://yschedule.ement.dev/)は私が作成した、「Youtubeチャンネルのスケジュールを自分で作る」Webサイトのことである。ログインにはTwitter認証を利用している。

Twitterアカウントは、リストを作成し、Youtubeチャンネルを登録する。登録したYoutubeチャンネルの側近のスケジュールを閲覧できる。

|テーブル名|役割|
|---|---|
|twitter|twitterアカウントの管理|
|list|リスト名の管理|
|list_info|リストに登録されているYoutube チャンネルの管理|
|youtuber|Youtube チャンネル情報|
|video|Youtubeの配信動画情報|
|pin|list_infoを作成する補助的な機能|

videoテーブルは疎結合となっている。理由としてはシステム的にテーブルレコードを物理削除する。Youtubeチャンネルは削除またはBANの可能性があるため、Videoテーブルをメインテーブルとし、Join先をYoutuerとした場合に不都合がある事象が発生したため。

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>
