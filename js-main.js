
//-------------------------------------
// DEPENDENCIES:
//   js-performance.js  (if enabled)
//
//-------------------------------------

//runs on program start
$(document).ready(function() {

    //isolate html element and initilize 2d context
    canv = document.getElementById("gc");
    ctx = canv.getContext("2d");

    //initialize program variables, event listeners, etc.
    Setup();

    //begin entire program loop command
    let fps = 100;
    setInterval(main, 1000/fps);

});

//readjusts canvas when window size changes
window.onresize = function() {
    canv.width = $(window).width();
    canv.height = $(window).height();

    //calculate number of dots needed
    let totalArea = canv.width*canv.height,
        dotsNeeded = (dots.dGoal*totalArea)/(Math.PI*Math.pow(dots.r,2));
    while(dots.all.length > dotsNeeded) {
        dots.all.pop();
    }
    while(dots.all.length < dotsNeeded) {
        createDot();
    }
}

//runs on window load
function Setup() {

    //adjust canvas size
    canv.width = $(window).width();
    canv.height = $(window).height();

    //create global dots variable
    dots = {
        all: [],
        r: 10,
        dGoal: 0.4,
        e: {
            max: 12,
            min: 0.3,
            damp: 0.975
        },
        minDist: 40
    };

    //adjust minimum distance according to dot radius
    dots.minDist += dots.r;

    //fill the dots array to correct density
    fillDotsArray();

    //set global mouse variable
    mouse = {
        x: 0,
        y: 0
    };

    //initialize performance graph
    PerformanceGraphInit(5,5,250,100,100);

    //create mouse listener
    $(window).on("mousemove", handleMouse);

}

//Dot object definition
function Dot(x, y) {
    //set initial attributes
    this.x = x;
    this.y = y;
    this.color = "#CCD";
    this.angle = Math.random()*2*Math.PI;
    this.e = dots.e.min;

    //returns if near mouse
    this.near = function(m) {
        let d1 = Math.pow(this.x - m.x, 2),
            d2 = Math.pow(this.y - m.y, 2),
            dist = Math.sqrt(d1 + d2);

        return dist<dots.minDist;
    }

    //shifts dot away from mouse
    this.avoid = function(m) {
        let d1 = Math.pow(this.x - m.x, 2),
            d2 = Math.pow(this.y - m.y, 2),
            dist = Math.sqrt(d1 + d2);
        this.angle = Math.tanh( (this.y-m.y) / (this.x-m.x) );
        this.angle = this.x > m.x ? this.angle : this.angle + Math.PI;
        e = dots.e.max * ((dots.minDist - dist)/dots.minDist);
        this.e = this.e < e ? e : this.e;
    }
}

//adds a Dot object to dots.all array
function createDot() {

    //pick a location
    let x = Math.random()*canv.width,
        y = Math.random()*canv.height;

    //push dot to list
    dots.all.push( new Dot(x,y) );

}

//loops until dots.all array is correct density
function fillDotsArray() {

    //calculate number of dots needed
    let totalArea = canv.width*canv.height,
        dotsNeeded = (dots.dGoal*totalArea)/(Math.PI*Math.pow(dots.r,2));

    //generate n dots
    for(let i=0; i<dotsNeeded; ++i) {
        createDot();
    }

}

//prints a circle to the canvas
function fillCircle( c ) {
	ctx.fillStyle = c.color;
	ctx.beginPath();
	ctx.arc(c.x, c.y, dots.r, 0, 2*Math.PI);
	ctx.fill();
}

//clears canvas by drawing blank background
function clearCanvas() {
    ctx.fillStyle = "#555";
    ctx.fillRect(0,0,canv.width,canv.height);
}

//shifts dots according to energy
//pushes away if near mouse
function compute() {

    //shift all dots according to energy, angle
    for(each of dots.all) {

        //keep within bounds
        each.x += canv.width*((each.x<0)-(each.x>canv.width));
        each.y += canv.height*((each.y<0)-(each.y>canv.height));

        //normal shift
        each.x += each.e*Math.cos(each.angle);
        each.y += each.e*Math.sin(each.angle);

        //dampen
        each.e *= dots.e.damp;
        each.e = each.e < dots.e.min ? dots.e.min : each.e;

        //avoid mouse
        if(each.near(mouse)) {
            each.color = "#F99";
            each.avoid(mouse);
        } else {
            each.color = "#CCD";
        }

    }

}

//clears canvas and prints every circle
function draw() {

    //clear current canvas
    clearCanvas();

    //draw every vertex
    ctx.fillStyle = "#CCD";
    for(each of dots.all) {
        fillCircle(each);
    }

}

//adjusts mouse position value on mousemove
function handleMouse(event) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
}

//houses repetitive program responsibilities
function main() {

    //adjust circle positions
    compute();
    //draw circles on canvas
    draw();
    //draw a performance graph
    //DrawPerformanceGraph();

}
