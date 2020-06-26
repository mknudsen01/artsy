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
