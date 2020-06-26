import {
  pick,
  range,
  rangeFloor,
  getCanvasDimension,
  createSketchLayoutAndKnobs,
  displayControlValues,
} from "../../lib/utils";

let controls = [
  {
    type: "SLIDER",
    label: "Random Seed",
    id: "seed",
    min: 0,
    max: 1000,
    defaultValue: 140,
    step: 1,
  },
  {
    type: "COLOR",
    label: "Background",
    id: "background",
    defaultValue: "#000",
  },
  {
    type: "SLIDER",
    label: "Line Count",
    id: "lineCount",
    min: 0,
    max: 8000,
    defaultValue: 1000,
    step: 100,
  },
  {
    type: "SLIDER",
    label: "Average line length (as % of canvas diagonal length)",
    id: "lineLengthMean",
    min: 1,
    max: 100,
    defaultValue: 40,
    step: 1,
  },
  {
    type: "SLIDER",
    label: "Line length variance (as % of average length)",
    id: "lineLengthVariance",
    min: 1,
    max: 100,
    defaultValue: 25,
    step: 1,
  },
  {
    type: "SLIDER",
    label: "Average line width",
    id: "lineWidthMean",
    min: 1,
    max: 10,
    defaultValue: 3,
    step: 0.5,
  },
  {
    type: "SLIDER",
    label: "Line width variance",
    id: "lineWidthVariance",
    min: 1,
    max: 20,
    defaultValue: 3,
    step: 1,
  },
  {
    type: "SLIDER",
    label: "Hole in center size (as % of canvas diagonal) ",
    id: "centerDistance",
    min: 1,
    max: 100,
    defaultValue: 5,
    step: 1,
  },
  {
    type: "SLIDER",
    label: "Average lightness",
    id: "averageLightness",
    min: 1,
    max: 100,
    defaultValue: 50,
    step: 1,
  },
  {
    type: "SLIDER",
    label: "Lightness variance",
    id: "lightnessVariance",
    min: 1,
    max: 100,
    defaultValue: 20,
    step: 0.5,
  },
  {
    type: "SLIDER",
    label: "Minimum Saturation",
    id: "saturationMinimum",
    min: 1,
    max: 100,
    defaultValue: 95,
    step: 1,
  },
  {
    type: "SLIDER",
    label: "Maximum Saturation",
    id: "saturationMaximum",
    min: 1,
    max: 100,
    defaultValue: 100,
    step: 1,
  },
  {
    type: "SLIDER",
    label: "Minimum Hue",
    id: "hueMinimum",
    min: 1,
    max: 360,
    defaultValue: 1,
    step: 1,
  },
  {
    type: "SLIDER",
    label: "Maximum Hue",
    id: "hueMaximum",
    min: 1,
    max: 360,
    defaultValue: 360,
    step: 1,
  },
];

const sketch = (p) => {
  p.setup = () => {
    p.remove();
    p.noLoop();
    p.angleMode(p.RADIANS);
    p.colorMode(p.HSL);
    p.windowHeight = window.innerHeight;
    p.windowWidth = window.innerWidth;
    const { sketchInputs } = createSketchLayoutAndKnobs(p, {
      id: "warpspeed",
      controls,
    });

    p.inputsById = sketchInputs;
  };

  p.draw = () => {
    const { inputsById } = p;
    const SEED = inputsById.seed.value();
    p.randomSeed(SEED);

    displayControlValues(controls, inputsById);

    const BACKGROUND = inputsById.background.value();
    const STAR_COUNT = inputsById.lineCount.value();

    const LENGTH_MEAN = inputsById.lineLengthMean.value() / 100;
    const LENGTH_VARIANCE = inputsById.lineLengthVariance.value() / 100;
    const MIN_LINE_WIDTH = 1;
    const LINE_WIDTH_MEAN = inputsById.lineWidthMean.value();
    const LINE_WIDTH_VARIANCE = inputsById.lineWidthVariance.value();
    const MINIMUM_DISTANCE_FROM_CENTER =
      inputsById.centerDistance.value() / 100;
    const LIGHTNESS_MEAN = inputsById.averageLightness.value() / 100;
    const LIGHTNESS_VARIANCE = inputsById.lightnessVariance.value() / 100;

    const saturationMin = inputsById.saturationMinimum.value();
    const saturationMax = inputsById.saturationMaximum.value();

    const SATURATION_MIN = Math.min(saturationMin, saturationMax);
    const SATURATION_MAX = Math.max(saturationMin, saturationMax);

    const hueMin = inputsById.hueMinimum.value();
    const hueMax = inputsById.hueMaximum.value();

    const HUE_MINIMUM = Math.min(hueMin, hueMax);
    const HUE_MAXIMUM = Math.max(hueMin, hueMax);

    const width = getCanvasDimension({
      width: p.windowWidth,
      height: p.windowHeight,
    });
    const height = width;

    const WIDTH_SPLIT = range(p, 0.1, 0.4);
    const VERTICAL_SPLIT = range(p, 0.2, 0.5);
    const widths = [width * WIDTH_SPLIT, width * (1 - WIDTH_SPLIT)];
    const heights = [height * VERTICAL_SPLIT, height * (1 - VERTICAL_SPLIT)];

    const maxWidth = Math.max(...widths);
    const maxHeight = Math.max(...heights);
    const diagonal = Math.sqrt(maxWidth * maxWidth + maxHeight * maxHeight);

    p.background(BACKGROUND);

    // move to the center;
    p.translate(pick(p, widths), pick(p, heights));

    for (let i = 0; i < STAR_COUNT; i++) {
      const angle = rangeFloor(p, 0, 3600) / 10;
      const radians = (Math.PI / 180) * angle;
      const hue = rangeFloor(p, HUE_MINIMUM, HUE_MAXIMUM) % 360;
      const lightness =
        Math.abs(p.randomGaussian(LIGHTNESS_MEAN, LIGHTNESS_VARIANCE)) * 100;

      const lineWidth = Math.max(
        MIN_LINE_WIDTH,
        p.randomGaussian(LINE_WIDTH_MEAN, LINE_WIDTH_VARIANCE)
      );

      const saturation = rangeFloor(p, SATURATION_MIN, SATURATION_MAX);

      const startOffset = Math.max(
        MINIMUM_DISTANCE_FROM_CENTER * width,
        Math.abs(p.randomGaussian(diagonal / 2, diagonal / 5))
      );

      const percentOfDiagonal = Math.abs(
        p.randomGaussian(LENGTH_MEAN, LENGTH_MEAN * LENGTH_VARIANCE)
      );
      const length = percentOfDiagonal * diagonal;

      p.line(
        startOffset * Math.cos(radians),
        startOffset * Math.sin(radians),
        (startOffset + length) * Math.cos(radians),
        (startOffset + length) * Math.sin(radians)
      );

      p.strokeWeight(lineWidth);
      p.stroke(hue, saturation, lightness);
    }
  };
};

export default sketch;
