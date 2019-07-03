# PoseNet デモ

## コンテンツ

### デモ 1: カメラ

この「カメラ」アプリケーションは、Webカメラのビデオストリームからリアルタイムな姿勢推定を行うデモです。

![cameraDemo](camera.gif)


### デモ 2: Coco 画像データセット

[COCO 画像データセット](http://cocodataset.org/#home) アプリケーションは、1枚の写真から姿勢推定を行うデモです。
下の画像では、1人のみ(single-person)モードと多人数(multi-person)モードの2つの検出アルゴリズムを比較しています。

![cocoDemo](coco.gif)


## セットアップ

`demos` フォルダに `cd` します:

```sh
cd posenet/demos
```

依存するモジュールをインストールし、ビルドディレクトリを準備します:

```sh
yarn
```

- 2019.07 補足: 依存モジュール `fsevents` のインストールに失敗する場合は代わりに `yarn upgrade` を実行する。


ファイルの更新を監視するために開発モードでサーバを起動します:

```sh
yarn watch
```

## PoseNet をローカルで開発変更をしたい場合

`demos` によるテスト。

`demposenetos` フォルダに `cd` します:

```sh
cd posenet
```

依存するモジュールをインストールします:

```sh
yarn
```

ローカルで posenet を利用可能な状態にパブリッシュします:

```sh
yarn build && yarn yalc publish
```

`demos` に移動して依存するモジュールをインストールします:

```sh
cd demos
yarn
```

ローカルでパブリッシュされた posenet のリンクを `demos` に追加します:

```sh
yarn yalc link @tensorflow-models/posenet
```

開発モードでデモのサーバを起動します:

```sh
yarn watch
```

posenet ソースコードからアップデートを取得するには:

```
# cd up into the posenet directory

cd ../
yarn build && yarn yalc push
```

<br>

## 「カメラ」デモアプリの独自拡張

query で `<video>` タグの `src`, `width`, `height` の各属性値を指定すると、カメラが有効でない環境下でも録画済みムービーファイルで試行できるようにした。

URI 例: `http://localhost:1234/camera.html?src=movie.mp4&width=640&height=360`
