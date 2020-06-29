import React from "react";
import SketchLayout from "../components/SketchLayout";
import doorwaySketch from "../static/sketches/doorway.js";

const Doorway = () => {
  return (
    <>
      <SketchLayout sketch={doorwaySketch} title="Doorway" />
    </>
  );
};

export default Doorway;
