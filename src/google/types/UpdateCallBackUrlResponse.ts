export type updateCallbackUrlResponse = {
  signature?: string;
  intermediateSigningKey: {
    signedKey?: {
      keyValue: string;
      keyExpiration: string;
    };
    signatures?: [];
  };
  protocolVersion?: string;
  signedMessage: string;
};
