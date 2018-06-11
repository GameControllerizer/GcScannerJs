/**
 * Scanner module for custom device
 */
var GC_GAMEPAD_custom = {};

GC_GAMEPAD_custom.dev = null;

GC_GAMEPAD_custom.enableDev = false;
GC_GAMEPAD_custom.enableAng = false;

GC_GAMEPAD_custom.init = function(aEnableDev, aEnableAng){
    GC_GAMEPAD_custom.enableDev = aEnableDev;
    GC_GAMEPAD_custom.enableAng = aEnableDev && aEnableAng;
    
    GC_GAMEPAD_custom.stateStr = "";
}

GC_GAMEPAD_custom.scan = function(){
    return null;
}