---
title: VPNでWSL2は大変かもね
description: 周りはMacのみの環境で、一人Windowsで戦う美少女の物語。
---

# VPNにもWSL2でも大変だ

周りはMacのみの環境で、一人Windowsで戦う美少女の物語。

## VPNに接続できなかった話

環境はWindows 10限定になると思う。

L2TP/IPsecのVPNはレジストリをいじらないと駄目だった。

レジストリをイジる方法は公式に載っている。

<https://learn.microsoft.com/ja-JP/troubleshoot/windows-server/networking/configure-l2tp-ipsec-server-behind-nat-t-device>

## VPNを接続した状態でgitコマンドが使用できなくなった

git pull/pushなどを使用しても応答がない。MTUが大きことが原因のようだ。普通だったらMTUが大きい場合は自動で相手に合わせるらしいが、私の場合はVPNとWSL2上で発生した。

私の環境では、1280にして事なきを得た。下記コマンドはWSL2のOS上（多くはUbuntuかな）で実行すればよい。

```bash
sudo ip link set eth0 mtu 1280
```

詳しくは下記参考

<https://blog.jicoman.info/2020/12/hangup-ssh-connection-using-wsl2/>

