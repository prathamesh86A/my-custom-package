import { GoogleAuthOptions } from "google-auth-library";
import { CardTypeEnum } from "./types";
import { GenericClient } from "./GenericClient";

/**
 * Updates the callback URL for a specific pass type.
 * @param {CardTypeEnum} passType - The type of pass for which the callback URL is to be updated.
 * @param {string} callbackUrl - The new callback URL.
 * @param {GoogleAuthOptions["credentials"]} credentials - The Google Auth credentials.
 * @param {string} ISSUER_ID - The issuer ID of the pass.
 * @returns {Promise<{ status: boolean, message: string }>} - A promise indicating whether the callback URL was updated successfully.
 */
export const updateCallbackUrl = async (
  passType: CardTypeEnum,
  callbackUrl: string,
  credentials: GoogleAuthOptions["credentials"],
  ISSUER_ID: string
) => {
  try {
    let generic = new GenericClient(credentials);

    // Get the class for the specified pass type
    let genericClass = await generic.getClass(ISSUER_ID, passType);

    if (!genericClass) {
      throw new Error("PassType doesn't exist");
    }

    // Update the callback URL in the class
    genericClass.callbackOptions = { url: callbackUrl };

    // Update the class in the GenericClient
    genericClass = await generic.updateClass(genericClass);

    return { status: true, message: "Callback URL is successfully updated" };
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};
