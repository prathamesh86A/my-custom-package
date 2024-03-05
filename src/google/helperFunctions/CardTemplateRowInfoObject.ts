/**
 * Generates an array of card row templates based on the provided length.
 * @param {number} length - The length of the array to be generated.
 * @returns {Array} - An array of card row templates.
 */
export const cardRowTemplateArray = (length: number) => {
  let cardRowTemplate = new Array(length);
  return cardRowTemplate.map((el, ind) => {
    return {
      twoItems: {
        startItem: {
          firstValue: {
            fields: [
              {
                fieldPath: `object.textModulesData['row${ind + 1}-left']`,
              },
            ],
          },
        },
        endItem: {
          firstValue: {
            fields: [
              {
                fieldPath: `object.textModulesData['row${ind + 1}-right']`,
              },
            ],
          },
        },
      },
    };
  });
};
