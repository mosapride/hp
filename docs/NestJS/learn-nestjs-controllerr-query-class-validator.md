---
title: Controller - @Query class-validator
description: Queryをclass-validatorを使って検証する場合。 @Param()は使用しない @Param(キー名)のキー名を明示する number型とstring型のみを使用する number型の場合はParseIntPipeをつける template:@Param('キー', ParseIntPipe) 変数名 number
---

# @Queryをclass-validatorを使って検証する場合。

Pipeを使った検証とは異なり、Queryデコレーターにキーを指定せず、`@Query() 変数:型`の形を取る。型クラスを格納するファイル名は`.dto.ts`にする必要がある。

検証するにはプロパティに対してデコレーターを設定する。使用するデコレーターは[class-validator](https://github.com/typestack/class-validator)と[class-transformer](https://github.com/typestack/class-transformer)が必要となる。

必要なモジュールが入っていない場合はいれる。

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>

```bash
$ npm i class-validator class-transformer
```

## classを使うにあたっての補足

### class-validator

class-validatorはプロパティが指定した規則に従っていることを検証し、規則違反を行った場合は400 ERRPRを返す。

### class-transformer

class-transformerはプロパティに入る値を変換する。QueryはURL規則があるものの、制限がゆるいし、すべて文字列となる。数値として扱いたい場合などは変換する必要があるため、transformerが必要となる。

### セパレーターについて

セパレーターとは区切り文字のこと。Queryに対して配列として受け渡したい場合は、同じキーを指定する方法、セパレーターを使用する方法がある。

例えばfruitsキーに対して、appleとorangeを渡す場合、同じキーを複数指定する方法がある。

```atom
?fruits=apple&fruits=orange
```

セパレーターを`,`にする方法もある

```atom
?fruits=apple,orange
```

セパレーターに規則が無いが、よく見るのが`,`、`+`、`%20`(半角スペース)など。どこかで`.`も見たことがある。

どのように指定配列として見なすかは仕様次第であるが、**Swaggerクライアントでは、同じキーを複数指定する方法を採用している**。そのため自身でセパレーターを決めたい場合は別途処理が必要になる。

ここの例ではセパレーターを`const SEPARATOR = /,| /g;`を変数宣言して`,`または`%20`はセパレーターとして認識させている。

## 省略不可なパラメーター

::: tip code
<https://github.com/mosapride/learn-nestjs/blob/main/src/endpoint/sample-request-query-class-validator.dto.ts>
:::

省略不可なQueryパラメーターのコード。

配列に関してはセパレーターを有効にするため、`@Transform`デコレーターを使用し、小細工をしている。

配列に`@IsArray`を指定しただけだと、一つしかデータが必要ではない場合に、単一のstring値として扱われ、string[]と認識してくれない。謎。つまり、`@IsArray`はQueryでは使いづらいため使用しない。

省略可能なnumber型でQueryに対するプロパティを省略すると、なぜか0になる。本来は400 ERRORにしたいが、`@Transform`でこちゃごちゃしないといけないため、簡易的に記載している。

```ts
import { HttpStatus } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

const SEPARATOR = /,| /g;

export enum EnumClass {
  AAA = 'AAA',
  BBB = 'BBB',
  CCC = 'CCC',
  DDD = 'DDD',
}

export class ReqSampleValidator {
  /**
   * 省略不可能
   * string
   */
  @ApiProperty()
  @IsNotEmpty()
  key1: string;

  /**
   * 省略不可能
   * string[]
   */
  @ApiProperty()
  @IsNotEmpty()
  @Transform((v) => {
    if (Array.isArray(v.value)) return v.value;
    return v.value.split(/,| /g);
  })
  key2: string[];

  /**
   * 省略不可能
   * enum
   */
  @ApiProperty()
  @IsEnum(EnumClass)
  key3: EnumClass;

  /**
   * 省略不可能
   * enum[]
   */
  @ApiProperty({ enum: Object.values(EnumClass) })
  @Transform((v) => {
    if (Array.isArray(v.value)) return v.value;
    return v.value.split(SEPARATOR);
  })
  @IsEnum(EnumClass, { each: true })
  key4: EnumClass[];

  /**
   * 省略不可能
   * number
   *
   * ```ts
   * endpoint        // 400 ERROR
   * endpoint&key5=  // 0
   * ```
   */
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  key5: number;

  /**
   * 省略不可能
   * number[]
   */
  @ApiProperty()
  @IsNotEmpty()
  @Transform((val) => {
    const v = val.obj[val.key];
    if (Array.isArray(v)) return v.map((v) => +v);
    if (typeof v === 'number') return [v];
    if (typeof v === 'string') return v.split(SEPARATOR).map((v) => +v);
    throw new HttpErrorByCode[HttpStatus.BAD_REQUEST](`[${val}] Validation failed (An array of numbers is expected.)`);
  })
  @IsNumber({}, { each: true })
  @Type(() => Number)
  key6: number[];
}

export class ReqSampleValidatorOptional {
  /**
   * 省略可能
   * string
   */
  @ApiPropertyOptional()
  key1?: string = undefined;

  /**
   * 省略可能
   * string
   */
  @ApiPropertyOptional()
  @IsArray()
  @Transform((v) => {
    if (Array.isArray(v.value)) return v.value;
    return v.value.split(/,| /g);
  })
  key2: string[] = [];

  /**
   * 省略不可能
   * enum
   */
  @ApiPropertyOptional()
  @IsEnum(EnumClass)
  key3: EnumClass = EnumClass.AAA;

  /**
   * 省略不可能
   * enum[]
   */
  @ApiPropertyOptional({ enum: Object.values(EnumClass) })
  @Transform((v) => {
    if (Array.isArray(v.value)) return v.value;
    return v.value.split(SEPARATOR);
  })
  @IsEnum(EnumClass, { each: true })
  key4: EnumClass[] = [];

  /**
   * 省略不可能
   * enum[]
   */
  @ApiPropertyOptional({ enum: Object.values(EnumClass) })
  @Transform((v) => {
    if (Array.isArray(v.value)) return v.value;
    return v.value.split(SEPARATOR);
  })
  @IsEnum(EnumClass, { each: true })
  key5: EnumClass[] = [EnumClass.AAA];

  /**
   * 省略不可能
   * number
   */
  @ApiPropertyOptional()
  @Transform((val) => {
    if (isNaN(val.value)) {
      throw new HttpErrorByCode[HttpStatus.BAD_REQUEST](`[${val.value}] Validation failed (An numbers is expected.)`);
    }
    return +val.value
  })
  key6?: number = undefined;

  /**
   * 省略不可能
   * number[]
   */
  @ApiPropertyOptional()
  @Transform((val) => {
    const v = val.obj[val.key];
    if (Array.isArray(v)) return v.map((v) => +v);
    if (typeof v === 'number') return [v];
    if (typeof v === 'string') return v.split(SEPARATOR).map((v) => +v);
    throw new HttpErrorByCode[HttpStatus.BAD_REQUEST](`[${val}] Validation failed (An array of numbers is expected.)`);
  })
  @IsNumber({}, { each: true })
  @Type(() => Number)
  key7: number[] = [];
}

```

## 省略可なパラメーター

省略可能なため、単一プロパティ変数名には`?`をつける。配列の場合は空の配列`[]`を設定している。

Enumの場合はデフォルトでは何かしらの設定値が存在するため、初期値を設定している。

```ts

export class ReqSampleValidatorOptional {
  /**
   * 省略可能
   * string
   */
  @ApiPropertyOptional()
  key1?: string = undefined;

  /**
   * 省略可能
   * string[]
   */
  @ApiPropertyOptional()
  @IsArray()
  @Transform((v) => {
    if (Array.isArray(v.value)) return v.value;
    return v.value.split(/,| /g);
  })
  key2: string[] = [];

  /**
   * 省略可能
   * enum
   */
  @ApiPropertyOptional()
  @IsEnum(EnumClass)
  key3: EnumClass = EnumClass.AAA;

  /**
   * 省略可能
   * enum[]
   */
  @ApiPropertyOptional({ enum: Object.values(EnumClass) })
  @Transform((v) => {
    if (Array.isArray(v.value)) return v.value;
    return v.value.split(SEPARATOR);
  })
  @IsEnum(EnumClass, { each: true })
  key4: EnumClass[] = [];

  /**
   * 省略可能
   * enum[]
   */
  @ApiPropertyOptional({ enum: Object.values(EnumClass) })
  @Transform((v) => {
    if (Array.isArray(v.value)) return v.value;
    return v.value.split(SEPARATOR);
  })
  @IsEnum(EnumClass, { each: true })
  key5: EnumClass[] = [EnumClass.AAA];

  /**
   * 省略可能
   * number
   */
  @ApiPropertyOptional()
  @Transform((val) => {
    if (isNaN(val.value)) {
      throw new HttpErrorByCode[HttpStatus.BAD_REQUEST](`[${val.value}] Validation failed (An numbers is expected.)`);
    }
    return +val.value
  })
  key6?: number = undefined;

  /**
   * 省略可能
   * number[]
   */
  @ApiPropertyOptional()
  @Transform((val) => {
    const v = val.obj[val.key];
    if (Array.isArray(v)) return v.map((v) => +v);
    if (typeof v === 'number') return [v];
    if (typeof v === 'string') return v.split(SEPARATOR).map((v) => +v);
    throw new HttpErrorByCode[HttpStatus.BAD_REQUEST](`[${val}] Validation failed (An array of numbers is expected.)`);
  })
  @IsNumber({}, { each: true })
  @Type(() => Number)
  key7: number[] = [];
}

```

## 1controller、1Query-validatonクラスが多い

ファイル数が無駄に多くなると管理がし辛いが、Queryに対しては１controllerに対して、１query-validationファイルになる場合が多いはず。

ファイル命名規則で`AAA.controller.ts`ならば`AAA.controller.dto.ts`など規則を持たせると混乱しづらくなるし、関連性も目を見て明らかになる。

## Pipe vs class-validation

どちらが良いかはわからんが、どちらか一つに決めたほうが混乱し辛い。どちらともコードはコピペがベストな気がする。

コピペを押したい理由としては、コントローラ毎に仕様が異なるため、common.dto.tsなどを使用しても無駄に肥大化し、多少異なる仕様があった場合に応用ができないからだ。そもそも同じQueryパラメーターの要求があるならば、エンドポイントを共通化できる可能性が高いため仕様から見直したほうが良い。**知らんけど**。


<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>
