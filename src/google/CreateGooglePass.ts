import { PassPayload } from "./types/CreatePassPayload";
import { GenericClient } from "./GenericClient";
import {
  BarcodeTypeEnum,
  ImageModuleData,
  TextModuleData,
} from "./types/generic";
import { SchufaLlcClass } from "./utils/SchufaLLC";
import { BonifyFinFitness } from "./utils/BonifyFinFitness";
import { SchufaBasisScore } from "./utils/SchufaBasisScore";
import { BonifyLLC } from "./utils/BonifyLLC";
import { GoogleAuthOptions } from "google-auth-library";
import { updatedTextModuleData } from "./helperFunctions/UpdateTextModuleData";
import { RowsType } from "./types";

const jwt = require("jsonwebtoken");

/**
 * Creates a Google Pass based on the provided payload and parameters.
 * @param {PassPayload} payload - The payload containing data to create the pass.
 * @param {GoogleAuthOptions["credentials"]} credentials - Google authentication credentials.
 * @param {string} ISSUER_ID - The ID of the issuer.
 * @param {string} private_key - The private key used for JWT signing.
 * @param {string} client_email - The client email used for JWT signing.
 * @returns {Promise<{saveUrl: string, passId: string}>} - A promise that resolves to an object containing the save URL and pass ID.
 */
export const createGooglePass = async (
  payload: PassPayload,
  credentials: GoogleAuthOptions["credentials"],
  ISSUER_ID: string,
  private_key: string,
  client_email: string
) => {
  try {
    // Check if required fields are present in the payload
    const requiredFields = ["id", "type", "rows", "details", "barcode"];
    const missingFields = [];
    for (const field of requiredFields) {
      if (!payload[field]) {
        missingFields.push(field);
      }
    }

    // Reject the promise if any required field is missing
    if (missingFields.length > 0) {
      const errorMessage = `Required fields with empty values in the payload: ${missingFields.join(
        ", "
      )}`;
      return Promise.reject(new Error(errorMessage));
    }

    let generic = new GenericClient(credentials);

    // Retrieve class information for the pass type
    let genericClass = await generic.getClass(ISSUER_ID, payload.type);

    // If the class doesn't exist, dynamically generate it based on the pass type
    if (!genericClass) {
      if (payload?.type === "schufaLLC") {
        let classObject = SchufaLlcClass;
        classObject.id = `${ISSUER_ID}.schufaLLC`;
        console.log("Class Inserted Successfully");
      } else if (payload?.type === "bonifyFinFitness") {
        let classObject = BonifyFinFitness;
        classObject.id = `${ISSUER_ID}.bonifyFinFitness`;
        console.log("Class Inserted Successfully");
      } else if (payload?.type === "schufaBasisScore") {
        let classObject = SchufaBasisScore;
        classObject.id = `${ISSUER_ID}.schufaBasisScore`;
        console.log("Class Inserted Successfully");
      } else if (payload?.type === "bonifyLLC") {
        let classObject = BonifyLLC;
        classObject.id = `${ISSUER_ID}.bonifyLLC`;
        console.log("Class Inserted Successfully");
      } else {
        throw new Error("Class is not generated");
      }
    }

    let objectSuffix = `${payload.id.replace(/[^\w.-]/g, "_")}`;
    let objectId = `${ISSUER_ID}.${objectSuffix}`;
    let classId = `${ISSUER_ID}.${payload.type}`;

    // Retrieve object information
    let genericObject = await generic.getObject(ISSUER_ID, objectSuffix);

    if (!genericObject) {
      let payloadRows: RowsType[] = payload.rows;
      let rows = updatedTextModuleData(payloadRows);

      let imageModulesData: ImageModuleData[] = [];
      imageModulesData.push({
        mainImage: {
          sourceUri: { uri: payload.heroImageUrl },
        },
        id: `hero-image`,
      });

      let cardDetailsRow: TextModuleData[] = rows.flat();

      let detailsRows: TextModuleData[] = payload.details.map(
        (detail, index) => {
          return {
            id: `detail-${index + 1}`,
            header: detail.title,
            body: detail.body,
          };
        }
      );

      let textModulesData: TextModuleData[] = [
        ...cardDetailsRow,
        ...detailsRows,
      ];

      genericObject = {
        id: objectId,
        classId: classId,
        logo: {
          sourceUri: {
            uri: payload.logoUrl,
          },
          contentDescription: {
            defaultValue: {
              language: "en-US",
              value: "LOGO_IMAGE_DESCRIPTION",
            },
          },
        },
        cardTitle: {
          defaultValue: {
            language: "en-US",
            value: payload.title,
          },
        },
        subheader: {
          defaultValue: {
            language: "en-US",
            value: payload.subheader,
          },
        },
        header: {
          defaultValue: {
            language: "en-US",
            value: payload.header,
          },
        },
        textModulesData,
        barcode: payload.barcode.isEnable
          ? {
              type: BarcodeTypeEnum.QR_CODE,
              value: payload.barcode.value,
              alternateText: payload.barcode.alternateText,
            }
          : undefined,
        hexBackgroundColor: payload.hexaBackground,
        heroImage: {
          sourceUri: {
            uri: payload.heroImageUrl,
          },
          contentDescription: {
            defaultValue: {
              language: "en-US",
              value: "HERO_IMAGE_DESCRIPTION",
            },
          },
        },
        imageModulesData,
      };

      genericObject = await generic.createObject(genericObject);
      console.log("Object created Successfully");
    } else {
      console.log("Object Already exist");
    }

    const claims = {
      iss: client_email,
      aud: "google",
      origins: [],
      typ: "savetowallet",
      payload: {
        genericObjects: [genericObject],
      },
    };

    // Sign the claims with the private key
    const token = jwt.sign(claims, private_key, {
      algorithm: "RS256",
    });

    // Construct the save URL
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;

    // Return the save URL and pass ID
    return { saveUrl, passId: objectSuffix };
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
