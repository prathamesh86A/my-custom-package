import { cardRowTemplateArray } from "../helperFunctions/CardTemplateRowInfoObject";
import { detailsTemplateInfoArray } from "../helperFunctions/DetailsItemInfoArrayObject";
import { GenericClass } from "../types/generic/GenericClass";

// Generate card row templates (3 rows)
let cardRowTemplates = cardRowTemplateArray(3);

// Generate details item info array (8 items)
let detailsItemInfos = detailsTemplateInfoArray(8);

// Define BonifyFinFitness class
export const BonifyFinFitness: GenericClass = {
  id: "bonifyFinFitness", // ID of the class
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
                  fieldPath: "object.imageModulesData['hero-image']", // Field path for hero image
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
