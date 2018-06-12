# GcScannerJs
GcScannerJs は，ディジタルゲーム拡張のためのミドルウェア [GameControllerizer](https://github.com/nobu-e753/GameControllerizer) の補助
機能であり，一般的なUSB接続のGamepad/Keyboard/Mouse の入力信号を電子化（[DSL4GC](https://github.com/nobu-e753/GcScannerJs)）し， 
指定する Websocket のホスト（Node-RED サーバーを想定）に送信するWebアプリケーションです．
HTML+Javascript で構成されており，インストール不要＆ブラウザ上で動作します．

Read this in other languages: [English](./README.en.md), [日本語](./README.md)

# 利用方法
適当な HTTP server （npm-http-server, Apatch, nginx,..）で本リポジトリをホストすることで動作します．オプション等は起動後のWeb画面を確認ください．

## 例（npm-http-server）
```
% npm install http-server
% git clone https://github.com/nobu-e753/GcScannerJs
% cd GcScannerJs
% http-server
```
この後，Webブラウザで `http://localhost:8080/` を開くとアプリケーション画面が表示されます．

オプションの指定がなき場合は locahost:1880 に Node-RED サーバーが起動しているものとして動作します．GcScannerJs からのデータを Node-RED 側で受け取るには Websocket で
 
 - /gamepad
 - /mouse
 - /keyboard

のエンドポイントを用意してください．[こちら](https://github.com/nobu-e753/node-red-contrib-game_controllerizer/blob/master/README.md)のサンプルも合わせて参照ください．

# 注意事項
Gamepad のタイプ判定ロジックが十分でないため，方向キーやアナログスティックを認識しないことがあります．
その場合は必要に応じて CustomGamepad を作成・利用してください．
