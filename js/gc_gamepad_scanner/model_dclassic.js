/**
 * Scanner module for digital-classic gamepad (ex. 4+8buttons)
 */
var GC_GAMEPAD_dclassic = {};

GC_GAMEPAD_dclassic.id = null;

GC_GAMEPAD_dclassic.enableDev = false;
GC_GAMEPAD_dclassic.enableAng = false;

GC_GAMEPAD_dclassic.init = function(aEnableDev, aEnableAng){
    GC_GAMEPAD_dclassic.enableDev = aEnableDev;
    GC_GAMEPAD_dclassic.enableAng = aEnableDev && aEnableAng;
    
    GC_GAMEPAD_dclassic.stateStr = "";
}

GC_GAMEPAD_dclassic.scan = function(){
    var tDev = navigator.getGamepads()[GC_GAMEPAD_dclassic.dev];
    if (!GC_GAMEPAD_dclassic.enableDev || (tDev == null))
        return null;
    
    // scan dpad
    const tUP = (tDev.buttons[12].pressed) ? 1:0;
    const tDW = (tDev.buttons[13].pressed) ? 1:0;
    const tRT = (tDev.buttons[14].pressed) ? 1:0;
    const tLF = (tDev.buttons[15].pressed) ? 1:0;
    var tRawDpad = (tLF<<3) | (tDW<<2) | (tRT<<1) | (tUP<<0);
    tNewDpad = GC_GAMEPAD_dclassic.to9dir[tRawDpad];

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
    if (GC_GAMEPAD_dclassic.stateStr !== tNewStateStr){
        GC_GAMEPAD_dclassic.stateStr = tNewStateStr;
        return tNewState;
    } else
        return null;
}

GC_GAMEPAD_dclassic.to9dir = [
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
