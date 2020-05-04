
export default class CanvasDrawer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D|null;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas?.getContext("2d");
  }

  dimension() {
    return {width: this.canvas.width, height: this.canvas.height};
  }
  fill(x=0, y=0, width:number|null=null, height:number|null=null, color:string|null=null) {
    if (!this.context) return;
    const prevColor = this.context.fillStyle;
    if (color) this.context.fillStyle = color;
    this.context.fillRect(x, y, width == null ? this.canvas.width : width, height == null ? this.canvas.height : height);
    this.context.fillStyle = prevColor;
  }

  at(x: number, y: number, color: string) {
    this.fill(x, y, 1, 1, color);
  }

}