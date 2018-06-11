/**
 * board scanner
 *  - Key(key) : Set[String]
 *  - Modifierkey(mod) : Set[Int]
 * 
 * board scanner generate press event only.
 */
var GC_KEYBOARD = {};

GC_KEYBOARD.key = new Set([]);
GC_KEYBOARD.mod = new Set([]);
GC_KEYBOARD.event = false;

GC_KEYBOARD.handleDown = function(e) {    
    const tCode = GC_KEYBOARD.encode[e.key];
    // key
    if (tCode)
        GC_KEYBOARD.key.add(tCode);
    // mod
    if (e.key == "Control")
        GC_KEYBOARD.mod.add(0);
    if (e.key == "Shift")
        GC_KEYBOARD.mod.add(1);
    if (e.key == "Alt")
        GC_KEYBOARD.mod.add(2);
    GC_KEYBOARD.event |= true;
    e.preventDefault();
}
GC_KEYBOARD.handleUp = function(e) {
    const tCode = GC_KEYBOARD.encode[e.key];
    // key
    if (tCode)
        GC_KEYBOARD.key.delete(tCode);
    // mod
    if (e.key == "Control")
        GC_KEYBOARD.mod.delete(0);
    if (e.key == "Shift")
        GC_KEYBOARD.mod.delete(1);
    if (e.key == "Alt")
        GC_KEYBOARD.mod.delete(2);
    e.preventDefault();
}

GC_KEYBOARD.init = function(enable_KEYBOARD) {
    window.removeEventListener("keydown", GC_KEYBOARD.handleDown);
    window.removeEventListener("keyup", GC_KEYBOARD.handleUp);
    GC_KEYBOARD.key.clear();
    GC_KEYBOARD.mod.clear();
    GC_KEYBOARD.event = false;

    if (enable_KEYBOARD) {
        window.addEventListener("keydown", GC_KEYBOARD.handleDown);
        window.addEventListener("keyup", GC_KEYBOARD.handleUp);
    }
}

GC_KEYBOARD.scan = function(){
    if (GC_KEYBOARD.event && GC_KEYBOARD.key.size > 0) {
        const tNewState = {
            "key": Array.from(GC_KEYBOARD.key),
            "mod": Array.from(GC_KEYBOARD.mod),
            "dur": 2    // defalt press duration = 2frame
        };
        GC_KEYBOARD.event = false;
        return tNewState;
    } else
        return null;
}

GC_KEYBOARD.encode = {
    "A": "a",
    "B": "b",
    "C": "c",
    "D": "d",
    "E": "e",
    "F": "f",
    "G": "g",
    "H": "h",
    "I": "i",
    "J": "j",
    "K": "k",
    "L": "l",
    "M": "m",
    "N": "n",
    "O": "o",
    "P": "p",
    "Q": "q",
    "R": "r",
    "S": "s",
    "T": "t",
    "U": "u",
    "V": "v",
    "W": "w",
    "X": "x",
    "Y": "y",
    "Z": "z",
    "a": "a",
    "b": "b",
    "c": "c",
    "d": "d",
    "e": "e",
    "f": "f",
    "g": "g",
    "h": "h",
    "i": "i",
    "j": "j",
    "k": "k",
    "l": "l",
    "m": "m",
    "n": "n",
    "o": "o",
    "p": "p",
    "q": "q",
    "r": "r",
    "s": "s",
    "t": "t",
    "u": "u",
    "v": "v",
    "w": "w",
    "x": "x",
    "y": "y",
    "z": "z",    
    "0": "0",
    "1": "1",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "ArrowUp": "ArrowUp",
    "ArrowDown": "ArrowDown",
    "ArrowRight": "ArrowRight",
    "ArrowLeft": "ArrowLeft",
    "F1": "F1",
    "F2": "F2",
    "F3": "F3",
    "F4": "F4",
    "F5": "F5",
    "F6": "F6",
    "F7": "F7",
    "F8": "F8",
    "F9": "F9",
    "F10": "F10",
    "F11": "F11",
    "F12": "F12",
    "Escape": "Escape",
    " ": "Space",
    "Tab": "Tab",
    "Enter": "Enter",
    "Backspace": "Backspace"
}
