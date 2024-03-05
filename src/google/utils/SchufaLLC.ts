import { cardRowTemplateArray } from "../helperFunctions/CardTemplateRowInfoObject";
import { detailsTemplateInfoArray } from "../helperFunctions/DetailsItemInfoArrayObject";
import { GenericClass } from "../types/generic/GenericClass";

// Generate card row templates (2 rows)
let cardRowTemplates = cardRowTemplateArray(2);

// Generate details item info array (8 items)
let detailsItemInfos = detailsTemplateInfoArray(8);

// Define SchufaLlcClass class
export const SchufaLlcClass: GenericClass = {
  id: "schufaLLC",
  classTemplateInfo: {
    // Card template override
    cardTemplateOverride: {
      cardRowTemplateInfos: cardRowTemplates, // Card row templates
    },
    // Details template override
    detailsTemplateOverride: {
      detailsItemInfos: [
        {
          item: {
            firstValue: {
              fields: [
                {
                  fieldPath: "object.imageModulesData['hero-image']",
                },
              ],
            },
          },
        },
        ...detailsItemInfos, // Add other details item infos
      ],
    },
  },
};
