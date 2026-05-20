export const ceilMinutes = (milliseconds: number, minimum = 1) =>
  Math.max(minimum, Math.ceil(milliseconds / 60000));
