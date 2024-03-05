import { GoogleAuthOptions } from "google-auth-library";
import { GenericClient } from "./GenericClient";
import { StateEnum } from "./types/generic";
import { PassPayload } from "./types/CreatePassPayload";
import { checkAndUpdateProperty } from "./helperFunctions/CheckAndUpdateProperty";

/**
 * Updates a Google Pass and schedules a notification.
 * @param {string} objectId - The ID of the pass object to be updated.
 * @param {PassPayload} payload - The payload containing pass information to be updated.
 * @param {GoogleAuthOptions["credentials"]} credentials - The Google Auth credentials.
 * @param {string} ISSUER_ID - The issuer ID of the pass.
 * @param {string} _private_key - The private key used for JWT signing.
 * @param {string} _client_email - The client email used for JWT signing.
 * @returns {Promise<{ status: boolean, message: string }>} - A promise indicating whether the pass was updated successfully.
 */
export const updateGooglePassAndNotify = async (
  objectId: string,
  payload: PassPayload,
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

    // If the pass object does not exist, throw an error
    if (!genericObject) {
      throw new Error("Pass doesn't exist");
    }

    // Remove notifications and valid time interval to prevent conflicts
    genericObject.notifications = undefined;
    genericObject.validTimeInterval = undefined;

    // Check and update each property of the pass object
    checkAndUpdateProperty(genericObject, payload);

    // Update the pass object in the GenericClient
    genericObject = await generic.updateObject(genericObject);

    // Schedule a notification after 30 seconds
    setTimeout(async () => {
      if (genericObject) {
        genericObject.notifications = {
          upcomingNotification: {
            enableNotification: true,
          },
        };

        genericObject.state = StateEnum.ACTIVE;

        // Set valid time interval to start from tomorrow
        const currentDate = new Date();
        const tomorrow = new Date(currentDate);
        tomorrow.setDate(currentDate.getDate() + 1);

        genericObject.validTimeInterval = {
          start: {
            date: tomorrow.toISOString(),
          },
        };

        // Update the pass object with the new notification settings
        genericObject = await generic.updateObject(genericObject);
      }
    }, 30000);

    return { status: true, message: "Pass is Updated Successfully" };
  } catch (error) {
    throw error;
  }
};
