import { BarcodeRenderEncodingEnum } from "./BarcodeRenderEncoding.js"
import { BarcodeTypeEnum } from "./BarcodeType.js"
import { LocalizedString } from "./LocalizedString.js"
import { TotpDetails } from "./TotpDetails.js"
export type RotatingBarcode = {
	/**
	 * The type of this barcode.
	 */
	type?: BarcodeTypeEnum;
	/**
	 * The render encoding for the barcode. When specified, barcode is rendered in the given encoding. Otherwise best known encoding is chosen by Google.
	 */
	renderEncoding?: BarcodeRenderEncodingEnum;
	/**
	 * String encoded barcode value. This string supports the following substitutions:  * {totp_value_n}: Replaced with the TOTP value (see  TotpDetails.parameters).  * {totp_timestamp_millis}: Replaced with the timestamp (millis since  epoch) at which the barcode was generated.  * {totp_timestamp_seconds}: Replaced with the timestamp (seconds since  epoch) at which the barcode was generated.
	 */
	valuePattern?: string;
	/**
	 * Details used to evaluate the {totp_value_n} substitutions.
	 */
	totpDetails?: TotpDetails;
	/**
	 * An optional text that will override the default text that shows under the barcode. This field is intended for a human readable equivalent of the barcode value, used when the barcode cannot be scanned.
	 */
	alternateText?: string;
	/**
	 * Optional text that will be shown when the barcode is hidden behind a click action. This happens in cases where a pass has Smart Tap enabled. If not specified, a default is chosen by Google.
	 */
	showCodeText?: LocalizedString;
}
