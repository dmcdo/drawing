class Drawing {
    constructor(canvas, options = {}) {
        /* Ensure that the canvas is actually a canvas */
        if (!(canvas instanceof HTMLCanvasElement))
            throw 'First argument must be an HTMLCanvasElement';

        /* Define the canvas and it's context */
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        /* Set Attribute Defaults */
        this.mouseIsDown = false;
        this.toolbox = {};

        /* Create the tool object, set default values */
        this.tool = {
            selected: undefined,
            color: '#000',
            strokeSize: 20
        };

        /* Set values for tool passed in though options */
        if (options.tool) {
            this.setTool(options.tool);
        };

        /* Add default tools to toolbox */

        /* Add tools passed in initially as arguments */
        if (options.addTools) {
            for (let tool of options.addTools) {
                this.addTool(tool);
            }
        }


        /* Declare event listeners */
        this.eventListeners = {
            mousedown: e => {
                this.mouseIsDown = true;
                this.context.fillStyle = this.tool.color;

                if (this.toolbox[this.tool.selected].down) {
                    this.toolbox[this.tool.selected].down(this, e);
                }
            },

            mouseup: e => {
                if (this.mouseIsDown) {
                    this.mouseIsDown = false;

                    console.log(e);

                    if (this.toolbox[this.tool.selected].up) {
                        this.toolbox[this.tool.selected].up(this, e);
                    }
                }
            },

            mousemove: e => {
                if (this.mouseIsDown) {
                    if (this.toolbox[this.tool.selected].move) {
                        this.toolbox[this.tool.selected].move(this, e);
                    }
                }
            },

            touchmove: e => {
                /* Prevent mobile scrolling */
                e.preventDefault();

                /* If previous position is defined */
                if (this.mouseIsDown) {
                    this.eventListeners.mousemove(e);
                } else {
                    this.eventListeners.mousedown(e);
                }
            }
        };

        if (!options.disabled) {
            this.enable();
        }
    }

    enable() {
        this.canvas.addEventListener('mousedown', this.eventListeners.mousedown);
        document.addEventListener('mouseup', this.eventListeners.mouseup);
        document.addEventListener('mousemove', this.eventListeners.mousemove);

        this.canvas.addEventListener('touchmove', this.eventListeners.touchmove);
        document.addEventListener('touchend', this.eventListeners.mouseup);
    }

    disable() {
        this.canvas.removeEventListener('mousedown', this.eventListeners.mousedown);
        document.removeEventListener('mouseup', this.eventListeners.mouseup);
        document.removeEventListener('mousemove', this.eventListeners.mousemove);

        this.canvas.removeEventListener('touchmove', this.eventListeners.touchmove);
        document.removeEventListener('touchend', this.eventListeners.mouseup);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setTool(params = {}) {
        if (params.selected)
            this.tool.selected = params.selected;

        if (params.color)
            this.tool.color = params.color;

        if (params.strokeSize)
            this.tool.strokeSize = params.strokeSize;
    }

    addTool(newTool = {}) {
        if (!newTool.identifier)
            throw 'Cannot add tool without an identifier attribute'

        if (this.toolbox[newTool.identifier])
            throw `Tool with identifier ${newTool.identifier} already exists`

        this.toolbox[newTool.identifier] = newTool;
    }

    removeTool(identifier) {
        this.toolbox[identifier] = undefined;
    }


    /*** Drawing Functions ***/

    drawLine(x1, y1, x2, y2) {
        const a = { x: x1, y: y1 }
        const b = { x: x2, y: y2}

        let angle = Math.atan2(y2 - y1, x2 - x1) + (3 * Math.PI / 2);

        // Orient canvas context
        this.context.translate(x1, y1);
        this.context.rotate(angle);

        // Draw Tilted Rectangle
        this.context.fillRect(0 - (this.tool.strokeSize / 2), 0, this.tool.strokeSize, this.distanceFormula(x1, y1, x2, b.y));

        // Reset canvas orientation
        this.context.setTransform(1,0,0,1,0,0);
    }

    drawCircle(x, y) {
        this.context.beginPath();
        this.context.arc(x, y, this.tool.strokeSize / 2, 2 * Math.PI, false);
        this.context.fill();
    }



    /*** Helper Functions ***/

    getRelativeCoordinates(e) {
        let bounds = this.canvas.getBoundingClientRect();

        if (e.touches) {
            return {
                x: e.touches[0].clientX - bounds.left,
                y: e.touches[0].clientY - bounds.top
            };
        }

        return {
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top
        };
    }

    distanceFormula(x1, y1, x2, y2) {
        return Math.sqrt( Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2) );
    }
}
