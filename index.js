var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var height = canvas.height;
var width = canvas.width;

var iterations;
var zoom = 1;
var x = 0;    // zoom coordinates
var y = 0;

window.onload = run;    // generate first iteration


function normalize(n, x=0, a=-2, b=2) {
    b = x + b * zoom;
    a = x + a * zoom;
    return (b - a) * (n - 0) / (height - 0) + a    // widht and height are the same
}


function mandelbrot(c_real, c_imag) {
    var z_real = c_real;
    var z_imag = c_imag;
    var temp;

    for(var i = 0; i < iterations; i++) {
        if((z_real * z_real + z_imag * z_imag) > 4) {    // Avoid using complex numbers to optimize
            return i;
        }
        temp = z_real * z_real - z_imag * z_imag + c_real;
        z_imag = 2 * z_real * z_imag + c_imag;
        z_real = temp;
    }
    return i;
}


function getIterations(e) {
    if(event.key === "Enter") {
        iterations = e.value;
        run();
    } 
}

function draw(i, j, color) {
    ctx.fillStyle = color;
    ctx.fillRect(i, j, 1, 1);
}


function draw2(i, j, r, g, b) {
    ctx.fillStyle = "rgba(" + r +", " + g +", " + b +", 1)";
    ctx.fillRect(i, j, 1, 1);
}


function run() {
    iterations = document.getElementById("iterValue").value;
    for(var i=0; i < width; i++) {
        for(var j=0; j<height;j++) {
            normalized_i = normalize(i, x);
            normalized_j = normalize(j, y);
            var iter = mandelbrot(normalized_i, normalized_j);
            if(iter == iterations) {
                draw(i, j, "#000000");
            } else {
                // draw(i, j, "#FF0000");
                var rgb = HSVtoRGB(iter/360, 1, 1);
                draw2(i, j, rgb.r, rgb.g, rgb.b);
            }
        }
    }
    return null;
}


function goDeeper(event){    // zoom in
    x = normalize(event.offsetX, x);
    y = normalize(event.offsetY, y);
    zoom = zoom - 0.9 * zoom;
    console.log("x: ", x, "y: ", y, "zoom: ", zoom)
    run();
}


function goHigher(event){    // zoom out
    x = normalize(event.offsetX, x);
    y = normalize(event.offsetY, y);
    zoom = zoom + 0.9 * zoom;
    console.log("x: ", x, "y: ", y, "zoom: ", zoom)
    run();
}


function reset(){
    x = 0;
    y = 0;
    zoom = 1;
    iterations = 1000;
    run();
}


// taken from: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}