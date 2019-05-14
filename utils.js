const lightTheme = require('./themes/material-color-theme.json')

// test();
const darkTheme = investTheme(lightTheme);
console.log(JSON.stringify(darkTheme, null, 2));

function investTheme(theme) {
    const type = 'dark';
    
    const colors = {};
    Object.entries(theme.colors)
        .forEach(([key, value]) => colors[key] = investBrightness(value));

    const tokenColors = theme.tokenColors.map(tokenColor => {
        const scope = [ ...tokenColor.scope ];
        const settings = { ...tokenColor.settings };
        
        if (settings.foreground)
            settings.foreground = investBrightness(settings.foreground);

        return { scope, settings };
    });

    return { type, colors, tokenColors };
}

function investBrightness(color) {
    let newColor = color.toUpperCase()
        .split('')
        .filter(char => char != '#')
        .map(hex => parseInt('0x' + hex))
        .map(dec => 15 - dec)
        .map(invert => invert.toString(16).toUpperCase())
        .join('');

    return color.length == 9 ?
        '#' + newColor.substring(0, 6) + color.substring(7) :
        '#' + newColor;
}

function test() {
    console.log('Test');
    const compare = (c1, c2) => {
        const inverted = investBrightness(c1);
        const ok = c2 == inverted;
        console.log(c1, c2, `\x1b[3${ok ? 2 : 1}m${ok}\x1b[0m`, inverted);
    };

    compare('#FFF', '#000');
    compare('#000', '#FFF');
    compare('#FAFAFA', '#050505');
    compare('#FFA00033', '#005FFF33');
}
