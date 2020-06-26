import { palettes } from "../../lib/constants";
import { pick, createGrid } from "../../lib/utils";

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
    type: "SLIDER",
    label: "Color Count",
    id: "colorCount",
    min: 1,
    max: 6,
    defaultValue: 2,
    step: 1,
  },
  {
    type: "SLIDER",
    label: "Line Weight",
    id: "strokeWeight",
    min: 1,
    max: 10,
    defaultValue: 2,
    step: 0.5,
  },
  {
    type: "SLIDER",
    label: "Line count",
    id: "lineCount",
    min: 5,
    max: 100,
    defaultValue: 50,
    step: 5,
  },
  {
    type: "SLIDER",
    label: "Line length",
    id: "lineLength",
    min: 1,
    max: 30,
    defaultValue: 15,
    step: 1,
  },
  {
    type: "SLIDER",
    label: "Palette",
    id: "palette",
    min: 1,
    max: 10,
    defaultValue: 1,
    step: 1,
  },
  {
    type: "SLIDER",
    label: "Percent of lines to discard",
    id: "throwawayPercent",
    min: 0,
    max: 100,
    defaultValue: 0,
    step: 2,
  },
  {
    type: "SLIDER",
    label: "Frequency",
    id: "frequency",
    min: 0.5,
    max: 10,
    defaultValue: 4,
    step: 0.5,
  },
  {
    type: "SLIDER",
    label: "Amplitude",
    id: "amplitude",
    min: 0.5,
    max: 10,
    defaultValue: 3,
    step: 0.5,
  },
  {
    type: "COLOR",
    label: "Background",
    id: "background",
    defaultValue: "#FFF",
  },
  {
    type: "BUTTON",
    label: "Redraw",
    id: "redraw",
  },
];
let inputsById = {};

const getCanvasDimension = ({ width, height }) => {
  const widthOffset = 500;
  const heightOffset = 200;
  const dimension = Math.min(width - widthOffset, height - heightOffset);
  return dimension;
};

const createControlInput = (p, container, { id, label }) => {
  const controlEl = p.createDiv();
  controlEl.addClass("control");
  controlEl.id(id);
  const controlDisplay = p.createDiv();
  controlDisplay.addClass("control__display");
  container.child(controlEl);
  controlEl.child(controlDisplay);
  let labelElement = p.createDiv(label);
  labelElement.addClass("label");
  let currentValueElement = p.createDiv();
  currentValueElement.addClass("currentValue");
  controlDisplay.child(labelElement);
  controlDisplay.child(currentValueElement);

  return controlEl;
};

const sketch = (p) => {
  p.setup = () => {
    p.remove();
    p.noLoop();
    p.angleMode(p.RADIANS);

    p.windowHeight = window.innerHeight;
    p.windowWidth = window.innerWidth;

    const dimension = getCanvasDimension({
      width: p.windowWidth,
      height: p.windowHeight,
    });

    const container = p.createDiv();
    container.addClass("container");
    const canvas = p.createCanvas(dimension, dimension);
    canvas.id("noise");
    container.child(canvas);
    const controlsContainer = p.createDiv();

    controlsContainer.addClass("controls");
    controlsContainer.style("min-height", dimension);
    container.child(controlsContainer);

    controls.forEach((control) => {
      if (control.type === "SLIDER") {
        const { min, max, label, id, defaultValue, step } = control;
        const controlEl = createControlInput(p, controlsContainer, {
          id,
          label,
        });

        let slider = p.createSlider(min, max, defaultValue, step);
        inputsById[id] = slider;
        slider.input(() => p.redraw());
        controlEl.child(slider);
      } else if (control.type === "BUTTON") {
        const { label } = control;
        const button = p.createButton(label);
        button.mouseClicked(() => {
          p.redraw();
        });
        controlsContainer.child(button);
      } else if (control.type === "COLOR") {
        const { label, id, defaultValue } = control;
        const controlEl = createControlInput(p, controlsContainer, {
          id,
          label,
        });

        const picker = p.createColorPicker(defaultValue);
        picker.input(() => p.redraw());
        inputsById[id] = picker;
        controlEl.child(picker);
      }
    });
  };

  p.draw = () => {
    const SEED = inputsById.seed.value();
    p.noiseSeed(SEED);
    p.randomSeed(SEED);

    controls.forEach((control) => {
      const current = document.querySelector(`#${control.id} .currentValue`);
      if (!current) return;
      current.innerHTML = inputsById[control.id].value();
    });

    const BACKGROUND_COLOR = inputsById.background.value();
    const COLOR_COUNT = inputsById.colorCount.value();
    const STROKE_WEIGHT = inputsById.strokeWeight.value();
    const COLUMN_COUNT = inputsById.lineCount.value();
    const PALETTE_INDEX = inputsById.palette.value();
    const THROWAWAY_THRESHOLD = inputsById.throwawayPercent.value() / 100;
    const LINE_LENGTH = inputsById.lineLength.value();
    const FREQUENCY = inputsById.frequency.value();
    const AMPLITUDE = inputsById.amplitude.value();

    const palette = p.shuffle(palettes[PALETTE_INDEX]).slice(0, COLOR_COUNT);

    const width = getCanvasDimension({
      width: p.windowWidth,
      height: p.windowHeight,
    });
    const height = width;

    const augmentGrid = (points) => {
      return points.map((point) => {
        const { position } = point;
        const [u, v] = position;

        return {
          ...point,
          color: pick(p, palette),
          rotation: p.noise(u * FREQUENCY, v * FREQUENCY) * AMPLITUDE,
        };
      });
    };

    const grid = createGrid({ rows: COLUMN_COUNT, columns: COLUMN_COUNT });
    const points = augmentGrid(grid).filter(
      () => p.random() > THROWAWAY_THRESHOLD
    );

    p.background(BACKGROUND_COLOR);

    points.forEach((data) => {
      const { position, color, rotation } = data;
      const [u, v] = position;

      const x = p.lerp(0, width, u);
      const y = p.lerp(0, height, v);

      p.stroke(color);
      p.strokeWeight(STROKE_WEIGHT);

      p.translate(x, y);
      p.rotate(rotation);
      p.line(
        -LINE_LENGTH / 2,
        -LINE_LENGTH / 2,
        LINE_LENGTH / 2,
        LINE_LENGTH / 2
      );
      p.rotate(-rotation);
      p.translate(-x, -y);
    });
  };

  p.windowResized = () => {
    const dimension = getCanvasDimension({
      width: p.windowWidth,
      height: p.windowHeight,
    });
    console.log("ginna resize to ", dimension);
    p.resizeCanvas(dimension, dimension);
  };
};

export default sketch;

// let noiseSketch;
// noiseSketch = new p5(sketch);

// window.View = new View();
// View.setSketch(sketch);

// document.addEventListener("turbolinks:load", function (e) {
//   const body = document.querySelector("body");
//   if (body.id === "noise") {
//     if (!noiseSketch) {
//       console.log("making a new one");
//       noiseSketch = new p5(sketch);
//     } else {
//       console.log("using the old one");
//       noiseSketch.setup();
//       noiseSketch.draw();
//     }
//   }
// });
