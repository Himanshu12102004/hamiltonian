import Point from './point';

class Vector {
  x: number;
  y: number;
  constructor(pt1: Point = new Point(0, 0), pt2: Point = new Point(0, 0)) {
    this.x = pt2.x - pt1.x;
    this.y = pt2.y - pt1.y;
  }
  convertToUnit() {
    const magnitude = Math.sqrt(this.x ** 2 + this.y ** 2);
    if (magnitude !== 0) {
      this.x /= magnitude;
      this.y /= magnitude;
    } else {
      this.x = 0;
      this.y = 0;
    }
  }
  multiply(scalar: number): void {
    this.x *= scalar;
    this.y *= scalar;
  }
  multiplyInNewVector(scalar:number){
    let vec2=new Vector();
    vec2.x=this.x*scalar;
    vec2.y=this.y*scalar;
    return vec2;
  }
  addAPoint(pt:Point){
   return new Point(this.x+pt.x,this.y+pt.y);
  }
  add(other: Vector): Vector {
    return new Vector(
      new Point(0, 0),
      new Point(this.x + other.x, this.y + other.y)
    );
  }
}

export default Vector;
