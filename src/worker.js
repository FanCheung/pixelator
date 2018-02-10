var convert = require('color-convert');

const worker = () => {
    const getImageData256 = (colorData, width, height) => {
        let data = colorData.reduce((acc, curr, index, arr) => {
            // let key = Math.floor(index / 4)
            acc
                .temp
                .push(curr)
            if (acc.temp.length === 4) {
                const ansi = convert
                    .rgb
                    .ansi256(...acc.temp)
                const rounded = convert
                    .ansi256
                    .rgb(ansi)
                    .concat(255)
                acc.data = acc
                    .data
                    .concat(rounded)
                acc.temp = []
            }
            return acc
        }, {
            temp: [],
            data: []
        }).data
        return new ImageData(new Uint8ClampedArray(data), width, height)
    }

    let onmessage = (e) => {
        console.log(e)
    }
}

let code = worker.toString();
export default code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));
