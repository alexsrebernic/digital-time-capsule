import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";
import { SystemProgram, Connection, PublicKey, Keypair } from "@solana/web3.js";
import { assert, expect } from "chai";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

const {
  TOKEN_PROGRAM_ID,
  getMint,
  getAssociatedTokenAddressSync,
  getAccount,
} = require("@solana/spl-token");
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
const METADATA_PROGRAM_ID: PublicKey = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

describe("contract", () => {
  // Configure the client to use the local cluster.
  //const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  //const provider = anchor.AnchorProvider.env();
  const fs = require("fs");
  const userKeypairPath =
    require("os").homedir() + "/my-solana-wallet/my-keypair.json";
  const userKeypair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(userKeypairPath, "utf8")))
  );
  const user = new anchor.Wallet(userKeypair);
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  const provider = new anchor.AnchorProvider(connection, user, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);

  const program = anchor.workspace.Contract as Program<Contract>;

  const capsuleMachine = anchor.web3.Keypair.generate();
  //const user = provider.wallet;

  it("should initialize the capsule machine", async () => {
    /*const airdropSignature = await provider.connection.requestAirdrop(
      user.publicKey,
      2 * 1000000000
    );

    const latestBlockHash = await provider.connection.getLatestBlockhash();

    await provider.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    });
    console.log("airdrop confirmed {}", airdropSignature);*/

    const init_accounts = {
      capsuleMachine: capsuleMachine.publicKey,
      user: user.publicKey,
      systemProgram: SystemProgram.programId,
    };

    //console.log(init_accounts);
    const tx = await program.methods
      .initializeCapsuleMachine()
      .accounts(init_accounts)
      .signers([capsuleMachine])
      .rpc();

    console.log("Your transaction signature", tx);

    // Fetch the capsule machine and check its state
    const capsuleMachineAccount = await program.account.capsuleMachine.fetch(
      capsuleMachine.publicKey
    );
    assert.equal(
      capsuleMachineAccount.count.toNumber(),
      0,
      "Capsule machine count should be 0"
    );
  });

  it("should create a capsule", async () => {
    const releaseDate = new anchor.BN(Date.now() / 1000 + 60 * 60 * 24); // One day in the future
    const cid = "QmYourIpfsCidHere";

    // Get capsule_machine index
    let idx = (
      await program.account.capsuleMachine.fetch(capsuleMachine.publicKey)
    ).count;
    // Consutruct buffer containing latest index
    const buf1 = idx.toArrayLike(Buffer, "be", 8);
    //Derive Capsule pda
    const [capsulepda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [buf1, capsuleMachine.publicKey.toBytes()],
      program.programId
    );

    const mint = anchor.web3.Keypair.generate();
    // Derive the associated token account address (PDA)
    const tokenAccount = getAssociatedTokenAddressSync(
      mint.publicKey, // Mint public key
      user.publicKey, // Authority (user) public key
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_PROGRAM_ID
    );
    console.log("tokenAccount {}", tokenAccount);

    // Derive Metadata pda
    const [metadataPda, metadataBump] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          METADATA_PROGRAM_ID.toBuffer(),
          mint.publicKey.toBuffer(),
        ],
        METADATA_PROGRAM_ID
      );

    const accounts = {
      capsuleMachine: capsuleMachine.publicKey,
      user: user.publicKey,
      mint: mint.publicKey,
      tokenAccount: tokenAccount,
      //metadata: metadataPda,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      //metadataProgram: METADATA_PROGRAM_ID,
    };

    console.log(accounts);

    try {
      const tx = await program.methods
        .createCapsule(releaseDate, cid)
        .accounts(accounts)
        .signers([mint])
        .rpc();

      console.log("Your transaction signature", tx);
    } catch (error) {
      if (error instanceof anchor.web3.SendTransactionError) {
        // Retrieve logs for detailed error
        const logs = error.logs || error.message || "Unknown error";
        console.error("Transaction failed. Logs:", logs);

        // Optionally, you can call `getLogs()` on the error if it's available
        if (error.getLogs) {
          const detailedLogs = error.getLogs(connection);
          console.error("Detailed logs:", detailedLogs);
        }
      } else {
        // Handle other types of errors
        console.error("An unexpected error occurred:", error);
      }
    }

    // Fetch Capsule Account
    let capsuleData = await program.account.capsule.fetch(capsulepda);
    console.log(capsuleData);
    expect(capsuleData.creator.toString()).to.equal(user.publicKey.toString());
    expect(capsuleData.locked).to.equal(true);
    console.log("capsule data ok");
    // Fetch Mint Account
    const mintAccount = await getMint(connection, mint.publicKey);
    console.log(mintAccount);
    expect(mintAccount.supply).to.equal(BigInt(0)); // Initially, the supply should be 0
    expect(mintAccount.decimals).to.equal(0); // Check for the correct number of decimals (if expected)
    expect(mintAccount.mintAuthority.toString()).to.equal(
      user.publicKey.toString()
    ); // Verify the mint authority
    console.log("mint ok");
    // Fetch the associated token account
    const ATA = await getAccount(connection, tokenAccount);
    console.log("ATA", ATA);
    expect(ATA.mint.toString()).to.equal(mint.publicKey.toString());
    expect(ATA.owner.toString()).to.equal(user.publicKey.toString());
    console.log("ata ok");
    //Fetch Metadata account
    //const metadataAccountInfo = await connection.getAccountInfo(metadataPda);
    //expect(metadataAccountInfo).to.not.be.null;
    //console.log("Metadata Account Info:", metadataAccountInfo);
  });

  it("should retrieve a capsule", async () => {
    // Get capsule_machine index

    let current_count = (
      await program.account.capsuleMachine.fetch(capsuleMachine.publicKey)
    ).count;

    //kinda hardcoding the capsule to retrieve wich its seed is the previous value stored in capsule machine count
    let idx = Number(current_count) - 1;
    let idx_bn = new anchor.BN(idx);

    // Consutruct buffer containing latest index
    const buf1 = idx_bn.toArrayLike(Buffer, "be", 8);
    //Derive Capsule pda
    const [capsulepda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [buf1, capsuleMachine.publicKey.toBytes()],
      program.programId
    );

    const accounts = {
      capsule: capsulepda,
      user: user.publicKey,
    };

    console.log(accounts);

    try {
      const tx = await program.methods
        .retrieveCapsule()
        .accounts(accounts)
        .signers([])
        .rpc();

      console.log("Your transaction signature", tx);
    } catch (error) {
      if (error instanceof anchor.web3.SendTransactionError) {
        // Retrieve logs for detailed error
        const logs = error.logs || error.message || "Unknown error";
        console.error("Transaction failed. Logs:", logs);

        // Optionally, you can call `getLogs()` on the error if it's available
        if (error.getLogs) {
          const detailedLogs = error.getLogs(connection);
          console.error("Detailed logs:", detailedLogs);
        }
      } else {
        // Handle other types of errors
        console.error("An unexpected error occurred:", error);
      }
    }

    // Fetch Capsule Account
    let capsuleData = await program.account.capsule.fetch(capsulepda);
    console.log(capsuleData);
    expect(capsuleData.creator.toString()).to.equal(user.publicKey.toString());
  });
});
