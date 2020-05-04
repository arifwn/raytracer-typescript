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
  sky: '#ffffff',
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
      
      Array.from(Array(renderDimension.height).keys()).forEach((ypos) => {
        window.setTimeout(() => {
          Array.from(Array(renderDimension.width).keys()).forEach((xpos) => {
            let rz = -cameraFOV/2 + (xpos * (cameraFOV / renderDimension.width));
            let rx = cameraFOV/2 - (ypos * (cameraFOV / renderDimension.height));
            
            draw.at(xpos, ypos, this.rayPixel(cameraOriginPos, {
              rx: this.camera.rx + rx,
              ry: this.camera.ry + 0,
              rz: this.camera.rz + rz,
            }));
          });
        }, 0);
      })

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
    const [hitPoint, rayDistance, color] = this.shoot(origin, direction);
    
    return color;
  }

  shoot(origin: Point3D, direction: Rotation3D): [Point3D, number, string] {

    // if an object is in the path of the ray, bounch it.
    for (let i = 0; i < this.pillars.length; i++) {
      const pillar = this.pillars[i];
      
      // calculate pillar rz from camera
      const pillarNormalizedPosition = {
        x: pillar.position.x - origin.x,
        y: pillar.position.y - origin.y,
        z: pillar.position.z - origin.z,
      };
      const pillarRz = Math.atan(pillarNormalizedPosition.x / pillarNormalizedPosition.y)
      const pillarRzMin = Math.atan((pillarNormalizedPosition.x - pillar.width) / pillarNormalizedPosition.y)
      const pillarRzMax = Math.atan((pillarNormalizedPosition.x + pillar.width) / pillarNormalizedPosition.y)
      
      const pillarRxMin = Math.atan(pillarNormalizedPosition.z / pillarNormalizedPosition.y);
      const pillarRxMax = Math.atan(((pillar.position.z + pillar.height) - origin.z) / pillarNormalizedPosition.y);

      if ((direction.rz > pillarRzMin) && (direction.rz < pillarRzMax) && (direction.rx > pillarRxMin) && (direction.rx < pillarRxMax)) {
        // bounce the ray
        const pillarPlaneLength = (pillar.position.y - origin.y) / Math.cos(direction.rz);
        const newOrigin = {
          x: (Math.tan(direction.rz) * (pillar.position.y - origin.y)) + origin.x,
          y: pillar.position.y,
          z: (Math.tan(direction.rx) * pillarPlaneLength) + origin.z,
        };

        // calculate new angles
        const newDirection = {
          rx: direction.rx - .05, // add small slope to the mirror
          ry: 0,
          rz: (Math.PI - direction.rz),
        };

        const [hitPoint, rayDistance, color] = this.shoot(newOrigin, newDirection);
        return [hitPoint, rayDistance, this.lightenColor(color, 100)];
      }
    }

    // render sky
    if ((direction.rx > 0) && (direction.rx < Math.PI)) return [{
      x: 0,
      y: Infinity,
      z: Infinity
    }, Infinity, this.colors.sky];

    // render floor
    const rayDistance = origin.z / Math.cos((Math.PI/2)-direction.rx);
    const rayDistanceAbs = isNaN(rayDistance) ? Infinity : Math.abs(rayDistance);
    const planeLength = origin.z / Math.tan(-direction.rx);
    const y = origin.y + (Math.cos(direction.rz) * planeLength);
    const x = origin.x + (Math.sin(direction.rz) * planeLength);
    
    let hitPoint = {
      // x: isNaN(x) ? Infinity : (Math.abs(x) > this.floorWidth ? Infinity : x),
      // y: isNaN(y) ? Infinity : (Math.abs(y) > this.floorWidth ? Infinity : y),
      x: isNaN(x) ? Infinity : x,
      y: isNaN(y) ? Infinity : y,
      z: 0
    };

    let floorColor = this.colors.black;
    let isDark = false;
    if ((Math.abs(Math.round(hitPoint.x % (this.tileWidth*2))) < this.tileWidth) && (Math.abs(Math.round(hitPoint.y % (this.tileWidth*2))) < this.tileWidth)) {
      isDark = true;
    }
    if ((Math.abs(Math.round(hitPoint.x % (this.tileWidth*2))) >= this.tileWidth) && (Math.abs(Math.round(hitPoint.y % (this.tileWidth*2))) >= this.tileWidth)) {
      isDark = true;
    }
    if (hitPoint.x < 0) isDark = !isDark;

    if (isDark) {
      const lightenAmount = ((rayDistanceAbs > this.maxRenderDistance ? this.maxRenderDistance : rayDistanceAbs) / this.maxRenderDistance) * 200;
      floorColor = this.lightenColor(this.colors.black, lightenAmount);
    }
    else {
      floorColor = this.colors.white;
    }
    
    if ((hitPoint.x == Infinity) || (hitPoint.y == Infinity) || (hitPoint.z == Infinity)) {
      floorColor = this.colors.sky;
    }

    return [
      hitPoint,
      rayDistanceAbs,
      floorColor
    ];
  }

  pillars = [
    {
      position: {
        x: 80,
        y: 345,
        z: 0,
      },
      width: this.tileWidth/2,
      height: 120,
    }
  ];

  spheres = [
    {
      position: {
        x: 0,
        y: 100,
        z: 30,
      },
      radius: 30
    }
  ];

}

export {
  RayTracer,
  defaultColors,
}