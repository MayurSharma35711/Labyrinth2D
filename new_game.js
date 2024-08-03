const imager = require("./SourceCode/imager");
// init();

var cvs = document.createElement('canvas'),
    img = document.getElementsByTagName("img")[0];   // your image goes here
    // img = $('#yourImage')[0];                     // can use jquery for selection
cvs.width = img.width; cvs.height = img.height;
var ctx = cvs.getContext("2d");
ctx.drawImage(img,0,0,cvs.width,cvs.height);
var idt = ctx.getImageData(0,0,cvs.width,cvs.height);

// usage
imager.getPixel(idt, 852);  // returns array [red, green, blue, alpha]
imager.getPixelXY(idt, 1,1); // same pixel using x,y

imager.setPixelXY(idt, 1,1, 0,0,0,255); // a black pixel
ctx.putImageData(idt, 0,0);  // 0,0 is xy coordinates
img.src = cvs.toDataURL();
document.body.appendChild(cvs)
console.log("hi")