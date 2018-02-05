export const clear = (canvas) => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

export const drawGrid = (canvas = document.createElement('canvas'), gridPixelSize = 4, gridColor = '#cccccc', gridGap = 5, selector = "#editor") => {
    // var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = gridColor;
    ctx.save()
    ctx.restore()

    for (var i = 0; i <= canvas.height; i = i + gridPixelSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        if (i % parseInt(gridGap) === 0) {
            ctx.lineWidth = 2;
        } else {
            ctx.lineWidth = 0.5;
        }
        ctx.closePath();
        ctx.stroke();
    }

    for (var j = 0; j <= canvas.width; j = j + gridPixelSize) {
        ctx.beginPath();
        ctx.moveTo(j, 0);
        ctx.lineTo(j, canvas.height);
        if (j % parseInt(gridGap) == 0) {
            ctx.lineWidth = 2;
        } else {
            ctx.lineWidth = 0.5;
        }
        ctx.closePath();
        ctx.stroke();
    }
    document
        .querySelector('body')
        .style
        .backgroundImage = 'url(' + canvas.toDataURL('image/png') + ')'
}