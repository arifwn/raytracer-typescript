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

  rayPixel(origin: Point3D, direction: Rotation3D) : string {
    const hitPoint = this.shoot(origin, direction);
    if (Math.abs(hitPoint.x) == Infinity) return this.colors.sky;
    if (Math.abs(hitPoint.y) == Infinity) return this.colors.sky;
    if (Math.abs(hitPoint.z) == Infinity) return this.colors.sky;
    if (hitPoint.z == 0) {
      let isDark = false;
      if ((Math.abs(Math.floor(hitPoint.x % (this.tileWidth*2))) < this.tileWidth) && (Math.abs(Math.floor(hitPoint.y % (this.tileWidth*2))) < this.tileWidth)) {
        isDark = true;
      }
      if ((Math.abs(Math.floor(hitPoint.x % (this.tileWidth*2))) >= this.tileWidth) && (Math.abs(Math.floor(hitPoint.y % (this.tileWidth*2))) >= this.tileWidth)) {
        isDark = true;
      }
      if (hitPoint.x < 0) isDark = !isDark;

      if (isDark) return this.colors.black;
      return this.colors.white;
    }
    return this.colors.white;
  }

  shoot(origin: Point3D, direction: Rotation3D): Point3D {

    // render sky
    if ((direction.rx > 0) && (direction.rx < Math.PI)) return {
      x: 0,
      y: Infinity,
      z: Infinity
    };

    // render floor
    const rayLength = origin.z / Math.cos((Math.PI/2)-direction.rx);
    const planeLength = origin.z / Math.tan(-direction.rx);
    const y = origin.y + (Math.cos(direction.rz) * planeLength);
    const x = origin.x + (Math.sin(direction.rz) * planeLength);
    return {
      x: isNaN(x) ? Infinity : (Math.abs(x) > 1000 ? Infinity : x),
      y: isNaN(y) ? Infinity : (Math.abs(y) > 1000 ? Infinity : y),
      z: 0
    };
  }

}

export {
  RayTracer,
  defaultColors,
}