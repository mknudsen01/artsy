import React from "react";
import SketchLayout from "../components/SketchLayout";
import noiseSketch from "../static/sketches/sketch-noise";

const Noise = () => {
  return (
    <>
      <SketchLayout sketch={noiseSketch} title="Perlin Noise" />
    </>
  );
};

export default Noise;
