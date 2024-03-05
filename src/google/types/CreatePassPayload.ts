import { BarcodeType } from "./BarcodeType";
import { CardTypeEnum } from "./CardTypeEnum";
import { DetailsType } from "./DetailsTypes";
import { RowsType } from "./RowsType";

export type PassPayload = {
  /**
   * Data requrired in Request Payload
   */
  id: string;
  type: CardTypeEnum;
  logoUrl: string;
  title: string;
  subheader: string;
  header: string;
  rows: RowsType[];
  hexaBackground: string;
  heroImageUrl: string;
  details: DetailsType[];
  barcode: BarcodeType;
  [key: string]: any;
};
