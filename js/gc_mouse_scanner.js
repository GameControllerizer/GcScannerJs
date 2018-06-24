/**
 * Mouse scanner 
 *  - Button(btn) : Set[Int]
 *    - left   : 0
 *    - right  : 1
 *    - middle : 2
 *  - Move(mov)  : Array[Int]
 *    - x : mov[0] (delta position) 
 *    - y : mov[1] (delta position, flipped)
 */
var GC_MOUSE = {};

GC_MOUSE.btn = new Set([]);
GC_MOUSE.mov = [0, 0];
GC_MOUSE.event = false;

GC_MOUSE.handleMouseDown = function(e) {
    GC_MOUSE.btn.add(e.button);
    GC_MOUSE.event |= true;
    e.preventDefault();
}
GC_MOUSE.handleMouseUp = function(e) {
    GC_MOUSE.btn.delete(e.button);
    GC_MOUSE.event |= true;
    e.preventDefault();
}
GC_MOUSE.handleMouseMove = function(e){
    const dx = e.movementX;
    const dy = e.movementY;
    GC_MOUSE.mov[0] += dx;
    GC_MOUSE.mov[1] += dy;
    GC_MOUSE.event |= true;
}

GC_MOUSE.init = function(enable_mouse, enable_mov) {
    window.removeEventListener("mousedown", GC_MOUSE.handleMouseDown);
    window.removeEventListener("mouseup", GC_MOUSE.handleMouseUp);
    window.removeEventListener("mousemove", GC_MOUSE.handleMouseMove);
    GC_MOUSE.btn.clear();
    GC_MOUSE.mov = [0, 0];
    GC_MOUSE.event = false;

    if (enable_mouse) {
        window.addEventListener("mousedown", GC_MOUSE.handleMouseDown);
        window.addEventListener("mouseup", GC_MOUSE.handleMouseUp);
    }
    if (enable_mouse && enable_mov) {
        window.addEventListener("mousemove", GC_MOUSE.handleMouseMove);
    }
}

GC_MOUSE.scan = function(){
    if (GC_MOUSE.event) {
        const tNewBtn = Array.from(GC_MOUSE.btn);
        const tNewMov = GC_MOUSE.mov;
        const tNewState = {
            "btn": tNewBtn,
            "mov": tNewMov,
            "dur": -1
        };
        GC_MOUSE.event = false;
        GC_MOUSE.mov = [0, 0];
        return tNewState;
    } else
        return null;
}
