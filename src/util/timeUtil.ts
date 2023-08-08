export const msToTime = (value: number) => {
  const seconds = value / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  return { seconds, minutes, hours };
};
