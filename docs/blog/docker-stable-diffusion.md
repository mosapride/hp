---
title: DockerでStable diffusionを動かす
description: WindowsでDockerからStable Diffusionを実行したいけどメモリが足りないから色々調べた。
---

# DockerでStable diffusionを動かす

WindowsでDockerからStable Diffusionを実行したいけどメモリが足りないから色々調べた。

## 対象者

* Windows環境
* Stable Diffusionの概要を知っている
* Docker経験者
* ホストOS(Windows)を汚したくない
* グラフィックボードを搭載している
* 強力なグラフィックボードを持っていない

### なぜDockerで動かす必要がある？

* Web上でStable Diffusionを試すことができるがなんだかんだで遅い。
* Pythonを使ってないため、ホストOSで環境構築を行うのが嫌。

それで、Dockerなら使い捨てでコンテナとイメージを削除すればきれいさっぱりすることができると思った。

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>

## 検証環境

恐らくCPUやメモリのスペックはそこまで必要でない印象だが、グラフィックボードの搭載メモリ10GB以上が推奨となっている。

私の所持しているグラボはRTX 2080Superのメモリ8GBのため、実行時にメモリが足らずにエラーが発生するが**torch.float16**にすることによって、メモリ不足エラーを回避する。対処法は後に記述。


## 事前準備

<https://huggingface.co/>にアクセスし、アカウントを作成しておく。メールアドレスと名前の設定のみで、クレジットカードなどの**決済情報の入力はない**。メールが来るのでリンクをクリックして終了。

<https://huggingface.co/CompVis/stable-diffusion-v-1-4-original>にアクセスし、Download the weightsの**sd-v1-4.ckpt**ファイル（約4GB）をダウンロードしておく。

## Dockerfile

Dockerfileは下記の通り、**同じディレクトリに、ダウンロードしたsd-v1-4.ckptを置いておく**ように。

```docker
FROM continuumio/miniconda3

RUN apt-get update -y && apt-get upgrade -y \
    && apt-get install -y git curl gnupg vim libpng-dev

RUN distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
    && curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
    && curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

RUN apt-get update -y && apt-get install -y nvidia-docker2

RUN git clone https://github.com/CompVis/stable-diffusion.git /app

RUN cd /app \
    && conda env create -f environment.yaml 

RUN mkdir -p /app/models/ldm/stable-diffusion-v1

COPY sd-v1-4.ckpt /app/models/ldm/stable-diffusion-v1/model.ckpt

CMD [ "sh" ]

```

ビルドしておく、タグ名は適当

```sh
docker build . -t hoge:latest
```

dockerからホストOSのCPUを利用するには` --gpus all`オプションが必要となる。こんな感じ。

```sh
docker run -it --gpus all hoge:latest bash
```

## torch.float16のスクリプトの用意

ここは**コンテナ内の作業**。

グラフィックボードが推奨に満たしていないため、torch.float16のスクリプトを作成する。

* txt2img.pyをコピーし、txt2imgf16.pyを作成する。
* txt2imgf16.pyにtorch.float16設定を記述する。

```bash
$ cp /app/scripts/txt2img.py /app/scripts/txt2imgf16.py 
```

編集

```bash
$ vim /app/scripts/txt2imgf16.py 
```
`model = model.to(torch.float16)`を追加する。（240行あたり）

```py
    config = OmegaConf.load(f"{opt.config}")
    model = load_model_from_config(config, f"{opt.ckpt}")
    model = model.to(torch.float16)
```

## Stable Diffusionを実行する

```bash
$ conda activate ldm
$ cd /app
$ python scripts/txt2imgf16.py --prompt "Frustration of men seeking marriage" --plms  --H 512 --W 512 --n_samples 1
```

実行中はダイアログがずらずら流れて、成功すると最後に**Enjoy**が出てくる。

画像は`/app/outputs/txt2img-samples`ディレクトリに出力されるので、VS Codeでattachするなり、docker runにvolumeを指定するなりすればよい。


## 参考リンク

* <https://zenn.dev/koyoarai_/articles/02f3ed864c6127bb2049>
* <https://github.com/CompVis/stable-**diffusion>
* <https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html#install-guide>
* <https://docs.docker.com/compose/gpu-support/>
* <https://docs.docker.com/engine/reference/commandline/run/>
* <https://huggingface.co/>

<ClientOnly>
  <CallInFeedAdsense />
</ClientOnly>
