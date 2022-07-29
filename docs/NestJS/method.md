---
title: RESTful APIのメソッドを考える
description: HTTPリクエストメソッドは9つ存在する。SQLの命令言語？は4つ（SELECT,UPDATE,INSERT,DELETE）となる。HTTPとSQLは別のアルゴリズムなので、HTTPメソッドの役割とSQLの命令言語の役割はイコールではないためすり合わせが必要となる。
---

# RESTful APIのメソッドを考える

HTTPリクエストメソッドは9つ存在する。参照：[HTTP リクエストメソッド](https://developer.mozilla.org/ja/docs/Web/HTTP/Methods)

SQLの命令言語？は4つ（SELECT,UPDATE,INSERT,DELETE）となる。※TRUNCATEは無視。

HTTPプロトコルとDataBaseはアルゴリズム以前にサービス自体が別物なので、HTTPメソッドの役割とSQLの命令言語の役割はイコールではない。そのため**すり合わせ**が必要となる。つまりどこかしら矛盾が生じる。仕様やコーディング規約とは違うがプロジェクト内で規約化する必要がある。

**HTTPメソッドとSQL命令をすり合わせた表**

|HTTPメソッド|SQL命令|役割|
|---|---|---|
|GET|SELECT|データを取得する|
|POST|INSERT|データを新規作成する。<br>(主キーはサーバーで作成する)|
|PUT|UPDATE|既存データを更新する<br>(主キーはクライアントが指定する)|
|DELETE|DELETE|データを削除する|

## メソッドと役割

GETとDELETEに関しては悩むことは少ないだろう。POSTとPUTの役割はエンドポイントを中心に考えれば理解しやすい。

### ユーザー情報の新規作成、更新

`POST /api/user` ユーザーの新規作成を行う。

`PUT  /api/user` ユーザーの情報を更新する。

`PUT`の場合、JWT認証などでユーザーの主キーを担保させる。

### 記事を書く、更新する、得る

`POST /api/article` 記事を新規作成を行う。`POST`されるまで記事の主キー(記事番号)は存在しない。

`PUT  /api/article/:articleNo` `:articleNo`が主キー(記事番号)となり、それに対して更新を行う。

誰が記事を書いたかについてはJWT認証などでユーザーの主キーを担保させる。

GETの場合はユーザーを明記する。

`GET  /api/:user/article/:articleNo` :userの記事の何番を取得する。となる。

## 補足：なぜPUTなのか

PUTなのかPATCHについては、どちらを適用するかは考え方次第だが、mdn web docsでは

PUT

> PUT メソッドは対象リソースの現在の表現全体を、リクエストのペイロードで置き換えます。

PATCH

> PATCH メソッドは、リソースを部分的に変更するために使用します。

PUTの場合は対象リソースに対して処理を行う。つまりSQLでは`WHERE`句を用いて対象レコードの更新を行うとなる。**対象リソースの現在の表現全体**の部分に関しては、すべてのカラム更新すればよい。つまり実際に`UPDATE SET 対象カラム`に該当しない部分は、同じ値で更新したことにする、または、実際に同じ値で更新することで表現全体という解釈にすればよい。

PATCHはリソースに対して行うため`WHERE`句が無いと読み解いた(**あくまで私の解釈**)。
`WHERE`句を用いないデータの更新は稀である。存在するとすればシステム更新など多きなメンテナンスが用いる作業になる。ではシステム更新の中でのデータ更新をRESTful APIで行うかというと、それは役割が違うため、RESTful APIではPATCHメソッドの実装は避けるべきではないかと思う。

PUTとPATCHの問題を取り除いたとすれば、HTTPメソッドとSQL命令の紐づけは簡単に見えるが、実際には「データが無ければ新規作成、無ければ更新」などの処理が存在する。これはPOSTであるかもしれないし、PUTでもあるかもしれない。どっちつかずの状態だ。

クライアント側からGETでデータの有無を確認後、POSTかPUTを切り替えれば良いのだが、非常に面倒であるし非効率である。

UPDATEまたはINSERTのどっちつかずの場合は`PUT`に指定する。これは主キーに該当する値がクライアントを持っていることを前提としている。

## データの作成、更新の主キーについて

主キーはサーバーで決める場合と、クライアント(ユーザー)が決める2パターン存在する。

サーバーで決める場合は、ユーザーIDなどの一意の値を指定する場合が多い。ただのcountやUUIDなどで、一意であればなんでもよい場合が多い。

クライアントで決めるパターンは、複合主キーによるものが多いだろう。

```sql{6}
CREATE TABLE `list` (
   `twitterID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
   `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
   `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
   `private` tinyint NOT NULL,
   PRIMARY KEY (`twitterID`,`url`), --  ← twitter IDがサーバーが作成した主キー、urlがクライアントが決めた主キー
   FOREIGN KEY (`twitterID`) REFERENCES `twitter` (`twitterID`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
```

### ユーザーアカウントを主キーにするのはアンチパターンか

twitterのアカウント名といえば一般的に@から始まる英数字となる。これは一意であるが、実は変更可能である。

[Twitterドキュメント](https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-id)を見ると下記のようになる。

|Name|実データ例|意味|
|---|---|---|
|id|123456789123|Twitterアカウントの一意の値|
|name|v_kurore|@v_kurore。一般的にはこれをアカウント名と呼ばれるがシステム上はnameとなる|
|username|クロレ|画面に表示される日本語、絵文字も使えるユーザー名|

また、メールアドレスも変わることを前提に考えておくべきであり、主キーとするのは危険。

### Microsftのベストプラクティスと違うではないか

その通り、Microsoftが公開している[Web API 設計のベスト プラクティス - Azure Architecture Center](https://docs.microsoft.com/ja-jp/azure/architecture/best-practices/api-design)とは異なる部分がある。

[Youtube DATA API](https://developers.google.com/youtube/v3/getting-started)、[Twitter API](https://developer.twitter.com/ja/docs)なども見ながら考察した結果、私の中では上記のような結論となった。これがベストだとは言い切れない。

**賢者は歴史に学び愚者は経験に学ぶ**とあるが、歴史が短すぎる、かつ、様々なシステム要求があるため経験による感想も人それぞれだろうと容認して欲しい。

## 参考資料

- [MDN Web Docs](https://developer.mozilla.org/ja/docs/Web)
- [Twitter API Documentation | Docs | Twitter Developer Platform](https://developer.twitter.com/en/docs/twitter-api)
- [冪等性とは「同じ操作を何度繰り返しても - Qiita](https://qiita.com/suin/items/316cb8aaf8dfcf11abae)
- [PUT か POST か PATCH か？ - Qiita](https://qiita.com/suin/items/d17bdfc8dba086d36115)
