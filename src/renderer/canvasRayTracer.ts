
import {
  colors
} from '@material-ui/core';

import CanvasDrawer from './CanvasDrawer';
import {
  RayTracer,
  defaultColors,
} from './RayTracer';

function canvasRayTracer(canvas: HTMLCanvasElement|null) {
  if (!canvas) return null;

  const draw = new CanvasDrawer(canvas);

  const rayTracer = new RayTracer(draw);
  return rayTracer;
}

export default canvasRayTracer;