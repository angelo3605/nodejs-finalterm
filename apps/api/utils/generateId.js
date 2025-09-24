export const generateObjectId = () => {
  return [...Array(12)]
    .map(() =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
};
