---
title: Controller - @Param
description: Paramのベストプラクティスと思われるもの。@Param()は使用しない @Param(キー名)のキー名を明示する number型とstring型のみを使用する number型の場合はParseIntPipeをつける template:@Param('キー', ParseIntPipe) 変数名 number
---

# @Paramのベストプラクティスと思われるもの

こうなる

```ts
  @ApiOperation({
    summary: '複数のParamパラメータ',
    description: `@Paramはたぶん、これが一番安定。`,
  })
  @Get('param-pattern-validate/:id/hoge/:data')
  async param4(@Param('id', ParseIntPipe) id: number, @Param('data') data: string): Promise<string> {
    return `id = ${id}, data = ${data}`;
  }
```

記述規約はこんなかんじ。

* `@Param()`は使用しない
* `@Param(キー名)`のキー名を明示する
* number型とstring型のみを使用する
* number型の場合は`ParseIntPipe`をつける
  * template:`@Param('キー', ParseIntPipe) 変数名: number`
* string型の場合は素直に記述する
  * template:`@Param('キー') 変数名: string`
* `@Param`は必ず値が入ってくるため`?`などの省略可能はしてはいけない

::: tip code
<https://github.com/mosapride/learn-nestjs/blob/main/src/endpoint/sample-request-param.controller.ts>
:::

## 以下は補足になる

なぜこうしているか、または、アンチパターンを学ぶもの一興。

※[learn-nestjs](https://github.com/mosapride/learn-nestjs)の環境が整っているとURLそのままで実行できます。

### キー指定の無い@Param()は使用しない

`@Param()`デコレーターのkeyは省略可能で、その場合はany型になる。

```ts
  @ApiOperation({
    summary: '@Param()では全てのデータを取得できる',
    description: `@Param()では全てのデータを取得できるが、any型となるため、property名に気をつけないといけない。またSwagger UPから入力パラメータが指定することができない。`,
  })
  @Get('param-bad-pattern/:key/:id')
  async requestParamBadPattern(@Param() param: any): Promise<string> {
    return JSON.stringify(param);
  }
```

受け取るParamクラスを作成しclass-validatorによる検証を行うことによりany型を回避することができるが、ParamはURL内に記載されるパスのため複雑性がない。わざわざclass-validator化するのは面倒。

### 使用する型はnumberとstringの2種

エンドポイントの可変部分を取得する`@Param()`デコレーターに渡される引数はnumberとstringの２種となる場合が大半。というより、この2種で賄えるはず。

### number要求かつParseIntPipe必須

number型を要求しているが、数値以外のデータが来た場合には`404 bat request`を返すべきである。

ParseIntPipeを設定していることにより、検証を行うことができる。

<http://localhost:3000/learn#/sample-request/param2>

<http://localhost:3000/sample-request/param-pattern/number-validation/123a>

![不正なデータ時の404エラーを取得](/images/NestJS/param-number-validation.png)

#### number要求かつParseIntPipeなしは危険

ParseIntPipeが無いと数値以外の文字列がパラメーターとして渡ってきた時にはエラーとはせず`NaN`となる。エンドポイントの可変部分から`NaN`を求める仕様があれば知りたい。

<http://localhost:3000/learn#/sample-request/param1>

<http://localhost:3000/sample-request/param-pattern/number/1234aa>

![ParseIntPipeが無いとエラーとはならずNaNが設定される](/images/NestJS/param-number-NaN.png)

```ts
  @ApiOperation({
    summary: '数値を取得する(validationなし)',
    description: `validationなしで数値を取得しようとすると、数値以外が入力された場合にNaNになる。`,
  })
  @Get('param-pattern/number/:key')
  async param1(@Param('key') key: number): Promise<string> { // 危険じゃないか？！
    return `key = ${key}`;
  }
```

### string型は特になにもしなくてよい理由

URL規則に則っているなら数値っぽくても文字っぽくても良い。つまり、与えられた値を素直に受け取れば良い。

### 省略不可な理由

単純で指定するエンドポイントが変わってしまうから。

例えばスラッシュが連続するURLは正常だろうか？。<br>例：`http://localhost/hoge//abcd`←スラッシュが連続するのがAPIが求めてるURLか？

違うエンドポイントと判断されるのが違和感がない。

![連続したスラッシュは違和感がある](/images/NestJS/multi_slash.png)
