/**
 * Scanner module for digital-simple gamepad (ex. 1-dpad + 8buttons)
 */
var GC_GAMEPAD_dsimple = {};

GC_GAMEPAD_dsimple.id = null;

GC_GAMEPAD_dsimple.enableDev = false;
GC_GAMEPAD_dsimple.enableAng = false;

GC_GAMEPAD_dsimple.init = function(aEnableDev, aEnableAng){
    GC_GAMEPAD_dsimple.enableDev = aEnableDev;
    GC_GAMEPAD_dsimple.enableAng = aEnableDev && aEnableAng;
    
    GC_GAMEPAD_dsimple.stateStr = "";
}

GC_GAMEPAD_dsimple.scan = function(){
    var tDev = navigator.getGamepads()[GC_GAMEPAD_dsimple.dev];
    if (!GC_GAMEPAD_dsimple.enableDev || (tDev == null))
        return null;
    
    // scan dpad
    const tUP = (tDev.axes[1] < -0.5) ? 1:0;
    const tDW = (tDev.axes[1] >  0.5) ? 1:0;
    const tRT = (tDev.axes[0] >  0.5) ? 1:0;
    const tLF = (tDev.axes[0] < -0.5) ? 1:0;
    var tRawDpad = (tLF<<3) | (tDW<<2) | (tRT<<1) | (tUP<<0);
    tNewDpad = GC_GAMEPAD_dsimple.to9dir[tRawDpad];

    // scan buttons
    var tNewBtn = [];
    for (var i=0; i<Math.min(12, tDev.buttons.length); i++){
        if (tDev.buttons[i].pressed)
            tNewBtn.push(i);
    }
        
    // scan analog (no analog sticks)
    var tNewAng = [0, 0, 0, 0]

    const tNewState = {
        "dpad" : tNewDpad,
        "btn" : tNewBtn,
        "ang" : tNewAng,
        "dur" : -1
    };
    const tNewStateStr = JSON.stringify(tNewState);
    if (GC_GAMEPAD_dsimple.stateStr !== tNewStateStr){
        GC_GAMEPAD_dsimple.stateStr = tNewStateStr;
        return tNewState;
    } else
        return null;
}

GC_GAMEPAD_dsimple.to9dir = [
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
