import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";
import { SystemProgram, Connection, PublicKey } from "@solana/web3.js";
import { assert, expect } from "chai";

const {
  TOKEN_PROGRAM_ID,
  getMint,
  getAssociatedTokenAddress,
  getAccount,
} = require("@solana/spl-token");
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

describe("contract", () => {
  // Configure the client to use the local cluster.
  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  const provider = anchor.AnchorProvider.env();

  const program = anchor.workspace.Contract as Program<Contract>;

  const capsuleMachine = anchor.web3.Keypair.generate();
  const user = provider.wallet;

  it("should initialize the capsule machine", async () => {
    const init_accounts = {
      capsuleMachine: capsuleMachine.publicKey,
      user: user.publicKey,
      systemProgram: SystemProgram.programId,
    };

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

    const [capsulepda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [buf1, capsuleMachine.publicKey.toBytes()],
      program.programId
    );

    const mint = anchor.web3.Keypair.generate();
    // Derive the associated token account address (PDA)
    const tokenAccount = await getAssociatedTokenAddress(
      mint.publicKey, // Mint public key
      user.publicKey // Authority (user) public key
    );

    const accounts = {
      capsuleMachine: capsuleMachine.publicKey,
      user: user.publicKey,
      mint: mint.publicKey,
      tokenAccount: tokenAccount.publicKey,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
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

    // Fetch Mint Account
    const mintAccount = await getMint(connection, mint.publicKey);
    console.log(mintAccount);
    expect(mintAccount.supply).to.equal(BigInt(0)); // Initially, the supply should be 0
    expect(mintAccount.decimals).to.equal(0); // Check for the correct number of decimals (if expected)
    expect(mintAccount.mintAuthority.toString()).to.equal(
      user.publicKey.toString()
    ); // Verify the mint authority

    // Fetch the associated token account
    const ATA = await getAccount(connection, tokenAccount);
    console.log(ATA);
    expect(ATA.mint.toString()).to.equal(mint.publicKey.toString());
    expect(ATA.owner.toString()).to.equal(user.publicKey.toString());
  });
});
