import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import RayTracer from './components/RayTracer';

import './App.css';

import 'typeface-roboto';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <RayTracer />
    </div>
  );
}

export default App;
