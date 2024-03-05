import { GoogleAuthOptions } from "google-auth-library";
import { GenericClient } from "./GenericClient";
import { StateEnum } from "./types/generic";
import { PassPayload } from "./types/CreatePassPayload";

/**
 * Expires a Google Pass and schedules an expiry notification.
 * @param {string} objectId - The ID of the pass object to be expired.
 * @param {PassPayload} _payload - Unused parameter (pass payload).
 * @param {GoogleAuthOptions["credentials"]} credentials - The Google Auth credentials.
 * @param {string} ISSUER_ID - The issuer ID of the pass.
 * @param {string} _private_key -  The private key used for JWT signing.
 * @param {string} _client_email - The client email used for JWT signing.
 * @returns {Promise<{ status: boolean, message: string }>} - A promise indicating whether the pass expiry was updated successfully.
 */
export const expireGooglePassAndNotify = async (
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
    console.log({ genericObject });

    if (!genericObject) {
      throw new Error("Pass doesn't exist");
    }

    // Remove notifications and valid time interval to prevent conflicts
    genericObject.notifications = undefined;
    genericObject.validTimeInterval = undefined;

    // Schedule an expiry notification after 10 seconds
    setTimeout(async () => {
      if (genericObject) {
        // Enable expiry notification
        genericObject.notifications = {
          expiryNotification: {
            enableNotification: true,
          },
        };

        genericObject.state = StateEnum.ACTIVE;

        // Calculate expiry date (2 days later from current date)
        const currentDate = new Date();
        const twoDaysLater = new Date(currentDate);
        twoDaysLater.setDate(currentDate.getDate() + 2);

        // Set valid time interval to end two days later
        genericObject.validTimeInterval = {
          ...genericObject.validTimeInterval,
          end: {
            date: twoDaysLater.toISOString(),
          },
        };

        // Update the pass object with the new expiry settings
        genericObject = await generic.updateObject(genericObject);
      }
    }, 10000);

    return { status: true, message: "Expiry is Updated Successfully" };
  } catch (error) {
    throw new Error(`${error}`);
  }
};
