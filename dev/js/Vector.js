
function Point(x, y){
    this.x = parseFloat(x);
    this.y = parseFloat(y);
}

function Vector(origin, target){
    
    this.x = target.x - origin.x;
    this.y = target.y - origin.y;
    this.module = Math.sqrt((this.x*this.x) + (this.y*this.y));
    
    this.unity = {
        x: this.x/this.module,
        y: this.y/this.module
    };
}