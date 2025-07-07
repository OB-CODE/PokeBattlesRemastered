export const FarmlandsArray = [10, 13, 16, 19, 21, 41];

export const fireTypeArray = [
  4, 5, 6, 37, 38, 58, 59, 77, 78, 126, 128, 136, 146,
];

export const waterTypeArray = [
  7, 8, 9, 60, 61, 72, 73, 79, 86, 87, 90, 91, 116, 117, 118, 119, 120, 121,
  129, 130, 131,
];

export const grassTypeArray = [
  1, 2, 3, 43, 44, 45, 46, 47, 69, 70, 71, 100, 101, 102, 103, 114,
];

export const deeperWildernessArray = [
  142, 141, 140, 139, 138, 136, 135, 134, 133, 130, 129, 128, 127, 110, 107,
  105, 103, 99, 97, 94, 93, 92, 91, 71,
];

export const rareTypeArray = [
  3, 6, 9, 151, 150, 149, 148, 147, 145, 144, 143, 137, 132, 125,
];

export const scrapyardArray = [
  52, 53, 55, 56, 57, 66, 67, 68, 62, 34, 31, 28, 26, 94, 104, 106, 105, 107,
];

export const jungleArray = Array.from({ length: 151 }, (_, i) => i + 1)
  .filter(
    (num) =>
      ![
        ...FarmlandsArray,
        ...fireTypeArray,
        ...waterTypeArray,
        ...grassTypeArray,
        ...deeperWildernessArray,
        ...rareTypeArray,
        ...scrapyardArray,
      ].includes(num)
  )
  .slice(0, 20);

export const wildernessArray = Array.from(
  { length: 151 },
  (_, i) => i + 1
).filter(
  (num) =>
    ![
      ...FarmlandsArray,
      ...fireTypeArray,
      ...waterTypeArray,
      ...grassTypeArray,
      ...deeperWildernessArray,
      ...rareTypeArray,
      ...scrapyardArray,
      ...jungleArray,
    ].includes(num)
);
