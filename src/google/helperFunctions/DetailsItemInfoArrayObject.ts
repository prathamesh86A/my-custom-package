export const detailsTemplateInfoArray = (length: number) => {
  let detailsItemInfoArray = new Array(length);
  return detailsItemInfoArray.map((el, ind) => {
    return {
      item: {
        firstValue: {
          fields: [
            {
              fieldPath: `object.textModulesData['detail-${ind + 1}']`,
            },
          ],
        },
      },
    };
  });
};
