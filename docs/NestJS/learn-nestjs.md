---
title: Learn NestJSについて
description: 学ぶにあたって文字だけじゃ理解が深まらない。ので、学習用プロジェクトをGitHub mosapride/learn-nestjsに公開している。MySQLのDockerファイルと、動く状態のNestJS学習用プロジェクト、勉強用のデータなどがメインとなる。Databaseがすでに手元にある場合は、assets/learn-nestdb-dump.sqlを取り込めば良い。
---

# Learn NestJSについて

学ぶにあたって文字だけじゃ理解が深まらない。ので、学習用プロジェクトを[GitHub mosapride/learn-nestjs](https://github.com/mosapride/learn-nestjs)に公開している。MySQLのDockerファイルと、動く状態のNestJS学習用プロジェクト、勉強用のデータなどがメインとなる。Databaseがすでに手元にある場合は、`assets/learn-nestdb-dump.sql`を取り込めば良い。

※他のプロジェクトと使用するポートのバッティングを防ぐため、デフォルトポートを変更している。また、docker-compose.ymlにて変更が可能。

## 開発環境

リポジトリ：<https://github.com/mosapride/learn-nestjs>

* 検証OS：Windows 10
* Docker(docker-compose)
  * <https://www.docker.com/get-started/>
* VS Code
  * <https://code.visualstudio.com/download>
* Node.js(v12)
  * <https://nodejs.org/ja/>
* git
  * <https://git-scm.com/>
* Windowsの場合のみWSL2があったほうが楽

各インストール方法はググってくれ。

Windowsのコマンドプロンプト、PowerShellは非常に使いづらい(さっさとbashを標準搭載しろよ)。そのためWSL2からbashコマンドを使えるようにした方が幸せになれる。

::: tip WSL2
WSL2のインストール方法はかなり変わったので、ブログなどは参考にせずにMicrosoftの公式ドキュメントが一番信用できる。

[WSL のインストール | Microsoft Docs](https://docs.microsoft.com/ja-jp/windows/wsl/install)
:::

本書のコマンドはbashでの記載をメインにしている。

### Node.jsについて

Node.jsのバージョンの更新頻度は高いため、Node.jsを直接インストールするのではなく、nvm(node version manager)を利用するほうが良い。nvmとは異なるバージョンのNode.jsをインストール、バージョンの切り替えができるアプリ。

Node.js公式から直接インストールしてしまうと、別バージョンを使用する場合に、一度アンインストールを行い、使用する別バージョンのNode.jsを再度インストールする必要がでてくるので非常に面倒になる。

nvmにはいくつか種類があるが代表的なものを下記に記載しておく。OSにより使用できるアプリが異なるので注意。

* Windowsの場合：<https://github.com/coreybutler/nvm-windows>
* Macの場合：<https://github.com/nvm-sh/nvm>

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>

## 環境セットアップ

作業ディレクトリにて、学習用リポジトリをダウンロード、moduleのインストールを行う。

```bash
$ git clone https://github.com/mosapride/learn-nestjs.git
$ cd learn-nestjs
$ npm i
```

`learn-nestjs/docker`フォルダがあり、MySQLコンテナと[Adminer](https://www.adminer.org/)コンテナを用意している。docker-composeで立ち上げる。

```bash
$ cd learn-nestjs/docker
$ docker-compose up -d
```

コンテナ名：learn-nestdbとadminerが立ち上がる。

### データのimport

データベースは空の状態なので、assetsフォルダにある`learn-nestdb-dump.sql`をDockerのlearn-nestdbコンテナにimportする。

```bash
$ cd learn-nestjs/assets
$ docker exec learn-nestdb sh -c 'exec mysql nestdb -uroot -pexample' < learn-nestdb-dump.sql
```

## dockerコンテナについて

### learn-nestdbコンテナ

MySQLのコンテナ、初期値では`nestdb`データベースが作成される。

環境値は下記の通り

|項目|値|
|---|---|
|ユーザ名|root|
|パスワード|example|
|PORT|3307|

### Adminerコンテナ

[Adminer](https://www.adminer.org/)とはブラウザからDatabaseを操作する。よく似たシステムにphpMyAdminがある。一応用意した。

<http://localhost:8090>にアクセスするとログイン画面が表示される。

![データベースMySQL](/images/NestJS/adminer.png)

ログインに必要な情報は下記の通り。

|項目|値|
|---|---|
|データベース種別|MySQL|
|サーバ|learn-nestdb|
|ユーザ名|root|
|パスワード|example|
|データベース|nestdb|

### Adminer以外を利用する場合

私は[MySQL Workbench](https://www.mysql.com/jp/products/workbench/)を使っているので、Adminerは用意しただけで使用していない。

接続するにはサーバー指定を、`localhost:3307`に指定する必要がある。

---

補足

learn-nestdbコンテナと、AdminerコンテナはDockerのデフォルトネットワークを使用している。docker-compose.ymlファイルにホスト名を指定しているため、IPアドレスを使わずにホスト名で通信することができる。learn-nestdbのMySQLが**実際内部で**使用しているポートは3306のためAdminerコンテナから接続する場合は3306であるが、外部(ホストOS含む)から接続する場合は、`learn-nestdb`ではホスト名の解決ができない。コンテナにアクセスするためにはIPアドレスまたは`localhost`などを指定する。また、docker-compose.ymlの`ports`にて公開するポートを3307ポートに変更を行っている。

そのためホストOSからlearn-nestdbコンテナにアクセスする場合は、`localhost:3307`と指定する必要がある。**6ではなく7**。

## 環境変数

Databaseに接続するためのファイルは、トップディレクトリの`.debug.env`に記載してある。必要があれば変更するといい。

```env
## typeorm connection credential options.
##   @see https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3307
MYSQL_USERNAME=root
MYSQL_PASSWORD=example
MYSQL_DATABASE=nestdb
TYPEORM_LOGGING=true
TYPEORM_SYNCHRONIZE=true
```

dockerコンテナ周りの設定は、`docker/docker-compose.yml`ファイルとなる。Database名やパスワードなどを変更したい場合は[Docker Hub - MySQL](https://hub.docker.com/_/mysql)を参照すればよい。

## VS Codeの拡張機能

使用する拡張機能は`.vscode/extensions.json`に記載してあり、プロジェクトを開いたらインストールするか要求するようにしている。

**extensions.json**

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "mosapride.zenkaku",
    "humao.rest-client",
    "editorconfig.editorconfig"
  ]
}
```

* フォーマッター兼Lint
  * vscode-eslint,prettier-vscode,editorconfig
* 全角スペースを見るやつ
  * zenkaku（ワシが作った。）
* テキストベースでGET、POSTなどのHTTPリクエストができる
  * humao.rest-client

[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)の代わりに[Postman](https://www.postman.com/)などのツールを使用しても良い。
