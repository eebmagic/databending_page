// Get Canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

var invert = function() {
    console.log('Calling invert function');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        data[i]     = 255 - data[i];     // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
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

    const shift = parseInt(imageData.width * 1.5);
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

    const width = parseInt(imageData.width * 4 / 6);
    const weight = 0.3;
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

    const width = 0.3;

    for (var i = 0; i < data.length; i += 4) {
        data[i]   = data[i]   * (1 + ((Math.random() * width) - (width/2)));
        data[i+1] = data[i+1] * (1 + ((Math.random() * width) - (width/2)));
        data[i+2] = data[i+2] * (1 + ((Math.random() * width) - (width/2)));
    }
    ctx.putImageData(imageData, 0, 0);
}

// Draw Image
var img = new Image();
img.src = 'image.jpg';

img.onload = function(){
    var imageRatio = img.height / img.width;
    canvas.height = imageRatio * canvas.width;

    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(imageData);
}
