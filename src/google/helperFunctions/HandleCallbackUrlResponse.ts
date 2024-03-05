import { updateCallbackUrlResponse } from "../types/UpdateCallBackUrlResponse";

/**
 * Parses the update callback URL response payload and extracts necessary information.
 * @param {updateCallbackUrlResponse} payload - The payload containing the update callback URL response.
 * @returns {object} - An object containing passId and eventType extracted from the payload.
 * @throws {Error} - If the payload is invalid or missing necessary fields.
 */
export const handleCallbackUrlResponse = (
  payload: updateCallbackUrlResponse
) => {
  let data = JSON.parse(payload.signedMessage);
  try {
    // Check if the parsed data contains objectId and eventType
    if (data.objectId && data.eventType) {
      let objectId = data.objectId.split(".")[1];
      if (objectId) {
        return {
          passId: objectId,
          eventType: data.eventType,
        };
      }
    } else {
      throw new Error("Invalid Payload !");
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
};
