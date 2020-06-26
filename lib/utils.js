export const range = (p, min, max) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }

  if (typeof min !== "number" || typeof max !== "number") {
    throw new TypeError("Expected all arguments to be numbers");
  }

  return p.random() * (max - min) + min;
};

export const rangeFloor = (p, min, max) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }

  if (typeof min !== "number" || typeof max !== "number") {
    throw new TypeError("Expected all arguments to be numbers");
  }

  return Math.floor(range(p, min, max));
};

export const pick = (p, array) => {
  if (array.length === 0) return undefined;
  return array[rangeFloor(p, 0, array.length)];
};

export const createGrid = ({ rows, columns }) => {
  const points = [];
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      const u = columns <= 1 ? 0.5 : x / (columns - 1);
      const v = rows <= 1 ? 0.5 : y / (rows - 1);
      points.push({
        position: [u, v],
      });
    }
  }
  return points;
};

export const createContainer = (p) => {
  const container = p.createDiv();
  container.addClass("container");

  return container;
};

export const createCanvas = (p, { id, width, height }) => {
  const canvas = p.createCanvas(width, height);
  canvas.id(id);
  return canvas;
};

export const getCanvasDimension = ({ width, height }) => {
  const widthOffset = 500;
  const heightOffset = 200;
  const dimension = Math.min(width - widthOffset, height - heightOffset);
  return dimension;
};

export const createControlsContainer = (p, { minHeight }) => {
  const controlsContainer = p.createDiv();

  controlsContainer.addClass("controls");
  controlsContainer.style("min-height", minHeight);

  return controlsContainer;
};

export const createSketchLayoutAndKnobs = (p, { id, controls }) => {
  const dimension = getCanvasDimension({
    width: p.windowWidth,
    height: p.windowHeight,
  });

  const container = createContainer(p);
  const canvas = createCanvas(p, {
    id,
    width: dimension,
    height: dimension,
  });

  const controlsContainer = createControlsContainer(p, {
    minHeight: dimension,
  });

  container.child(canvas);
  container.child(controlsContainer);

  const sketchInputs = createControls(p, controls, controlsContainer);

  return {
    sketchInputs,
  };
};

export const createControls = (p, controls, controlsContainer) => {
  let inputsById = {};
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

  return inputsById;
};

export const createControlInput = (p, container, { id, label }) => {
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

export const displayControlValues = (controls, inputsById) => {
  controls.forEach((control) => {
    const current = document.querySelector(`#${control.id} .currentValue`);
    if (!current) return;
    current.innerHTML = inputsById[control.id].value();
  });
};
