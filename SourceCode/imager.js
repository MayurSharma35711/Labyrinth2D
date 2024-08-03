function getPixel(imgData, index) {
    var i = index*4, d = imgData.data;
    return [d[i],d[i+1],d[i+2],d[i+3]] // [R,G,B,A]
}

function getPixelXY(imgData, x, y) {
    return getPixel(imgData, y*imgData.width+x);
}

function setPixel(imgData, index, r, g, b, a) {
    var i = index*4, d = imgData.data;
    d[i]   = r;
    d[i+1] = g;
    d[i+2] = b;
    d[i+3] = a;
}

function setPixelXY(imgData, x, y, r, g, b, a) {
    return setPixel(imgData, y*imgData.width+x, r, g, b, a);
}