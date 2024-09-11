import { Idl } from "@coral-xyz/anchor";

export const mockIdl: Idl = {
    version: "0.1.0",
    name: "mock_contract",
    instructions: [
      {
        name: "createCapsule",
        accounts: [],
        args: [
          {
            name: "releaseDate",
            type: "i64"
          },
          {
            name: "ipfsHash",
            type: "string"
          }
        ]
      }
    ],
    accounts: [],
    errors: []
  };