import {
  GenericObject,
  BarcodeTypeEnum,
  TextModuleData,
} from "../GenericClient";
import { PassPayload, RowsType } from "../types";
import { updatedTextModuleData } from "./UpdateTextModuleData";

/**
 * Checks and updates properties of the generic object based on the provided payload.
 * @param {GenericObject} genericObject - The generic object to update.
 * @param {PassPayload} payload - The payload containing updated properties.
 */
export const checkAndUpdateProperty = (
  genericObject: GenericObject,
  payload: PassPayload
) => {
  if (payload.logoUrl && genericObject.logo && genericObject.logo.sourceUri) {
    genericObject.logo.sourceUri.uri = payload.logoUrl;
  }

  if (
    payload.title &&
    genericObject.cardTitle &&
    genericObject.cardTitle.defaultValue
  ) {
    genericObject.cardTitle.defaultValue.value = payload.title;
  }

  if (
    payload.subheader &&
    genericObject.subheader &&
    genericObject.subheader.defaultValue
  ) {
    genericObject.subheader.defaultValue.value = payload.subheader;
  }

  if (payload.header && genericObject.header.defaultValue) {
    genericObject.header.defaultValue.value = payload.header;
  }

  if (payload.hexaBackground) {
    genericObject.hexBackgroundColor = payload.hexaBackground;
  }

  if (
    payload.heroImageUrl &&
    genericObject.heroImage &&
    genericObject.heroImage.sourceUri
  ) {
    genericObject.heroImage.sourceUri.uri = payload.heroImageUrl;
  }

  if (payload.barcode && payload.barcode.isEnable) {
    genericObject.barcode = {
      type: BarcodeTypeEnum.QR_CODE,
      value: payload.barcode.value,
      alternateText: payload.barcode.alternateText,
    };
  }

  if (payload.details) {
    let detailsRows: TextModuleData[] = payload.details.map((detail, index) => {
      return {
        id: `detail-${index + 1}`,
        header: detail.title,
        body: detail.body,
      };
    });
    if (genericObject.textModulesData) {
      let newTextModuleData = genericObject.textModulesData.filter(
        (data: TextModuleData) => data.id && data.id.includes("row")
      );
      genericObject.textModulesData = [...newTextModuleData, ...detailsRows];
    }
  }

  if (payload.rows) {
    let payloadRows: RowsType[] = payload.rows;
    let rows = updatedTextModuleData(payloadRows);

    let cardDetailsRow: TextModuleData[] = rows.flat();
    if (genericObject.textModulesData) {
      let newTextModuleData = genericObject.textModulesData.filter(
        (data: TextModuleData) => data.id && data.id.includes("detail")
      );

      genericObject.textModulesData = [...cardDetailsRow, ...newTextModuleData];
    }
  }
};
