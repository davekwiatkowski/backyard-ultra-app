export enum DistanceType {
  Yards = 'Yards',
  Miles = 'Miles',
  Kilometers = 'Kilometers',
}
export const distanceTypes = [
  DistanceType.Yards,
  DistanceType.Miles,
  DistanceType.Kilometers,
] as const;
