# GcScannerJs
Broweser-based input device scanner for
[GameControllerizer](https://github.com/GameControllerizer/GameControllerizer"). Control operations from a input device is scanned, convered to [DSL4GC](https://github.com/GameControllerizer/DSL4GC), then sent to Node-RED via Websocket (`ws://[wshost]:[wsport]/{gamepad,mouse,keyboard}`). **FireFox** browser is strongly recommended.

## Usage(online)
Access to https://gamecontrollerizer.github.io/GcScannerJs/

## Usage(offline)
Clone this repository, and host it with a HTTP server （ex. npm-http-server, Apatch, nginx,..）.

### e.g. npm-http-server
```
% git clone https://github.com/GameControllerizer/GcScannerJs
% cd GcScannerJs
% npm install http-server
% http-server
# Open 'http://localhost:8080/' in a web browser.
```

See Node-RED example (Example-3) of [this](https://github.com/GameControllerizer/node-red-contrib-game_controllerizer) page for receiver setting.
