class DefaultBucket {
    down(e, d) {
        let {x, y} = drawing.getRelativeCoordinates(e);
        this.imgdata = d.context.getImageData(0, 0, d.canvas.width, d.canvas.height);

        this.floodFill(this.imgdata, x, y, this.hexCodeToUint32Value(d.color.primary));
        d.context.putImageData(this.imgdata, 0, 0);
    }

    hexCodeToUint32Value(hex) {
        hex = hex.slice(1, hex.length);
        hex = (hex.length === 3) ? hex + hex : hex;

        return parseInt(('ff' + hex.slice(4, 6) + hex.slice(2, 4) + hex.slice(0, 2)), 16);
    }

    getPixel(pixelData, x, y) {
        if (x < 0 || y < 0 | x >= pixelData.width || y >= pixelData.height) {
            return -1;
        }

        return pixelData.data[y * pixelData.width + x];
    }

    floodFill(imageData, x, y, fillColor) {
        const pixelData = {
            width: imageData.width,
            height: imageData.height,
            data: new Uint32Array(imageData.data.buffer)
        };

        const targetColor = this.getPixel(pixelData, x, y);

        if (targetColor !== fillColor) {
            const pixelStack = [x, y];
            while (pixelStack.length > 0) {
                const y = pixelStack.pop();
                const x = pixelStack.pop();

                const currentColor = this.getPixel(pixelData, x, y);
                if (currentColor === targetColor) {
                    pixelData.data[y * pixelData.width + x] = fillColor;
                    pixelStack.push(x + 1, y);
                    pixelStack.push(x - 1, y);
                    pixelStack.push(x, y + 1);
                    pixelStack.push(x, y - 1);
                }
            }
        }
    }
}
