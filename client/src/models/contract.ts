/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/contract.json`.
 */
export type Contract = {
  "address": "DWScEV42ig3zGpZUhVXtuV2BzwQ4oxnFeXiBdZB6uDaZ",
  "metadata": {
    "name": "contract",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createCapsule",
      "discriminator": [
        195,
        104,
        42,
        180,
        127,
        169,
        62,
        3
      ],
      "accounts": [
        {
          "name": "capsule",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "capsule_machine.count",
                "account": "capsuleMachine"
              },
              {
                "kind": "account",
                "path": "capsuleMachine"
              }
            ]
          }
        },
        {
          "name": "capsuleMachine",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "releaseDate",
          "type": "i64"
        },
        {
          "name": "cid",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeCapsuleMachine",
      "discriminator": [
        51,
        16,
        128,
        141,
        32,
        177,
        246,
        110
      ],
      "accounts": [
        {
          "name": "capsuleMachine",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "retrieveCapsule",
      "discriminator": [
        60,
        113,
        202,
        181,
        42,
        236,
        90,
        84
      ],
      "accounts": [
        {
          "name": "capsule",
          "writable": true
        },
        {
          "name": "user",
          "signer": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "capsule",
      "discriminator": [
        212,
        231,
        77,
        219,
        58,
        13,
        118,
        241
      ]
    },
    {
      "name": "capsuleMachine",
      "discriminator": [
        255,
        116,
        191,
        54,
        94,
        250,
        194,
        249
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "accessDenied",
      "msg": "Access denied. The opening date has not been reached."
    }
  ],
  "types": [
    {
      "name": "capsule",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "ipfsCid",
            "type": "string"
          },
          {
            "name": "releasedDate",
            "type": "i64"
          },
          {
            "name": "locked",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "capsuleMachine",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
