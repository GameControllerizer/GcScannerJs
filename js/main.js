
/**
 * Global
 */
var WS_CLIENTS = {};
var GC_GAMEPAD = null;
var EVENT_HISTORY = null;
 
var WS_HOST = null;
var WS_PORT = null;

var URL_PARAMS = null;

/**
 * Reload scan taget devices
 */
function resetDev(){
    const tEnableGamepad = document.getElementById("dev_gamepad").checked == true;
    const tEnableMouse = document.getElementById("dev_mouse").checked == true;
    const tEnableKeyboard = document.getElementById("dev_keyboard").checked == true;

    const tEnableMovescan = document.getElementById("dev_moveless").checked == false;

	GC_GAMEPAD.init(tEnableGamepad);
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
 *  - max event history length = 8;
 */
function scanDev(){
    const tPrevHistoryCount = EVENT_HISTORY.count;

    var tEvents = [];
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
 * default gamepad_model = 1
 * default wshost = location.hostname
 * default wsport = 1880
 */
function getIntQueryParam(aQuery, aDefault){
    const tValue = parseInt(URL_PARAMS.get(aQuery));
    if (tValue)
        return tValue;    
    else
        return aDefault;        
}
function getStrQueryParam(aQuery, aDefault){
    const tValue = URL_PARAMS.get(aQuery);
    if (tValue)
        return tValue;    
    else
        return aDefault;        
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
    URL_PARAMS = new URLSearchParams(window.location.search);

    const tFps = getIntQueryParam("fps", 30);
    console.info("set scan FPS = %d", tFps);
    window.addEventListener("gamepadconnected", onGamepadConnected);
	window.addEventListener("gamepaddisconnected", onGamepadDisconnected);
	GC_GAMEPAD = new GcGamepadBase();
    resetDev();
    resetHistory();

    // Create WebSocket clients
    const tWsHost = getStrQueryParam("wshost", location.hostname);
    const tWsPort = getIntQueryParam("wsport", 1880);
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

    const tGamepadId = getIntQueryParam("gamepad_id", 0);
    const tGamepadModel = getIntQueryParam("gamepad_model", 1);
    console.info("target gamepad_id = %d", tGamepadId);
    console.info("target gamepad_model = %s", tGamepadModel);

    switch(tGamepadModel){
        case 1:
			GC_GAMEPAD = new GcGamepadDigital(tGamepadId);
            break;
        case 2:
            GC_GAMEPAD = new GcGamepadAnalog(tGamepadId);
            break;
        case 0:
            GC_GAMEPAD = new GcGamepadCustom(tGamepadId);
            break;
        default:
            console.error("Unknow Gamepad model : %d", tGamepadModel);
            GC_GAMEPAD = new GcGamepadBase(tGamepadId);
            break;
    }
    resetDev();
};
function onGamepadDisconnected(e){
    console.warn("gamepad disconnected : %s",
		e.gamepad.id);
	if (e.gamepad.id==GC_GAMEPAD.id)
		GC_GAMEPAD = new GcGamepadBase(0);
};
