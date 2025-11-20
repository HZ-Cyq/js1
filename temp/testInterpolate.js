function parseRgba(rgbaStr) {
    const match = rgbaStr.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,?\s*([\d.]+)?\s*\)$/i);
    if (!match) {
      throw new Error(`Invalid RGBA color: "${rgbaStr}"`);
    }
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: match[4] !== undefined ? parseFloat(match[4]) : 1
    };
  }
  
  function interpolateRgbaHSL(rgbaStr1, rgbaStr2, t) {
    const color1 = parseRgba(rgbaStr1);
    const color2 = parseRgba(rgbaStr2);
  
    // 转为 Cesium.Color，然后获取 HSL
    const c1 = Cesium.Color.fromBytes(color1.r, color1.g, color1.b, Math.round(color1.a * 255));
    const c2 = Cesium.Color.fromBytes(color2.r, color2.g, color2.b, Math.round(color2.a * 255));
  
    const hsl1 = {};
    const hsl2 = {};
    c1.toHsl(hsl1);
    c2.toHsl(hsl2);
  
    // H 环绕插值（考虑 hue = 0 和 hue = 1 是一样的颜色）
    let h1 = hsl1.h, h2 = hsl2.h;
    if (Math.abs(h2 - h1) > 0.5) {
      if (h1 > h2) h2 += 1;
      else h1 += 1;
    }
    const h = (h1 + (h2 - h1) * t) % 1;
    const s = hsl1.s + (hsl2.s - hsl1.s) * t;
    const l = hsl1.l + (hsl2.l - hsl1.l) * t;
  
    // 插值 alpha
    const a = color1.a + (color2.a - color1.a) * t;
  
    // 转回 RGB
    const interpolated = Cesium.Color.fromHsl(h, s, l, a);
    return [
      Math.round(interpolated.red * 255),
      Math.round(interpolated.green * 255),
      Math.round(interpolated.blue * 255),
      Number(interpolated.alpha.toFixed(3))
    ];
  }
  interpolateRgbaHSL("rgb(0,255,0)", "rgb(255,0,0)",0.5)
  