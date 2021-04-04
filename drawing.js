class Drawing {
    constructor(canvas, initial_color = "#000") {
        /* Define the canvas and it's context */
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        /* Set Attribute Defaults */
        this.mouseIsDown = false;
        this.toolbox = {
            "default-brush": new DefaultBrush(),
            "default-bucket": new DefaultBucket()
        };

        this.color = {
            primary: initial_color
        }

        /* Create the tool object, set default values */
        this.tool = "default-brush";

        /* Declare event listeners */
        this.eventListeners = {

        };

        this.canvas.addEventListener('mousedown', this.down.bind(this));
        document.addEventListener('mousemove', this.move.bind(this));
        document.addEventListener('mouseup', this.up.bind(this));

        this.canvas.addEventListener('touchmove', this.touchmove.bind(this));
        document.addEventListener('touchend', this.up.bind(this));
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    down(e) {
        this.mouseIsDown = true;
        this.context.fillStyle = this.color.primary;

        if (this.toolbox[this.tool].down) {
            this.toolbox[this.tool].down(e, this);
        }
    }

    move(e) {
        if (this.mouseIsDown) {
            if (this.toolbox[this.tool].move) {
                this.toolbox[this.tool].move(e, this);
            }
        }
    }

    up(e) {
        if (this.mouseIsDown) {
            this.mouseIsDown = false;

            if (this.toolbox[this.tool].up) {
                this.toolbox[this.tool].up(e, this);
            }
        }
    }

    touchmove(e) {
        /* Prevent mobile scrolling */
        e.preventDefault();

        /* If previous position is defined */
        if (this.mouseIsDown) {
            this.eventListeners.mousemove(e);
        } else {
            this.eventListeners.mousedown(e);
        }
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
}
