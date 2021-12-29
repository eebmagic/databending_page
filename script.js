// Get Canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

var invert = function() {
    console.log('Calling invert function');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // const rollPoint = 255;
    const rollPoint = invertPoint;
    for (var i = 0; i < data.length; i += 4) {
        data[i]     = Math.abs(rollPoint - data[i]);     // red
        data[i + 1] = Math.abs(rollPoint - data[i + 1]); // green
        data[i + 2] = Math.abs(rollPoint - data[i + 2]); // blue
    }
    ctx.putImageData(imageData, 0, 0);
};

var shift = function() {
    /**
     Params:
        shift: total number of pixels to shift by.
     */
    console.log('Calling shift function');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data

    // const shift = parseInt(imageData.width * 1.5);
    const shift = shiftSlider + shiftOffset;
    console.log(`pixel volume: ${shiftSlider}`);
    console.log(`pixel roll: ${shiftOffset}`);
    console.log(`Using shift of: ${shift}`);

    for (var i = 0; i < data.length; i+= 4) {
        var newind = (i+shift) % data.length;
        data[i] = data[newind];
        data[i+1] = data[newind+1];
        data[i+2] = data[newind+2];
        data[i+3] = data[newind+3];
    }
    ctx.putImageData(imageData, 0, 0);
}

var echo = function() {
    /**
     Params:
        width: the distance ahead that the echo should source from
        weight: the ratio of the new values that should come from the echo source
     */
    console.log('Calling echo function');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data

    // const width = parseInt(imageData.width * 4 / 6);
    // const weight = 0.3;
    const width = 4*echoSliderWidth + echoSliderRoll;
    const weight = echoSliderWeight;
    console.log(`Using width of: ${width}`);
    console.log(`Using weight of: ${weight}`);

    for (var i = 0; i < data.length; i += 1) {
        var newind = (i+width) % data.length;
        data[i] = (data[i] * (1-weight)) + (data[newind] * weight);
    }
    ctx.putImageData(imageData, 0, 0);
}

var noise = function() {
    /**
     Params:
        width: max of random noise (range 0..2)
            leads to a range of (0.0 .. 2.0).
            Greater values are possible, but at that point another noise
            function can simply be chained behind.
     */
    console.log('Calling noise function');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // const width = 0.3;
    const width = noiseSliderWidth;

    for (var i = 0; i < data.length; i += 4) {
        data[i]   = data[i]   * (1 + ((Math.random() * width) - (width/2)));
        data[i+1] = data[i+1] * (1 + ((Math.random() * width) - (width/2)));
        data[i+2] = data[i+2] * (1 + ((Math.random() * width) - (width/2)));
    }
    ctx.putImageData(imageData, 0, 0);
}

// Define constants for sliders
var shiftSlider = 0;
var shiftOffset = 0;
var invertPoint = 255;
var echoSliderWidth = 10;
var echoSliderWeight = 0.3;
var echoSliderRoll = 0;
var noiseSliderWidth = 0.3;

// Draw Image
var img = new Image();
img.src = 'image.jpg';

img.onload = function(){
    var imageRatio = img.height / img.width;
    canvas.height = imageRatio * canvas.width;

    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(imageData);

    echoSliderWidth = Math.max(parseInt(4/24*imageData.width), echoSliderWidth);

    // SLIDERS
    $(function() {
        console.log(`Found image width: ${imageData.width}`);

        // Invert slider
        $("#slider-invert").slider({
            value: invertPoint,
            step: 1,
            min: 0,
            max: 255,
            slide: (event, ui) => {
                console.log(ui.value);
                invertPoint = ui.value;
            }
        })

        // Shift sliders
        $("#slider-shift").slider({
            value: shiftSlider,
            step: 1,
            min: 0,
            max: imageData.width,
            slide: (event, ui) => {
                console.log(ui.value);
                shiftSlider = ui.value;
            }
        });
        $("#slider-offset").slider({
            value: shiftOffset,
            step: 1,
            min: -4,
            max: 4,
            slide: (event, ui) => {
                console.log(ui.value);
                shiftOffset = ui.value;
            }
        })

        // Echo slider
        $("#slider-echo-width").slider({
            value: echoSliderWidth,
            step: 1,
            min: 0,
            max: parseInt(imageData.width/4),
            slide: (event, ui) => {
                console.log(ui.value);
                echoSliderWidth = ui.value;
            }
        })
        $("#slider-echo-weight").slider({
            value: echoSliderWeight,
            step: 0.1,
            min: 0,
            max: 1.0,
            slide: (event, ui) => {
                console.log(ui.value);
                echoSliderWeight = ui.value;
            }
        })
        $("#slider-echo-roll").slider({
            value: echoSliderRoll,
            step: 1,
            min: -4,
            max: 4,
            slide: (event, ui) => {
                console.log(ui.value);
                echoSliderRoll = ui.value;
            }
        })

        // Noise sliders
        $("#slider-noise-width").slider({
            value: noiseSliderWidth,
            step: 0.05,
            min: 0.05,
            max: 2.0,
            slide: (event, ui) => {
                console.log(ui.value);
                noiseSliderWidth = ui.value;
            }
        })
    })
}

// $(function() {
//             $( "#slider-2" ).slider({
//                value: 60,
//                animate:"slow",
//                orientation: "horizontal"
//             });
//          });
