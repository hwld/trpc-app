# 動作環境構築

GitHub OAuth アプリ の GITHUB_ID と GITHUB_SECRET を.env に追加する。

## メモ

tRPC + mantine を使っているのだが、@trpc/next がサーバーサイドのレンダリングに使用しているっぽい？react-ssr-prepass っていうパッケージが React 17 を使っているため、サーバーサイドで React 18 の hooks が使えなくてエラーになる。  
そのため、withTRPC は使用せず、Vanilla client と React Query を使用する。
