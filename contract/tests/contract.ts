import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contract } from "../target/types/contract";
import { SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

const TOKEN_METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
const ASSOCIATED_TOKEN_PROGRAM_ID =
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";

describe("capsule contract tests", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();

  const program = anchor.workspace.Contract as Program<Contract>;

  const capsuleMachine = anchor.web3.Keypair.generate();
  const user = provider.wallet;

  const metadata_token_program_key = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  const associated_token_program_key = new anchor.web3.PublicKey(
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
  );

  it("should initialize the capsule machine", async () => {
    const init_accounts = {
      capsuleMachine: capsuleMachine.publicKey,
      user: user.publicKey,
      systemProgram: SystemProgram.programId,
    };

    await program.methods
      .initializeCapsuleMachine()
      .accounts(init_accounts)
      .signers([capsuleMachine])
      .rpc();

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

  it("should create a capsule and mint an NFT", async () => {
    const rent = anchor.web3.SYSVAR_RENT_PUBKEY;
    const mint = anchor.web3.Keypair.generate(); // Mint for the NFT
    const tokenAccount = anchor.web3.Keypair.generate();

    const releaseDate = new anchor.BN(Date.now() / 1000 + 60 * 60 * 24); // One day in the future
    const cid = "QmYourIpfsCidHere";

    const capsuleMachineAccount = await program.account.capsuleMachine.fetch(
      capsuleMachine.publicKey
    );

    let [capsulePda, capsule_bump] =
      anchor.web3.PublicKey.findProgramAddressSync(
        [
          new anchor.BN(capsuleMachineAccount.count).toArrayLike(
            Buffer,
            "be",
            8
          ),
          capsuleMachine.publicKey.toBuffer(),
        ],
        program.programId
      );

    let [metadata, meta_bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        metadata_token_program_key.toBuffer(),
        mint.publicKey.toBuffer(),
      ],
      metadata_token_program_key
    );

    let [master, master_bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        metadata_token_program_key.toBuffer(),
        mint.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      metadata_token_program_key
    );

    //const [metadata] = await Metadata.findPda(mint.publicKey);
    //const [master] = await MasterEdition.findPda(mint.publicKey);

    const accounts = {
      capsule: capsulePda,
      user: user.publicKey,
      capsuleMachine: capsuleMachine.publicKey,
      mint: mint.publicKey,
      metadata: metadata, // Metadata PDA
      masterEdition: master, // Master edition PDA
      tokenAccount: tokenAccount.publicKey, // Associated token account
      tokenMetadataProgram: metadata_token_program_key, // Metaplex program ID
      tokenProgram: associated_token_program_key,
      systemProgram: anchor.web3.SystemProgram.programId,
    };

    console.log("Capsule PDA:", capsulePda.toBase58());
    console.log("Mint account:", mint.publicKey.toBase58());
    console.log("Associated token account:", tokenAccount.publicKey.toBase58());
    console.log("Metadata PDA:", metadata.toBase58());
    console.log("Master PDA:", master.toBase58());
    await program.methods
      .createCapsule(releaseDate, cid)
      .accounts(accounts)
      .signers([mint])
      .rpc();

    // Fetch the capsule and assert it was created
    const capsuleAccount = await program.account.capsule.fetch(capsulePda);
    assert.equal(capsuleAccount.ipfsCid, cid);
    assert.equal(
      capsuleAccount.releasedDate.toNumber(),
      releaseDate.toNumber()
    );
  });
});
