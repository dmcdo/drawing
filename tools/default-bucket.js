class DefaultBucket {
    identifier = 'default-bucket';

    down(drawing, e) {
        drawing.disable();

        let {x, y} = drawing.getRelativeCoordinates(e);

        this.getFloodFillWorker().postMessage({
            x: x,
            y: y,
            fillColor: drawing.tool.color,
            imageData: drawing.context.getImageData(0, 0, drawing.context.canvas.width, drawing.context.canvas.height)
        });
    }

    getFloodFillWorker() {
        if (!this.getFloodFillWorker.worker) {
            this.getFloodFillWorker.worker = new Worker(URL.createObjectURL(new Blob([ '(',
                (function() {
                    function hexCodeToUint32Value(hex) {
                        hex = hex.slice(1, hex.length);
                        hex = (hex.length === 3) ? hex + hex : hex;

                        return parseInt(('ff' + hex.slice(4, 6) + hex.slice(2, 4) + hex.slice(0, 2)), 16);
                    }

                    function tolerate(pixelData, x, y, fillColor) {

                    }

                    function getPixel(pixelData, x, y) {
                        if (x < 0 || y < 0 | x >= pixelData.width || y >= pixelData.height) {
                            return -1;
                        }

                        return pixelData.data[y * pixelData.width + x];
                    }

                    function floodFill(imageData, x, y, fillColor) {
                        const pixelData = {
                            width: imageData.width,
                            height: imageData.height,
                            data: new Uint32Array(imageData.data.buffer)
                        };

                        const targetColor = getPixel(pixelData, x, y);

                        if (targetColor !== fillColor) {
                            const pixelStack = [x, y];
                            while (pixelStack.length > 0) {
                                const y = pixelStack.pop();
                                const x = pixelStack.pop();

                                const currentColor = getPixel(pixelData, x, y);
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

                    self.onmessage = function(e) {
                        const imageData = e.data.imageData;
                        const x = e.data.x;
                        const y = e.data.y;
                        const fillColor = hexCodeToUint32Value(e.data.fillColor);

                        floodFill(imageData, x, y, fillColor);
                        self.postMessage(imageData);
                    }
                }).toString(),
            ')();'], { type: 'application/javascript' })));

            this.getFloodFillWorker.worker.onmessage = (e) => {
                const imageData = e.data;

                drawing.context.putImageData(imageData, 0, 0);

                drawing.enable();
            };
        }

        return this.getFloodFillWorker.worker;
    }
}
