class DefaultBrush {
    down(e, d) {
        let {x, y} = d.getRelativeCoordinates(e);

        // Draw opening circle
        d.context.beginPath();
        d.context.arc(x, y, 10, 2 * Math.PI, false);
        d.context.fill();

        this.previousX = x;
        this.previousY = y;
    }

    move(e, d) {
        let {x, y} = d.getRelativeCoordinates(e);

        // Draw closing circle
        d.context.beginPath();
        d.context.arc(x, y, 10, 2 * Math.PI, false);
        d.context.fill();

        // Connect
        let angle = Math.atan2(y - this.previousY, x - this.previousX) + (3 * Math.PI / 2);
        d.context.translate(this.previousX, this.previousY);
        d.context.rotate(angle);
        d.context.fillRect(-10, 0, 20, this.distanceFormula(x, y, this.previousX, this.previousY));
        d.context.setTransform(1,0,0,1,0,0);

        this.previousX = x;
        this.previousY = y;
    }

    distanceFormula(x1, y1, x2, y2) {
        return Math.sqrt( Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2) );
    }
}
