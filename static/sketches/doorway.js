import {
  range,
  getBounds,
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
    label: "Background one",
    id: "backgroundOne",
    defaultValue: "#000000",
  },
  {
    type: "COLOR",
    label: "Background two",
    id: "backgroundTwo",
    defaultValue: "#fff",
  },
  {
    type: "COLOR",
    label: "Color 1",
    id: "fillOne",
    defaultValue: "#fff",
  },
  {
    type: "COLOR",
    label: "Color 2",
    id: "fillTwo",
    defaultValue: "#000",
  },
  {
    type: "SLIDER",
    label: "Spread",
    id: "spread",
    min: 0.1,
    max: 1.0,
    defaultValue: 0.2,
    step: 0.05,
  },
  {
    type: "SLIDER",
    label: "Coverage",
    id: "coverage",
    min: 0,
    max: 50.0,
    defaultValue: 10,
    step: 1,
  },
  {
    type: "BUTTON",
    label: "Redraw",
    id: "redraw",
  },
  {
    type: "SAVE",
    label: "Save",
    filename: "doorway",
    id: "save",
  },
];

const clipShape = (p, { points, fillStyle }) => {
  // REMEMBER! context.save() before and context.restore() after done with clip
  const context = p.drawingContext;
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  points.forEach(([x, y]) => {
    context.lineTo(x, y);
  });
  context.clip();
  if (fillStyle) {
    const [min, max] = getBounds(points);
    context.rect(min[0], min[1], max[0] - min[0], max[1] - max[1]);
    context.fillStyle = fillStyle;
    context.fill();
  }
};

const drawDotsInBox = (
  p,
  {
    boxCenter: { x, y },
    randomCenter: { u: randomCenterU, v: randomCenterV },
    height,
    width,
    radius = 1,
    coverage,
    spread,
    color = "ff00ff",
  }
) => {
  p.translate(x, y);
  p.translate(-width / 2, -height / 2);
  const dots = Math.sqrt(width * height) * coverage;
  for (let i = 0; i < dots; i++) {
    const dotX = Math.floor(
      p.randomGaussian(width * randomCenterU, width * spread)
    );
    const dotY = Math.floor(
      p.randomGaussian(height * randomCenterV, height * spread)
    );

    if (dotX + radius < 0 || dotX - radius > width) continue;
    if (dotY + radius < 0 || dotY - radius > height) continue;

    p.fill(color);
    p.rect(dotX, dotY, 1, 1);
  }
  p.translate(width / 2, height / 2);
  p.translate(-x, -y);
};

const sketch = (p) => {
  p.setup = () => {
    p.remove();
    p.noLoop();
    p.noStroke();
    p.colorMode(p.RGB);
    p.angleMode(p.RADIANS);
    p.windowHeight = window.innerHeight;
    p.windowWidth = window.innerWidth;
    const { sketchInputs } = createSketchLayoutAndKnobs(p, {
      id: "doorway",
      controls,
    });

    p.inputsById = sketchInputs;
  };

  p.draw = () => {
    const { inputsById } = p;
    const SEED = inputsById.seed.value();
    p.randomSeed(SEED);
    p.noiseSeed(SEED);

    displayControlValues(controls, inputsById);

    const BACKGROUND_ONE = inputsById.backgroundOne.value();
    const BACKGROUND_TWO = inputsById.backgroundTwo.value();
    const FILL_ONE = inputsById.fillOne.value();
    const FILL_TWO = inputsById.fillTwo.value();
    const SPREAD = inputsById.spread.value();
    const COVERAGE = inputsById.coverage.value();

    const width = getCanvasDimension({
      width: p.windowWidth,
      height: p.windowHeight,
    });
    const height = width;

    p.background(BACKGROUND_ONE);

    drawDotsInBox(p, {
      boxCenter: { x: width / 2, y: height / 2 },
      randomCenter: {
        u: range(p, 0.6, 0.8),
        v: range(p, 0.2, 0.4),
      },
      width,
      height,
      spread: SPREAD,
      coverage: COVERAGE,
      color: FILL_ONE,
    });

    p.fill(BACKGROUND_ONE);

    const clipPoints = [
      [width * range(p, 0.25, 0.75), 0],
      [width, 0],
      [width, height],
      [width * range(p, 0.25, 0.75), height],
    ];

    p.drawingContext.save();
    clipShape(p, {
      points: clipPoints,
      fillStyle: BACKGROUND_TWO,
    });
    p.drawingContext.restore();

    drawDotsInBox(p, {
      boxCenter: { x: width / 2, y: height / 2 },
      randomCenter: {
        u: range(p, 0.6, 0.8),
        v: range(p, 0.2, 0.4),
      },
      width,
      height,
      spread: SPREAD,
      coverage: COVERAGE,
      color: FILL_TWO,
    });
  };
};

export default sketch;
