---
title: Controller
description: Controllerはの役割は大雑把に分けるとこうなる。リクエストを受け取る データのチェックを行う 処理を委託する 処理結果を返す
---

# Controller

Controllerはの役割は大雑把に分けるとこうなる。

1. リクエストを受け取る
1. データのチェックを行う
1. 処理を委託する
1. 処理結果を返す

特に重要なのはデータのチェックを行うところ。データに関しては、数値、文字列、JSON、ファイルなど様々。受け取ったデータの検証を行い、不正なデータの場合は`404 Bad Request`を返し、処理を中断させる必要がある。

その他にもログイン必須の条件などもデータに含まれ、資格がないリクエストに対しては`401 Unauthorized`を返す必要が出てくる。

リクエストに対する受け取る情報は`@Param()`、`@Query()`、`@Body()`さえ覚えておけばだいたい問題ない。

公式ドキュメント Controller : <https://docs.nestjs.com/controllers>

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

## Open API(Swagger)とclass-validatorで幸せになる

RESTful APIで受け渡しするデータ形式は様々あり、自由であるが故にvalidate(検証)が面倒くさい。すべての引数(Endpoint,query,body...)をチェックする必要があり、ルールに沿わない場合は`400 bad request`を返し、バックエンドの処理は続行しない。

データを受け渡しするフロントエンド、バックエンド開発者が相違なく意思疎通を交わすにはAPIドキュメントが不可欠。私の場合は一人で作ってるので不要だと言いたいが、**自分が書いたコードも１分もすれば他人のコード**であり、どのような実装をしたか忘れるのが当たり前。

NestJSはSwaggerとclass-validationをサポートしているため、それらを有効活用する。

### Swagger

公式：[https://docs.nestjs.com/openapi/introduction](https://docs.nestjs.com/openapi/introduction)

リクエストクライアントを用意してくれたり、REST APIドキュメントを生成してくれる。

サンプルを見るとわかりやすい。→<https://editor.swagger.io/>

### class-validator

公式：[https://docs.nestjs.com/techniques/validation](https://docs.nestjs.com/techniques/validation)

そのままの名前で、クラスの検証をする。<https://github.com/typestack/class-validator>

**クラス**を検証するのであって、１つのpropertyを検証するのではない。そのため`@Body`で渡されるJSONデータの検証に利用する。

## Swaggerとclass-validatorのインストールと初期設定

npmまたはyarnを使用する

```bash
npm i @nestjs/swagger class-validator class-transformer
```

`src/main.ts`に打ち込む。

`debug`モード時にのみ有効にするため、`if (process.env.LEVEL === 'debug') {`内にswaggerを読み込むようにする。

validation時に変換を行うようにするため、`app.useGlobalPipes(new ValidationPipe({ transform: true }));`を追記する。

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { dump } from 'js-yaml';
import { AppModule } from './app.module';
import { AppLogger } from './util/app-logger';

const LISTEN_PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new AppLogger('bootstrap');
  if (process.env.LEVEL === 'debug') {
    const config = new DocumentBuilder()
      .setTitle('Learn-NestJS')
      .setDescription('learn nestjs API description')
      .setVersion('1.0')
      .addTag('learn')
      .setBasePath('path')
      .addServer('http://localhost:3000')
      .build();
    const options: SwaggerDocumentOptions = {
      operationIdFactory: (_: string, methodKey: string) => methodKey,
    };
    const document = SwaggerModule.createDocument(app, config, options);
    fs.writeFileSync('./swagger-spec.yaml', dump(document, {}));
    SwaggerModule.setup('learn', app, document);
    logger.log('---- Debug Mode ---');
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(LISTEN_PORT);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

```

<http://localhost:3000/learn>からアクセスすることができる。

`fs.writeFileSync('./swagger-spec.yaml', dump(document, {}));`はswaggerのAPI仕様書ファイルを出力する場所。実行するたびに生成されるのが嫌ならコメントアウトしてよい。

API仕様書はlearn-nestjs/swagger-spec.yamlに作成される。ファイルを確認できたら`redoc-cli`コマンドからAPI仕様書のHTMLファイル(redoc-static.html)を作成することができる。

```bash
$ npm run build:redoc
```

作成するAPIプロジェクトが公開プロジェクトの場合は、作成された`redoc-static.html`を公開すれば良い。

## 記述について

Swaggerとclass-validatorはデコレーター(`@`)を使用する。

Swaggerは`@Api`から始まる。使用できるデコレーター名、対象となる部分(Method/Controller/Model)は公式に記載されている。

公式：<https://docs.nestjs.com/openapi/decorators>

Swaggerのデコレーターは、**実装処理には意味をなさず、ドキュメントとしてのみ意味をなす**。つまりエラーさえでない記述であればデタラメな記述でも処理を実行するのには問題がない。

---

class-validationは上記でも記載したが`@Body`に対するクラスのプロパティに記載する。使用できるデコレーターの種類は数が多いためドキュメントを一読しておくことが良いだろうがユースケースが少ないのが現状。

公式：<https://github.com/typestack/class-validator#validation-decorators>

### 注意点

Swaggerとclass-validatorはある程度連携ができるため、簡易なドキュメントを求めるなら苦労はしないが実用的なレベルではない。**残念なことに同じような記載を手動で記述しないといけない**のが現状。

ReqUserクラスに下記のようなSwaggerと、class-validatorをつけると下記のようになる。

* part
  * 省略不可
  * name,kana,kanaASC の文字列の配列
* searchKana
  * 省略可能
  * 文字列
  * 最大文字数 10
* searchKana
  * 省略可能
  * 数値
  * 最小値 1、最大値 100
  * 省略時には 11

```ts
enum EPart {
  name = 'name',
  kana = 'kana',
  kanaAsc = 'kanaAsc',
}

class ReqUser {
  @ApiProperty({ enum: Object.values(EPart),isArray: true, required: true })
  @IsEnum(EPart, { each: true })
  part: EPart[];

  @ApiProperty({ example: 'タナカ', required: false, maxLength: 10 })
  @IsOptional()
  @MaxLength(10)
  searchKana: string;
  
  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 11, example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(100)
  @Min(1)
  maxResults: number = 11;
}
```

Swaggerと、class-validatorは**別のライブラリ**なので同じ定義をしないといけない。せいぜい`name`が省略できるぐらい。

どうにかならないものか。

### 記述が面倒くせー

Swaggerデコレーター定義はしなくても処理的にはなにも問題がない。API仕様書を大雑把に出力するには`@ApiProperty()`のみ定義すればよい。詳細に記載するにはパラメーターが必須となり、記述方法も複雑になる。そこで提案がある。

1. Swaggerを使用しない
1. @ApiProperty()のみ定義する
1. @ApiProperty()のパラメーターを含め詳細に記載する

#### Swaggerを使用しない

否定できない。実際の作業では仕様書自体が存在しないプロジェクトもあるから。コードが仕様書です。

#### @ApiProperty()のみ定義する

エンドポイントの一覧と、簡易的なドキュメントを生成できる。パラメータの詳細が無いため、調べ物の時間が出てくる。

#### @ApiProperty()のパラメーターを含め詳細に記載する

理想形だが、class-validatorの記述と完全に一致しないと、仕様書とコードが異なる現象が発生する。
