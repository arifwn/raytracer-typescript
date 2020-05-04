import React, {
  useState,
  useEffect,
  useRef
} from 'react';

import {
  makeStyles,
  Button
} from '@material-ui/core';

import {
  canvasRayTracer
} from '../renderer';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  renderedImageContainer: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
}));

function RayTracer({siteSetting, design, topBannerShown}: any) {
  const classes = useStyles();
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(100);
  const [rx, setRx] = useState(0);
  const [rz, setRz] = useState(0);

  useEffect(() => {
    const rayTracer = canvasRayTracer(canvasRef.current);
    if (!rayTracer) return;
    rayTracer.camera = {
      x: x,
      y: y,
      z: z,
      rx: rx,
      ry: 0,
      rz: rz,
      fov: Math.PI / 4, // 45 degree FOV
    }
    rayTracer.execute();
  })
  return (<div className={classes.root}>
    <div className={classes.renderedImageContainer} style={{width, zoom: 500 / width}}>
      <canvas width={width} height={height} ref={canvasRef} />
    </div>
    <div className={classes.renderedImageContainer} style={{width : 500}}>
      <div>
        <Button onClick={() => setX(x - 10)}>Left</Button>
        <Button onClick={() => setY(y + 10)}>Front</Button>
        <Button onClick={() => setY(y - 10)}>Back</Button>
        <Button onClick={() => setX(x + 10)}>Right</Button>
      </div>
      <div>
        <Button onClick={() => setRz(rz - .1)}>Rt Left</Button>
        <Button onClick={() => setRz(rz + .1)}>Rt Right</Button>
        <Button onClick={() => setRx(rx + .1)}>Rt Up</Button>
        <Button onClick={() => setRx(rx - .1)}>Rt Down</Button>
        <Button onClick={() => setZ(z + 10)}>Top</Button>
        <Button onClick={() => setZ(z - 10)}>Bottom</Button>
      </div>
    </div>
  </div>);
}

export default RayTracer;