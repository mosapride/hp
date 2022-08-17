---
title: Controller - @Query
description: Queryのベストプラクティスが見つからない。 @Param()は使用しない @Param(キー名)のキー名を明示する number型とstring型のみを使用する number型の場合はParseIntPipeをつける template:@Param('キー', ParseIntPipe) 変数名 number
---

# @Queryのベストプラクティスが見つからない。

Queryデータを取得するには`@Query`デコレーターを使用する。使用方法は大雑把に分けると、キー指定したもの、キー指定なしのものに分ける事ができる。

```ts
// キー指定あり
async method1(@Query('key1') key1: string) : Promise<any> {
  console.log({key1});
}

// キー指定なし
async method2(@Query() key1: any) : Promise<any> {
  console.log({JSON.stringify(key1)});
}
```

キー指定ありの場合は、`@Query('キー指定' , パイプ)`を指定することにより、初期値や検証などを行うことができる。

キー指定なしの場合は、any型となり、何でも自由に入ってしまい、型の安全性はないや検証はない。安全性を担保するために`@Query() 変数名 : クラス名`を宣言し、class-validationを利用するのだが、別途classを作成する必要があるがパターンが多ければ多いほど面倒であり、class-validationを使用しても不十分な場合がある。

## Pipeのみで値を検証する

NestJSではいくつか役立つPipeがある。下記はNestJS標準のPipe一覧。

<https://docs.nestjs.com/pipes>

* ValidationPipe
* ParseIntPipe
  * 数値を検証、取得する
* ParseFloatPipe
  * 浮動小数点を検証、取得する
* ParseBoolPipe
  * true/falseを検証、取得する
* ParseArrayPipe
  * 配列を検証、取得する
* ParseUUIDPipe
  * UUIDを検証、取得する
* ParseEnumPipe
  * Enum(決められた文字列)かどうか検証、取得する
* DefaultValuePipe
  * 値が指定されていない場合の初期値を設定する
* ParseFilePipe
  * ファイルデータがどうか検証、取得する(@Queryでは仕様しない) 

これだけで**Query値を検証するには役不足である**。そのため、カスタムPipeを作成する。

::: tip カスタムPipe
<https://github.com/mosapride/learn-nestjs/tree/main/src/pipe>
:::

SwaggerとQueryの書き方を下記に示す。

<table>
  <tr>
    <th>型</th>
    <th>OpenAPI<br>code</th>
    <th>省略時</th>
  </tr>
  <tr>
    <td colspan="3" style="background-color:#f1f3f4;font-weight:bold;">省略不可能</td>
  </tr>
  <tr>
    <td>string</td>
    <td>
      @ApiQuery({ name: 'key', required: true })<br>
    @Query('key' , ParseStringPipe) val: string</td>
    <td>400 ERROR</td>
  </tr>
  <tr>
    <td>string[]</td>
    <td>@ApiQuery({ name: 'key', isArray: true, required: true })<br>@Query('key', ParseStringPipe, ParseArrayPipe) val: string[]</td>
    <td>400 ERROR</td>
  </tr>
  <tr>
    <td>enum</td>
    <td>
    @ApiQuery({ name: 'key', enum: Object.values(EnumClass), required: true })<br>
    @Query('key' , new ParseEnumPipe(EnumClass)) val: EnumClass
    </td>
    <td>400 ERROR</td>
  </tr>
  <tr>
    <td>enum[]</td>
    <td>
        @ApiQuery({ name: 'key', type: [String], enum: EnumClass, isArray: true, required: true })<br>
    @Query('key' , new ParseArrayEnumPipe(EnumClass, { optional: false})) part: EnumClass[]</td>
    <td>400 ERROR</td>
  </tr>
  <tr>
    <td>number</td>
    <td>
    @ApiQuery({ name: 'key', required: true })<br>
    @Query('key', new ParseNumberPipe({ optional: false })) val: number</td>
    <td>400 ERROR</td>
  </tr>
  <tr>
    <td>number[]</td>
    <td>@ApiQuery({ name: 'key', type: Number, isArray: true, required: false })<br>
    @Query('key', new ParseArrayNumberPipe({ empty: false })) val: number[]</td>
    <td>400 ERROR</td>
  </tr>
  <tr>
    <td colspan="3" style="background-color:#f1f3f4;font-weight:bold;">省略可能</td>
  </tr>
  <tr>
    <td>string</td>
    <td>@ApiQuery({ name: 'key', required: false })<br>@Query('key') val: string | undefined</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>string[]</td>
    <td>@ApiQuery({ name: 'key', isArray: true, required: false })<br>@Query('key', new DefaultValuePipe([])) val: string[]</td>
    <td>[]</td>
  </tr>
  <tr>
    <td>enum</td>
    <td>@ApiQuery({ name: 'key', enum: Object.values(EnumClass), required: false })<br>@Query('key', new DefaultValuePipe(EnumClass.AAA), new ParseEnumPipe(EnumClass)) val: EnumClass</td>
    <td>EnumClass.AAA</td>
  </tr>
  <tr>
    <td>enum[]</td>
    <td>@ApiQuery({ name: 'key', type: [String], enum: EnumClass, isArray: true, required: false })<br>
    @Query('key', new ParseArrayEnumPipe(EnumClass, { optional: true })) val: EnumClass[]</td>
    <td>[]</td>
  </tr>
  <tr>
    <td>enum[]</td>
    <td>@ApiQuery({ name: 'key', type: [String], enum: EnumClass, isArray: true, required: false })<br>
    @Query('key', new DefaultValuePipe([EnumClass.AAA]), new ParseArrayEnumPipe(EnumClass, { optional: false })) val: EnumClass[]</td>
    <td>[EnumClass.AAA]</td>
  </tr>
  <tr>
    <td>number</td>
    <td>@ApiQuery({ name: 'key', required: false })<br>@Query('key', new ParseNumberPipe({ optional: true })) val: number | undefined</td>
    <td>undefined</td>
  </tr>
  <tr>
    <td>number[]</td>
    <td>@ApiQuery({ name: 'key', type: Number, isArray: true, required: false })<br>@Query('key', new ParseArrayNumberPipe({ empty: true })) val: number[]</td>
    <td>[]</td>
  </tr>
  <tr>
    <td colspan="3" style="background-color:#f1f3f4;font-weight:bold;">数値の範囲指定</td>
  </tr>
  <tr>
    <td>number</td>
    <td>
      @ApiQuery({
    name: 'key',
    required: false,
    schema: { minimum: 1, maximum: 99, exclusiveMaximum: true, exclusiveMinimum: true, default: 10 },
  })<br>
    @Query('key', new ParseBetweenNumberPipe(10, 1, 99)) val: number</td>
    <td>指定値</td>
  </tr>
</table>

::: tip サンプルコード
ぐちゃぐちゃだが勘弁して欲しい。非常に面倒だったのだ。<br>
<https://github.com/mosapride/learn-nestjs/blob/main/src/endpoint/sample-request-query.controller.ts>
:::

## Queryの役割と種類について

上の表で、大体のQueryに対応できるはず。上の表にした理由だが役割から考えた。

### Queryの役割 1. 条件の追加

あるエンドポイントから**条件に該当するデータを取得**する場合。SQLならばWHERE句に該当する。

`/users?nameSearch=田中`の場合は、名前に田中が含まれるユーザー一覧を返す。**条件の文字列は制限がない**。

platformsには、「pc,smartphone,tablet」が3種があるとする場合<br>
`/users?platforms=pc`は、PCプラットフォームユーザー一覧を返す。上記と違う箇所は**条件に該当する文字列の制限がある**。

`/users?minimumAge=10`ならば、年齢が10歳以上のユーザー一覧を返す。

`/users?maximumAge=20`ならば、年齢が20歳以下のユーザー一覧を返す。

### Queryの役割 2. 取得データカラムの増加

あるエンドポイントから**取得するデータの種類**を追加する場合。SQLならばJOIN句に該当する。

`/users/part=job`の場合は、ユーザー情報に加えて職業情報を追加して返す。

`/users/part=job,jobHistory`この場合も配列を考慮しておく必要がある。

データの種類を増やすため、**必ず文字列には規則**がある。

### Queryの種類 1. 省略の可否

Queryは省略が可能な場合、不可能な場合がある。

省略が可能な場合は、Where句やJOIN句に該当する処理が不要な場合。または、初期値が設定されている場合。

省略が不可能な場合で、Queryパラメーターを渡さなかった場合は、400 ERRORを返す必要がある。

### Queryの種類 2. 指定する文字列が決められている場合

TypeScriptのEnumのように、検索する文字列に種別があり、指定する文字列が決められている場合がある。

コーディングときに、変数値と値を同じ指定にすれば良い。

```ts
enum EnumClass {
  AAA = 'AAA',
  BBB = 'BBB',
  CCC = 'CCC',
}
```

### Queryの種類 3. 単体か配列か

Query値が単体か配列かの切り分けも必要になる。

### Queryの種類 4. 範囲が決まっている場合

わかりやすい例としてはリクエストサイズを指定する場合である。resultMaxは1～100まで、省略時は10とする。などの仕様はよく見る。

再度注目して欲しいところは**範囲指定の場合は、省略時のデフォルト値が必ず存在する**ところだ。

範囲指定があり、省略時のデフォルト値が不要な仕様があれば教えて欲しい。

## Queryの検証はPipeだけでは終了しない

残念なことに、Queryの検証は各値のチェックだけでは済まされない場合がある。

例として、Youtubeの動画検索パラメータを見てみると良い。

<https://developers.google.com/youtube/v3/docs/videos/list?hl=ja>

Queryのフィルタとして、**chart、id、myRatingのいづれか１つのみ指定する**必要がある。パラメータが**ある条件により必須・省略可能が変わる仕様**がある場合は、Pipeやclass-validationのみでは検証が不可能であるため、別途チェックするコーディングが必要となる。

この問題はOpenAPIのissueに上がっており、2015年からOpenの状態である。

@see <https://github.com/OAI/OpenAPI-Specification/issues/256>

