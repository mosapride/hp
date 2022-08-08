---
title: Controller
description: Controllerは、リクエスト(要求)を受付、レスポンス(応答)を返す。そのままだね。
---

# Controller

Controllerは、リクエスト(要求)を受付、レスポンス(応答)を返す。そのままだね。

公式ドキュメント Controller : <https://docs.nestjs.com/controllers>

リクエストに対する受け取る情報は`@Param()`、`@Query()`、`@Body()`さえ覚えておけばだいたい問題ない。

## リクエストのデータの復習

リクエストのデータを見るには`curl`コマンドから確認できる。

※WSL2からホストOSに`curl`を投げる場合には、ホストOSのIPアドレスを指定すること。またファイアーウォールが有効となっている場合は拒否されるため、一時的に無効にするか、FWの許可を行う必要がある。

### GETのサンプル

`curl --http1.1 --get -v  http://192.168.0.1:3000/user?part=address,game`

中身のリクエスト部を取り出して整形する。**改行を[\r\n]で表示してる**。

```atom
GET /user?part=address,game HTTP/1.1
Host: 192.168..0.1:3000
User-Agent: curl/7.68.0
Accept: */*
[\r\n]
```

### POSTのサンプル

`curl -v -X POST http://192.168.0.1:3000/user -H 'Content-Type: application/json' -d '[{"userID":"1","name":"田中 伸","kana":"タナカシン","kanaAsc":"ﾀﾅｶｼﾝ","addressZipCode":"1010047"},{"userID":"2","name":"松村 達也","kana":"マツムラタツヤ","kanaAsc":"ﾏﾂﾑﾗﾀﾂﾔ","addressZipCode":"1000011"}]' `

中身のリクエスト部を取り出して整形する。ただし、**実際はbody情報は表示されないので注意**。

```atom
POST /user HTTP/1.1
Host: 192.168..0.1:3000
User-Agent: curl/7.68.0
Accept: */*
Content-Type: application/json
Content-Length: 248
[\r\n]
[{"userID":"1","name":"田中 伸","kana":"タナカシン","kanaAsc":"ﾀﾅｶｼﾝ","addressZipCode":"1010047"},{"userID":"2","name":"松村 達也","kana":"マツムラタツヤ","kanaAsc":"ﾏﾂﾑﾗﾀﾂﾔ","addressZipCode":"1000011"}]
[\r\n]
```

### リクエストするデータについて

|名称|val|意味|
|---|---|---|
|method|GET/POSTなど|[HTTP リクエストメソッド](https://developer.mozilla.org/ja/docs/Web/HTTP/Methods)参照したほうが良い。|
|hostname|192.168.0.1|IPアドレスまたはドメイン|
|port|:3000|ポート。HTTP(80)、HTTPS(443)の場合は省略する|
|header|色々|リクエストの属性のようなものを指定する。cookieも含まれる。<br>[HTTP ヘッダー](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers)を見ると頭が痛くなる。|
|endpoint|/user|一般的にURIと言われるが、REST APIではエンドポイントと呼ぶみたい|
|query|?part=address,game|Query、クエリパラメータなどと言う|
|body|色々|送信するデータ。<br>POST時にはここにクエリパラメータが入る。<br>テキストにかぎらずバイナリデータも含む。|

## メソッド別パラメータ

メソッドは[RESTful APIのメソッドを考える](http://localhost:9090/NestJS/method.html)の通り、GET、POST、PUT、DELETEの4種類のメソッドから表にする。

メソッドに対して与えられるパラメータは、endpoint、query、body、headerの4種類がメインとなる。header情報は後々説明する。

※hostname,portに関してはすべて必須となる。

* ○：必須
* △：オプション
* ☓：不要

|method|Decorator|GET|POST|PUT|DELETE|
|---|---|---|---|---|---|---|
|endopoint|@Param|○|○|○|○|
|query|@Query|△|☓|△|△|
|body|@Body|☓|○|○|△|

## endpoint - @Param

::: tip サンプルコードの場所
* learn-nestjs/rest-client/user.rest
* learn-nestjs/src/endpoint/user.controller.ts
:::

endpointはパスのようなもので、固定にも半固定にもできる。

固定の例はユーザーをすべて取得するようなAPI。

`GET http://localhost:3000/user`

半固定の例は特定のユーザー情報を取得する場合などで、`:id`はユーザーIDとなる。

`GET http://localhost:3000/user/:id`

NestJSで可変部のendpointを取得するには`@Param`デコレーターを使用する。

全体のParam情報を取得する場合は`@Param()`を指定するが、any型になり**可読性が良くないのでおすすめしない**。

```ts
@Get(':id')
findOne(@Param() params): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```

`@Param(':キー')`は引数にキーを与えることにより、特定の場所を型情報を保持した状態で取得できる。

```ts
@Get(':id')
findOne(@Param('id') id: number): string { // キーを指定する、idはnumber型と指定できる
  console.log(id);
  return `This action returns a #${id} cat`;
}
```

`@Param(':id')`デコレータは複数指定できる。

```ts
@Get(':id1/:id2')
findOne(@Param('id1') id1: number,@Param('id2') id2: string): string { // キーを複数指定する
  console.log(id);
  return `This action returns a #${id1} - ${id2} cat`;
}
```

先頭や中間のパス部を固定にしたりも。

```ts
@Get('example/:id1/hogehoge/:id2') // こんなの
findOne(@Param('id1') id1: number,@Param('id2') id2: string): string {
  console.log(id);
  return `This action returns a #${id1} - ${id2} cat`;
}
```

## query - @Query

::: tip サンプルコードの場所
* learn-nestjs/rest-client/user.rest
* learn-nestjs/src/endpoint/user.controller.ts
:::

queryの役割は、endpointに対して追加パラメータを与えるイメージで考えると色々と作りやすい。

追加パラメータの役割の例

|param|意味|
|part||


