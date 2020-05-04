import { TableContainer } from "@material-ui/core";

interface Drawer {
  fill: (x:number, y:number, width:number|null, height:number|null, color:string|null) => void,
  at: (x:number, y:number, color:string) => void
  dimension: () => {width: number, height: number}
}

interface RenderColors {
  white: string;
  black: string;
  sky: string;
  highlight: string;
}

interface Point3D {
  x: number; // sideward
  y: number; // forward
  z: number; // upward
}

interface Rotation3D {
  rx: number; // rotation on x axis
  ry: number; // rotation on y axis
  rz: number; // rotation on z axis
}

const defaultColors: RenderColors = {
  white: '#ffffff',
  black: '#000000',
  sky: '#2196f3',
  highlight: '#b71c1c'
}

class RayTracer {
  drawer?: Drawer;
  colors = defaultColors;
  camera = {
    x: 0,
    y: 0,
    z: 200,
    rx: 0,
    ry: 0,
    rz: 0,
    fov: Math.PI / 2, // 90 degree FOV
  }
  tileWidth = 30;
  floorWidth = 1000;
  maxRenderDistance = 10000;

  constructor(drawer: Drawer|null) {
    if (drawer) this.drawer = drawer;
  }
  
  execute() {
      const draw = this.drawer;
      if (!draw) return;

      const renderDimension = draw.dimension();
      const cameraFOV = this.camera.fov;
      const cameraOriginPos = {
        x: this.camera.x,
        y: this.camera.y,
        z: this.camera.z,
      };

      for (let ypos = 0; ypos < renderDimension.height; ypos++) {
        for (let xpos = 0; xpos < renderDimension.width; xpos++) {
          let rz = -cameraFOV/2 + (xpos * (cameraFOV / renderDimension.width));
          let rx = cameraFOV/2 - (ypos * (cameraFOV / renderDimension.height));
          // console.log('cam', xpos, ypos, rz, rx);
          draw.at(xpos, ypos, this.rayPixel(cameraOriginPos, {
            rx: this.camera.rx + rx,
            ry: this.camera.ry + 0,
            rz: this.camera.rz + rz,
          }));
        }
      }
  }

  lightenColor(color: string, amount: number) {
    let usePound = false;
    if (color[0] == "#") {
        color = color.slice(1);
        usePound = true;
    }
 
    const colorNum = parseInt(color, 16);
 
    let r = (colorNum >> 16) + amount;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    let b = ((colorNum >> 8) & 0x00FF) + amount;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    let g = (colorNum & 0x0000FF) + amount;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  }

  rayPixel(origin: Point3D, direction: Rotation3D) : string {
    const [hitPoint, rayDistance] = this.shoot(origin, direction);
    if (Math.abs(hitPoint.x) == Infinity) return this.colors.sky;
    if (Math.abs(hitPoint.y) == Infinity) return this.colors.sky;
    if (Math.abs(hitPoint.z) == Infinity) return this.colors.sky;
    if (hitPoint.z == 0) {
      let isDark = false;
      if ((Math.abs(Math.round(hitPoint.x % (this.tileWidth*2))) < this.tileWidth) && (Math.abs(Math.round(hitPoint.y % (this.tileWidth*2))) < this.tileWidth)) {
        isDark = true;
      }
      if ((Math.abs(Math.round(hitPoint.x % (this.tileWidth*2))) >= this.tileWidth) && (Math.abs(Math.round(hitPoint.y % (this.tileWidth*2))) >= this.tileWidth)) {
        isDark = true;
      }
      if (hitPoint.x < 0) isDark = !isDark;

      if (isDark) {
        // return this.colors.black;
        const lightenAmount = ((rayDistance > this.maxRenderDistance ? this.maxRenderDistance : rayDistance) / this.maxRenderDistance) * 200;
        return this.lightenColor(this.colors.black, lightenAmount);
      }
      return this.colors.white;
    }
    return this.colors.white;
  }

  shoot(origin: Point3D, direction: Rotation3D): [Point3D, number] {

    // if an object is in the path of the ray, bounch it.

    // render sky
    if ((direction.rx > 0) && (direction.rx < Math.PI)) return [{
      x: 0,
      y: Infinity,
      z: Infinity
    }, Infinity];

    // render floor
    const rayDistance = origin.z / Math.cos((Math.PI/2)-direction.rx);
    const planeLength = origin.z / Math.tan(-direction.rx);
    const y = origin.y + (Math.cos(direction.rz) * planeLength);
    const x = origin.x + (Math.sin(direction.rz) * planeLength);
    return [{
      // x: isNaN(x) ? Infinity : (Math.abs(x) > this.floorWidth ? Infinity : x),
      // y: isNaN(y) ? Infinity : (Math.abs(y) > this.floorWidth ? Infinity : y),
      x: isNaN(x) ? Infinity : x,
      y: isNaN(y) ? Infinity : y,
      z: 0
    }, isNaN(rayDistance) ? Infinity : Math.abs(rayDistance)];
  }

}

export {
  RayTracer,
  defaultColors,
}