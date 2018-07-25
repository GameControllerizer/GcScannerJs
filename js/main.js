
/**
 * Global
 */
var WS_CLIENTS = {};
var GC_GAMEPAD = null;
var EVENT_HISTORY = null;
 
var WS_HOST = null;
var WS_PORT = null;

/**
 * Reload scan taget devices
 */
function resetDev(){
    const tEnableMouse = document.getElementById("dev_mouse").checked == true;
    const tEnableGamepad = document.getElementById("dev_gamepad").checked == true;
    const tEnableKeyboard = document.getElementById("dev_keyboard").checked == true;

    const tEnableMovescan = document.getElementById("dev_moveless").checked == false;

    if (GC_GAMEPAD)
        GC_GAMEPAD.init(tEnableGamepad, tEnableMovescan);
    GC_MOUSE.init(tEnableMouse, tEnableMovescan);
    GC_KEYBOARD.init(tEnableKeyboard);
}

/**
 * Reset event history
 */
function resetHistory(){
    EVENT_HISTORY = document.getElementById("event_history");
    EVENT_HISTORY.value = "";
    EVENT_HISTORY.log = [];
    EVENT_HISTORY.count = 0;
}

/**
 * Main scan loop
 *
 *  - max event history length = 8;
 */
function scanDev(){
    const tPrevHistoryCount = EVENT_HISTORY.count;

    var tEvents = [];
    if (GC_GAMEPAD)
        tEvents.push({"dev":"gamepad",  "msg":GC_GAMEPAD.scan()});
    tEvents.push({"dev":"mouse",    "msg":GC_MOUSE.scan()});
    tEvents.push({"dev":"keyboard", "msg":GC_KEYBOARD.scan()});

    for (let e of tEvents){
        if (e.msg){
            const tMsgStr = JSON.stringify([e.msg]);
            // send message to Node-RED
            const tClient = WS_CLIENTS[e.dev];
            if (tClient && (tClient.readyState==1))
                tClient.send(tMsgStr);
            // display log
            var tLog = `${++EVENT_HISTORY.count} (${e.dev}) : ${tMsgStr}\n`;            
            EVENT_HISTORY.log.push(tLog);
        }
    }

    while (EVENT_HISTORY.log.length > 8)
        EVENT_HISTORY.log.shift();

    if (EVENT_HISTORY.count > tPrevHistoryCount){
        EVENT_HISTORY.value = "";
        for (let l of EVENT_HISTORY.log)
            EVENT_HISTORY.value += l;
    }
}

/**
 * default fps = 30
 * default gamepad_id = 0
 * default ws_host = location.hostname
 * default ws_port = 1880
 */
function getQueryParam(aQuery, aDefault){
    const tUrlParams = new URLSearchParams(window.location.search);
    return (tUrlParams.has(aQuery)) ? tUrlParams.get(aQuery) : aDefault;
}
function createWsClient(aUrl, aDev){
    var tClients = null;
    tClient = new WebSocket(`${aUrl}/${aDev}`);    
    tClient.onopen = function(e){
        console.info(`[${aDev}] is online`)
    };
    tClient.onerror = function(e){
        console.warn(`[${aDev}] is offline`)
    };
    return tClient;
}

window.onload = function () {
    const tFps = getQueryParam("fps", 30);
    console.info("set scan FPS = %d", tFps);
    window.addEventListener("gamepadconnected", onGamepadConnected);
    window.addEventListener("gamepaddisconnected", onGamepadDisconnected);
    resetDev();
    resetHistory();

    // Create WebSocket clients
    const tWsHost = getQueryParam("wshost", location.hostname);
    const tWsPort = getQueryParam("wsport", 1880);
    const tWsUrl = `ws://${tWsHost}:${tWsPort}`;
    console.info("Websocket host url = %s", tWsUrl);

    WS_CLIENTS["gamepad"] = createWsClient(tWsUrl, "gamepad");
    WS_CLIENTS["mouse"] = createWsClient(tWsUrl, "mouse");
    WS_CLIENTS["keyboard"] = createWsClient(tWsUrl, "keyboard");

    setInterval(scanDev, 1000 / tFps)
}

/**
 * Gamepad events
 */
function onGamepadConnected(e) {
    console.info("gamepad connected(%d) :  %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);

    const tGamepadId = getQueryParam("gamepad_id", 0);
    const tGamepadModel = getQueryParam("gamepad_model", 1);
    console.info("target gamepad_id = %d", tGamepadId);
    console.info("target gamepad_model = %d", tGamepadModel);

    switch(tGamepadModel){
        case "1":
            GC_GAMEPAD = GC_GAMEPAD_dsimple;
            break;
        case "2":
            GC_GAMEPAD = GC_GAMEPAD_dclassic;
            break;
        case "3":
            GC_GAMEPAD = GC_GAMEPAD_analog;
            break;
        case "0":
            GC_GAMEPAD = GC_GAMEPAD_custom;
            break;
        default:
            console.error("Unknow Gamepad model : %d", tGamepadModel);
            GC_GAMEPAD = GC_GAMEPAD_dsimple;
            break;
    }

    GC_GAMEPAD.dev = tGamepadId;
    resetDev();
};
function onGamepadDisconnected(e){
    console.warn("gamepad disconnected : %s",
        e.gamepad.id);
    GC_GAMEPAD.dev = null;
};
