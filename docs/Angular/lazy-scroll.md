---
title: Angularで遅延してスクロール
description: Angularで画面の描画後に特定位置まで自動でスクロールさせたい場合にどうしたら良いかを実装した。
---

# Angularで遅延してスクロール

画面の描画後に特定位置まで自動でスクロールさせたい場合にどうしたら良いかを実装した。

実装した例はこれである。[https://yschedule.ement.dev/l/v_kurore/ksonArk](https://yschedule.ement.dev/l/v_kurore/ksonArk)

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>


`ngAfterVewInit`でscrollを発火させればよいと思ってたが、ずれてしまう。その原因は

* `ngFor`によるループ処理でデータ量が可変となる。
* `ngFor`内に画像があり、レスポンシブデザインのため、高さが可変となる。

DOMが生成されていても、画像の読み込みには時間が掛かる。そのためscrollが思った場所にいかずにズレるようだ。

## HTMLが完成するまでの流れ

これは、憶測である。きちんと検証した訳では無いことを先に宣言しておく。Chrome Developer ToolsのNetworkを見ても、DOM描画、HTMLとしての反映までの同期しながらの検証方法がわからなかったのと、正直面倒だったから。

動的にDOMが作成され、ブラウザに描画されるまでの流れは、下記の通りだと思う。

![HTMLが完成するまでの流れ](/images/Angular/lazy-scroll01.png)

実際には、どのタイミングでHTML描画(ブラウザに反映)されているか不明。おそらく、画像のダウンロードに関しては`img`タグが発見されて、いい感じにタグが閉じられたときに画像のリクエストを開始しているように思える。(実際には知らん。)

リクエストした画像ファイルがリクエストした順番通りに帰ってくる保証はないにしろ、近しい結果にはなるだろうと信じたい。

## loadイベント

画像がロードされたかは`load`イベントを使うことで検知することができる

> load イベントは、ページ全体が、スタイルシートや画像などのすべての依存するリソースを含めて読み込まれたときに発生します。これは DOMContentLoaded が、ページの DOM の読み込みが完了すれば、リソースの読み込みが完了するのを待たずに発生するのと対照的です。

[https://developer.mozilla.org/ja/docs/Web/API/Window/load_event](https://developer.mozilla.org/ja/docs/Web/API/Window/load_event)

## 実装

imgの`load`を利用する。

(修正済み)：謝辞参考

### hoge.component.ts

コンポーネント内にスクロールさせる処理を記載する。200msの遅延は保険としているため不要かもしれない。

```ts
  goScroll(scroller: HTMLElement) {
    window.setTimeout(() => {
      scroller.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  }
```

### hoge.component.html

`*ngFor`には最後のループなのかを判定できる`last`変数が実装されている。画像がロードされていて、かつ最後のループの場合に、`goScroll`メソッドを発火させる。`last === true`時のみ実行したいのだが、`false`時の処理も記載しないといけないので、適当に`true`でも返しておけば良い。`goScroll`イベントに`isLast`引数を追加する方が丁寧かもしれないけど。

```html
<div>
    <p>なにかの文字列.............</p>
</div>

<div *ngFor="let i of items: let last = last">
    <img src="i.img" (load)="last ? goScroll(scroller): true"><!-- 画面ロードしたら発火する -->
</div>

<div #scroller></div><!-- スクロールさせたい場所 -->

<div>
    <p>なにかの文字列.............</p>
</div>
```

## まとめ

(修正、追加)：謝辞参考

この処理でズレが生じないかというと確実ではない。

例えば、ループ内の画像サイズにばらつきがある場合に、lastの画像が先にロードされる場合もある。

```ts
item = [
  '10Mの画像' , '10Mの画像', '10Mの画像', '10Mの画像' , '10byteの画像'
]
```

画像によるズレを回避するには、全部の画像をチェックする方が確実。ブラウザの描画が完成されているためズレはうまれないはずだ！

## 追記：謝辞

ありがとおおおお。

* https://twitter.com/laco2net/status/1551016956945641474
* https://twitter.com/joniburn/status/1551018385441718272


<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>

