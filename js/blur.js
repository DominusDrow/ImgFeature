
export default function	gBlur(blur,canva,contex) {
    blur = blur || 0;
    let canvas = canva;
    let ctx = contex;
    
    let sum = 0;
    let delta = 5;
    let alpha_left = 1 / (2 * Math.PI * delta * delta);
    let step = blur < 3 ? 1 : 2;
    for (let y = -blur; y <= blur; y += step) {
        for (let x = -blur; x <= blur; x += step) {
            let weight = alpha_left * Math.exp(-(x * x + y * y) / (2 * delta * delta));
            sum += weight;
        }
    }
    let count = 0;
    for (let y = -blur; y <= blur; y += step) {
        for (let x = -blur; x <= blur; x += step) {
            count++;
            ctx.globalAlpha = alpha_left * Math.exp(-(x * x + y * y) / (2 * delta * delta)) / sum * blur;
            ctx.drawImage(canvas,x,y);
        }
    }
    ctx.globalAlpha = 1;
}