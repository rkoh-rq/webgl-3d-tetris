// formula from https://www.rapidtables.com/convert/color/hsv-to-rgb.html

export default function getRainbow(numColors, value = 1.0, saturation = 1.0) {
  const C = value * saturation;
  var X;
  var H;
  var m;
  var RGB;
  var RGB_list = [];
  if (numColors <= 1) {
    return;
  }
  for (let i = 0; i < numColors; i++) {
    H = (360 / (numColors - 1)) * i;
    X = C * (1 - Math.abs(((H / 60) % 2) - 1));
    m = value - C;
    if (H < 60) {
      RGB = [C, X, 0];
    } else if (H < 120) {
      RGB = [X, C, 0];
    } else if (H < 180) {
      RGB = [0, C, X];
    } else if (H < 240) {
      RGB = [0, X, C];
    } else if (H < 300) {
      RGB = [X, 0, C];
    } else {
      RGB = [C, 0, X];
    }
    RGB_list.push([RGB[0] + m, RGB[1] + m, RGB[2] + m, 1]);
  }
  return RGB_list;
}
