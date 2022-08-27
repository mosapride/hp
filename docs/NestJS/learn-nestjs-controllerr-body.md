---
title: Controller - @Body
description: BodyはParam、Queryと違い、さまざまなデータフォーマットで送信される。ここではJSON形式で検証を行っている。JSONはkey、valueで表す。valueのTypeは下記の通り。
---

# @Bodyはclass-validator、class-transformerで検証する。

BodyはParam、Queryと違い、さまざまなデータフォーマットで送信される。ここではJSON形式で検証を行っている。

JSONはkey、valueで表す。valueのTypeは下記の通り。

|value-Type|意味|
|---|---|
|string|文字列。日付もここに位置する|
|number|数値|
|array|配列。[]で囲まれている|
|boolean|trueまたはfalse|
|null|nullはnull|
|object|JSONオブジェクト。{}で囲まれている|

残念なことにDate型は存在しない。多くの場合は[ISO 8601](https://ja.wikipedia.org/wiki/ISO_8601)規格のstringで表す。JavaScriptの`Date.prototype.getTime()`のようにミリ秒をnumberで渡す方法も考えられるが、そういうドキュメントは見たことない。

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>


## サンプル

::: tip code
<https://github.com/mosapride/learn-nestjs/blob/main/src/endpoint/sample-request-body.dto.ts>
:::

@Queryのclass-validatorと異なる部分がある。Queryの場合はすべてのvalueは文字列であるため、文字列以外に変換する場合はtransform(変換)する必要がある。stringからnumberに変換する例などがわかりやすい。JSONの場合は、数値は数値として送られるため変換の必要がない。

Body(JSON)はネストして表示する場合が多い。これはQueryには存在しない表記になる。class-validatorのプロパティにはtypeまたはclassのみを指定する必要がある。多少面倒ではあるが、ネストするObjectプロパティに対しては別途、クラスを作成する必要がでてくる。

ネストする場合は`@ValidateNested({ each: true })`と`@Type(() => クラス名)`が必要となる。

```ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, Max, MaxLength, MinLength, ValidateIf, ValidateNested } from 'class-validator';

export enum EnumClass {
  AAA = 'AAA',
  BBB = 'BBB',
  CCC = 'CCC',
  DDD = 'DDD',
}

export class Nest1Sample {
  @ApiProperty()
  @MaxLength(10)
  key1: string;

  @ApiProperty()
  @MinLength(10)
  key2: string;
}

export class SampleBody {
  /**
   * stringの文字列
   */
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(10)
  key1: string;

  /**
   * stringの文字列の配列
   */
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(10, {
    each: true,
  })
  key2: string[];

  /**
   * number型
   */
  @ApiProperty()
  @IsNotEmpty()
  @Max(10)
  key3: number;

  /**
   * stringの文字列の配列
   */
  @ApiProperty()
  @IsNotEmpty()
  @Max(10, {
    each: true,
  })
  key4: number[];

  /**
   * ISO8601形式の日付
   */
  @ApiProperty({ example: '2022-08-23T14:47:32.899Z' })
  @IsNotEmpty()
  @IsISO8601()
  key5: string;

  @ApiPropertyOptional({ enum: Object.values(EnumClass) })
  @IsOptional()
  @IsEnum(EnumClass)
  key6?: EnumClass;

  @ApiPropertyOptional({ enum: Object.values(EnumClass) })
  @IsOptional()
  @IsEnum(EnumClass, { each: true })
  key7?: EnumClass[] = [];

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Nest1Sample)
  nestClass: Nest1Sample;

  @ApiProperty()
  @ValidateNested()
  @Type(() => Nest1Sample)
  @IsNotEmpty()
  nestClassArray: Nest1Sample[];

  @ApiPropertyOptional()
  @IsOptional()
  condition1?: string;

  @ApiPropertyOptional()
  @ValidateIf((object, value) => {
    if (object.condition1) return true;
    return false;
  })
  @IsNotEmpty()
  condition2?: string;

  @ApiProperty()
  keyBatPattern1: {
    // @ApiProperty()  これはできない。
    // @MaxLength(10)  これはできない。
    name: string;
    body: string;

    hoge: {
      twitterID: number;
    };
  };
}
```

## 資料

デコレーターの種類は多い。細かな検証が必要な場合はかなり頑張らないといけない。

* <https://github.com/typestack/class-validator#validation-decorators>

条件により、検証が必要か不要なのかを切り替えることができる。

* <https://github.com/typestack/class-validator#conditional-validation>

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>

