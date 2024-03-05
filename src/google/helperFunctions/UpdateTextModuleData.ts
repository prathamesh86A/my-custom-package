import { TextModuleData } from "../GenericClient";
import { RowsType } from "../types";

/**
 * Updates the text module data based on the provided rows data.
 * @param {RowsType[]} data - The rows data containing left, middle, and right values.
 * @returns {TextModuleData[][]} - An array of text module data arrays.
 */
export const updatedTextModuleData = (data: RowsType[]) => {
  return data.map((row, index) => {
    let array: TextModuleData[] = [];
    // Check if left label and value exist, then add to array
    if (row.left_label && row.left_value) {
      array.push({
        id: `row${index + 1}-left`,
        header: row.left_label,
        body: row.left_value,
      });
    }
    // Check if middle label and value exist, then add to array
    if (row.middle_label && row.middle_value) {
      array.push({
        id: `row${index + 1}-mid`,
        header: row.middle_label,
        body: row.middle_value,
      });
    }
    // Check if right label and value exist, then add to array
    if (row.right_label && row.right_value) {
      array.push({
        id: `row${index + 1}-right`,
        header: row.right_label,
        body: row.right_value,
      });
    }
    return array;
  });
};
