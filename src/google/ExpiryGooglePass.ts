import { GoogleAuthOptions } from "google-auth-library";
import { GenericClient } from "./GenericClient";
import { StateEnum } from "./types/generic";
import { PassPayload } from "./types/CreatePassPayload";

/**
 * Expires a Google Pass.
 * @param {string} objectId - The ID of the pass object to be expired.
 * @param {PassPayload} _payload - Unused parameter (pass payload).
 * @param {GoogleAuthOptions["credentials"]} credentials - The Google Auth credentials.
 * @param {string} ISSUER_ID - The issuer ID of the pass.
 * @param {string} _private_key -  The private key used for JWT signing.
 * @param {string} _client_email - The client email used for JWT signing.
 * @returns {Promise<{ status: boolean, message: string }>} - A promise indicating whether the pass was successfully expired.
 */
export const expireGooglePass = async (
  objectId: string,
  _payload: PassPayload,
  credentials: GoogleAuthOptions["credentials"],
  ISSUER_ID: string,
  _private_key: string,
  _client_email: string
) => {
  try {
    const generic = new GenericClient(credentials);

    let objectSuffix = `${objectId.replace(/[^\w.-]/g, "_")}`;

    // Get the pass object from the GenericClient
    let genericObject = await generic.getObject(ISSUER_ID, objectSuffix);

    if (!genericObject) {
      throw new Error("Pass doesn't exist");
    }

    // Set pass state to EXPIRED
    genericObject.state = StateEnum.EXPIRED;

    return { status: true, message: "Pass is Successfully Expired" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
