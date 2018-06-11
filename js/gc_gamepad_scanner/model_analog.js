/**
 * Scanner module for analog gamepad (ex. 1-dpad + 8buttons + 2analogs)
 */
var GC_GAMEPAD_analog = {};

GC_GAMEPAD_analog.dev = null;

GC_GAMEPAD_analog.enableDev = false;
GC_GAMEPAD_analog.enableAng = false;

GC_GAMEPAD_analog.init = function(aEnableDev, aEnableAng){
    GC_GAMEPAD_analog.enableDev = aEnableDev;
    GC_GAMEPAD_analog.enableAng = aEnableDev && aEnableAng;
    
    GC_GAMEPAD_analog.stateStr = "";
}

GC_GAMEPAD_analog.scan = function(){
    var tDev = navigator.getGamepads()[GC_GAMEPAD_analog.dev];
    if (!GC_GAMEPAD_analog.enableDev || (tDev == null))
        return null;

    // scan dpad
    const tLF = (tDev.axes[4] < -0.5) ? 1:0;
    const tRT = (tDev.axes[4] >  0.5) ? 1:0;
    const tUP = (tDev.axes[5] < -0.5) ? 1:0;
    const tDW = (tDev.axes[5] >  0.5) ? 1:0;
    var tRawDpad = (tLF<<3) | (tDW<<2) | (tRT<<1) | (tUP<<0);
    tNewDpad = GC_GAMEPAD_analog.to9dir[tRawDpad];

    // scan buttons
    var tNewBtn = [];
    for (var i=0; i<tDev.buttons.length; i++){
        if (tDev.buttons[i].pressed)
            tNewBtn.push(i);
    }
        
    // scan analog (no analog sticks)
    var tNewAng = [0, 0, 0, 0];
    if (GC_GAMEPAD_analog.enableAng){
        tNewAng[0] = GC_GAMEPAD_analog.to8bit(tDev.axes[0]);
        tNewAng[1] = GC_GAMEPAD_analog.to8bit(tDev.axes[1]);
        tNewAng[2] = GC_GAMEPAD_analog.to8bit(tDev.axes[2]);
        tNewAng[3] = GC_GAMEPAD_analog.to8bit(tDev.axes[3]);
    }
    const tNewState = {
        "dpad" : tNewDpad,
        "btn" : tNewBtn,
        "ang" : tNewAng,
        "dur" : -1
    };
    const tNewStateStr = JSON.stringify(tNewState);
    if (GC_GAMEPAD_analog.stateStr !== tNewStateStr){
        GC_GAMEPAD_analog.stateStr = tNewStateStr;
        return tNewState;
    } else
        return null;
}

GC_GAMEPAD_analog.to9dir = [
    5, // 0x0
    8, // 0x1
    6, // 0x2
    9, // 0x3
    2, // 0x4
    5, // 0x5
    3, // 0x6
    5, // 0x7
    4, // 0x8
    7, // 0x9
    5, // 0xA
    5, // 0xB
    1, // 0xC
    5, // 0xD
    5, // 0xE
    5  // 0xF
];

GC_GAMEPAD_analog.to8bit = function(v){
    return (v * 127) | 0;
}
