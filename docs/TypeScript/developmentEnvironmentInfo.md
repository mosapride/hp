---
title: 開発環境構築の前に
description: TypeScriptの開発環境を構築する前に事前に知っておきたい情報を記載する。後から開発環境の作り直しを無くすために必要。
---

# 開発環境構築の前に

TypeScriptの開発環境を構築する前に事前に知っておきたい情報を記載する。

ここではnpm経由のインストールを前提に話す。

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>

## インストールの流れ

TypeScriptの開発環境手順は下記のようになる。

1. nvmインストール
2. node.jsインストール
3. npm init
4. npm install typescript --save

### nvmについて

nvmとは異なるバージョンのnode.jsをインストール・切り替えを行うツール。nvmでnode.jsのインストール・バージョン切り替えを行う。

node.jsは公式ページからダウンロードを行うことができるが**この方法はお勧めしない**。nvmを使わずにnode.jsをインストールすると1つのバージョンのみしか使えないからだ。

#### お勧めしない具体的な理由

1. node.jsのバージョン更新は頻繁(メジャーバージョンは6ヶ月に1度)に行われる。LTSは年に1度のペース。
2. node.jsのバージョンに依存したフレームワークが多々ある。
3. 複数プロジェクトや長期運用、システムのバージョンアップなどで複数node.jsの管理が必要になる場合がある。

### node.jsについて

v10,v12,v14などの偶数はLTS(長期サポート)、v11,v13,v15などの奇数は開発版となる。  
参考：[Node.js Releases](https://nodejs.org/en/about/releases/)

### npmについて

npmはnode package managerの略でnode.jsをインストールすると自動に入ってくる。

## npmのグローバルインストールは控えるべき

npmのインストール先の指定として「**グローバル**」と「**ローカル**」の2種類が存在する。

```bash
npm install hoge -g // グローバルインストール
npm install hoge // ローカルインストール
```

### グローバルとローカルの違い

グローバルインストールをした場合、実行ファイルがパスの指定なしで実行できる。上記でhogeパッケージをインストールした場合コンソール画面でhogeコマンドが直接操作できる。

```bash
hoge -v
バージョンが出る
```

グローバルにnpmでhoge@1をインストールし、ローカルにhoge@2をインストールした場合、コマンドを直接叩くとグローバルが実行される。

```bash
hoge -v
バージョンが出る
```

### ローカルのパッケージを実行する

ローカルにインストールしたhoge@2を実行したい場合はpackage.json-script文にスクリプトを記載すればよい。

```json
// package.json
  "scripts": {
    "hoge": "hoge"   // 追加する
   }
```

npm run-scriptコマンドでhogeを呼ぶ。引数を付ける場合はハイフンを２つ付けるのが一番簡単。

```bash
npm run-script hoge -- -v
// ローカルインストールしたhogeのバージョンが表示
```

### グローバルインストールは控えるべき理由

グローバルインストールしたパッケージはpackage.jsonに記載されない。つまりグローバルインストールすることを前提にREADME.mdなどに注意事項を書く必要が出て来るため構築時に作業量が増える。また**グローバルインストールのバージョンが管理外になるため同一の環境になる保証がない**。開発時に必要なパッケージなどは`npm install --save-dev`で管理しておくことによりバージョンが統一できるし、`npm install`のみでインストール作業を終えることができる。

#### 例外的なグローバルインストール

グローバルインストールは悪と言う訳ではない。グローバルインストールが必要な場合もある。例えば

* IDEが要求してきたとき
* 実行環境で共通して使用するパッケージがある場合

#### IDEが要求してきたとき

たまにIDEがグローバルインストールを要求してくる時がある(あった？)。そういうときは素直に従ったほうが得策。

#### 実行環境で共通して使用するパッケージがある場合

あえて**実行環境**と明示した。nodeのデーモン化で使用するforeverなどはグローバルインストールした方がよい。開発環境で使用せず、複数nodeプロジェクトで共通使用するようなパッケージはグローバルインストールの方が管理しやすい。

### npmグローバルインストールまとめ

グローバルインストールは便利だ。実行ファイルまでのパスが省略され気軽に使うことができるし、複数のプロジェクト共通パッケージを使用する場合は容量の節約にもつながる。しかし、それ以上に管理外になるため面倒くさい状態になることが多々あった。`git clone`、`npm install`で**開発環境が整うように**し、package.jsonのscriptにきちんとスクリプトを書いていれば幸せになれる。
