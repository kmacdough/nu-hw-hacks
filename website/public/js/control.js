/**
 * Constructor for controller.
 * @param {Element} el 
 */
var Control = function(el) {
    this.root = el;
    this.root.className = "control";
    this.onchange = null;
    this.state = {left:[0,0], right:[0,0]};
    this.makeSticks();
    this.debug = document.createElement("div");
    this.root.appendChild(this.debug);
};

/**
 * Initializes a controller on the given element.
 * @param {String} element CSS selector for element.
 * @return {Control} control object.
 */
Control.init = function(element) {
    return new Control(document.querySelector(element));
}

Control.prototype.makeSticks = function() {
    var stick = document.createElement("div");
    this.root.appendChild(stick);
    this.leftStick = new Stick(stick, 150);
    this.leftStick.onchange = this.change.bind(this);

    stick = document.createElement("div");
    this.root.appendChild(stick);
    this.rightStick = new Stick(stick, 150);
    this.rightStick.onchange = this.change.bind(this);
};

Math.roundH = function(x) {
    return Math.round(100 * x) / 100;
}

Control.prototype.change = function(e) {
    var result = {
        left: [this.leftStick.x, this.leftStick.y],
        right: [this.rightStick.x, this.rightStick.y]
    };
    this.state = result;
    this.debug.textContent = "Left: " + Math.roundH(result.left[0]) 
        + ", " + Math.roundH(result.left[1])
        + " Right: " + Math.roundH(result.right[0]) 
        + ", " + Math.roundH(result.right[1]);
    if(this.onchange != null) {
       this.onchange.apply(this, [result])
    }
};

/**
 * Constructs a control stick.
 * @param {Element} root 
 * @param {Number} size
 */
var Stick = function(root, size) {
    this.root = root;
    this.root.className = "stick";
    this.size = size;
    this.range = size/2;
    this.deadZone = 0.05;

    this.x = 0;
    this.y = 0;

    this.onchange = null;
    root.style.width = this.size+"px";
    root.style.height = this.size+"px";

    var knob = document.createElement("span");
    knob.className = "knob";
    this.root.appendChild(knob);
    this.root.onmousedown = this.mouseDown.bind(this);
    this.knob = knob;
    this.positionKnob(this.range, this.range);
    
    this.mouseMoveEvent = this.mouseMove.bind(this);
    this.mouseUpEvent = this.mouseUp.bind(this);
};

Stick.prototype.positionKnob = function(x,y) {
    this.knob.style.top = (y - 15)+"px";
    this.knob.style.left = (x - 15)+"px";
};

Stick.prototype.createElements = function() {
};

Stick.prototype.mouseDown = function(e) {
    this.knob.style.transitionDuration = "0s";
    document.addEventListener("mousemove", this.mouseMoveEvent);
    document.addEventListener("mouseup", this.mouseUpEvent);
    e.preventDefault();
};

Stick.prototype.mouseUp = function() {
    this.knob.style.transitionDuration = "0.25s";
    this.positionKnob(this.range, this.range);
    document.removeEventListener("mousemove", this.mouseMoveEvent);
    document.removeEventListener("mouseup", this.mouseUpEvent);
    var that = this;
    this.x = 0;
    this.y = 0;
    setTimeout(function(){that.onchange.apply(that, [{"x":0, "y":0}]);}, 100);
};

Math.clamp = function(min, x, max) {
    return Math.min(max, Math.max(min, x));
};

Stick.prototype.mouseMove = function(e) {
    var rect = this.root.getBoundingClientRect();
    var x = Math.round(Math.clamp(0, e.clientX - rect.left, this.size))/this.range - 1;
    var y = 1 - Math.round(Math.clamp(0, e.clientY - rect.top, this.size))/this.range;
    if(Math.abs(x) < this.deadZone) x = 0;
    if(Math.abs(y) < this.deadZone) y = 0;
    this.positionKnob(this.range + this.range*x, this.range - this.range*y);
    this.x = x;
    this.y = y;
    
    if(this.onchange != null) {
       this.onchange.apply(this, [{"x":x,"y": y}])
    }
};