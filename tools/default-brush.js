class DefaultBrush {
    identifier = 'default-brush';

    down(drawing, e) {
        let {x, y} = drawing.getRelativeCoordinates(e);

        drawing.drawCircle(x, y);

        this.previousX = x;
        this.previousY = y;
    }

    move(drawing, e) {
        let {x, y} = drawing.getRelativeCoordinates(e);

        drawing.drawLine(this.previousX, this.previousY, x, y);
        drawing.drawCircle(x, y);

        this.previousX = x;
        this.previousY = y;
    }
}
