
//-----------------------------------------------------
// USE THIS PROGRAM TO PLOT PERFORMANCE TIME ON SCREEN
// FOR USE IN JS CANVAS ONLY
// AUTHOUR: JACOB KROL
// FOR INQUIRIES: jacobskrol@gmail.com
//-----------------------------------------------------


//-----------------------------------------------------
// CREATE NECESSARY GLOBAL VARIABLES
// START PERFORMANCE TIMER
//-----------------------------------------------------
function PerformanceGraphInit(marginx,marginy,width,height,size) {
    //define box proportions
    box = {
        border: 2,
        width: width,
        height: height,
        margin: {
            x: marginx,
            y: marginy
        }
    };
    box.width -= 2*box.border;
    box.height -= 2*box.border;
    //reset absolute max
    absmax = 0;
    //start performance timer
    t0 = performance.now();
    //create empty data array
    arr = Array.from("0".repeat(size));
}


//-----------------------------------------------------
// UPDATE DATA
// DRAW BOX OVER CANVAS
// ADJUST Y-AXIS RELATIVE TO ABSOLUTE MAX
// PLOT POINTS AS (PERF vs. TIME)
//-----------------------------------------------------
function DrawPerformanceGraph() {

    //update perfomance data
    t1 = performance.now();
    arr.push(t1-t0);
    arr.shift();
    t0 = t1;

    //draw black box
    ctx.fillStyle = "#000";
    ctx.fillRect(
                box.margin.x,
                box.margin.y,
                box.width+2*box.border,
                box.height+2*box.border);

    //draw internal graph
    ctx.fillStyle = "#EEF";
    ctx.fillRect(
                box.margin.x+box.border,
                box.margin.y+box.border,
                box.width,
                box.height);

    //set color for plot
    ctx.strokeStyle = "lime";

    //adjust absolute max
    let max = Math.max(...arr);
    absmax = absmax > max ? absmax : max;

    //initialize pen
    let x0 = box.margin.x + box.border,
        x = x0,
        y0 = box.margin.y + box.border + box.height,
        y = y0 - box.height*(arr[0]/absmax);
    ctx.beginPath();

    //iterate over performance values
    for(let i=0; i<arr.length; ++i) {
        x = x0 + box.width*((i+1)/arr.length);
        y = y0 - box.height*(arr[i]/absmax);
        if(y0-y) ctx.lineTo(x,y);
        ctx.stroke();
    }

    //end process to avoid bugs in parent program
    ctx.closePath();
}
