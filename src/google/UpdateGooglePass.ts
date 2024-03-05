import { GoogleAuthOptions } from "google-auth-library";
import { GenericClient } from "./GenericClient";
import { PassPayload } from "./types/CreatePassPayload";
import { checkAndUpdateProperty } from "./helperFunctions/CheckAndUpdateProperty";

/**
 * Updates a Google Pass.
 * @param {string} objectId - The ID of the pass object to be updated.
 * @param {PassPayload} payload - The payload containing pass information to be updated.
 * @param {GoogleAuthOptions["credentials"]} credentials - The Google Auth credentials.
 * @param {string} ISSUER_ID - The issuer ID of the pass.
 * @param {string} _private_key -  The private key used for JWT signing.
 * @param {string} _client_email - The client email used for JWT signing.
 * @returns {Promise<{ status: boolean, message: string }>} - A promise indicating whether the pass was updated successfully.
 */
export const updateGooglePass = async (
  objectId: string,
  payload: PassPayload,
  credentials: GoogleAuthOptions["credentials"],
  ISSUER_ID: string,
  _private_key: string,
  _client_email: string
) => {
  try {
    // Check for required fields in the payload
    const requiredFields = ["id", "type", "rows", "details", "barcode"];
    const missingFields = [];
    for (const field of requiredFields) {
      if (!payload[field]) {
        missingFields.push(field);
      }
    }

    // If any required field is missing, reject the promise with an error message
    if (missingFields.length > 0) {
      const errorMessage = `Required fields with empty values in the payload: ${missingFields.join(
        ", "
      )}`;
      return Promise.reject(new Error(errorMessage));
    }

    const generic = new GenericClient(credentials);

    // Generate object suffix by replacing special characters with underscores
    let objectSuffix = `${objectId.replace(/[^\w.-]/g, "_")}`;

    // Get the pass object from the GenericClient
    let genericObject = await generic.getObject(ISSUER_ID, objectSuffix);

    // If the pass object does not exist, throw an error
    if (!genericObject) {
      throw new Error("Pass doesn't exist");
    }

    // Check and update each property of the pass object
    checkAndUpdateProperty(genericObject, payload);

    // Update the pass object in the GenericClient
    genericObject = await generic.updateObject(genericObject);

    return { status: true, message: "Pass is Updated Successfully" };
  } catch (error) {
    throw new Error(`${error}`);
  }
};
