import { PublicKey, Keypair } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

// Function to initialize the capsule machine
export const initializeCapsuleMachine = async (program: anchor.Program, provider: anchor.Provider) => {
  const capsuleMachine = Keypair.generate();

  try {
    const tx = await program.methods
      .initializeCapsuleMachine()
      .accounts({
        capsuleMachine: capsuleMachine.publicKey,
        user: provider.publicKey!,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([capsuleMachine])
      .rpc();

    console.log("Capsule machine initialized. Transaction signature:", tx);
    return capsuleMachine.publicKey;
  } catch (error) {
    console.error("Error initializing capsule machine:", error);
    throw error;
  }
};

// Function to create a capsule
export const createCapsule = async (
  program: anchor.Program,
  provider: anchor.Provider,
  capsuleMachinePublicKey: PublicKey,
  ipfsHash: string,
  releaseDate: number
) => {
  try {
    const capsuleMachineAccount = await program.account.capsuleMachine.fetch(capsuleMachinePublicKey);
    const [capsulePda, ] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(capsuleMachineAccount.count.toString()),
        capsuleMachinePublicKey.toBuffer(),
      ],
      program.programId
    );

    const mint = Keypair.generate();
    const metadata = await getMetadataPda(mint.publicKey);
    const masterEdition = await getMasterEditionPda(mint.publicKey);

    const tx = await program.methods
      .createCapsule(new anchor.BN(releaseDate), ipfsHash)
      .accounts({
        capsule: capsulePda,
        user: provider.publicKey,
        capsuleMachine: capsuleMachinePublicKey,
        mint: mint.publicKey,
        metadata,
        masterEdition,
        tokenAccount: await getAssociatedTokenAddress(mint.publicKey, provider.publicKey),
        tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mint])
      .rpc();

    console.log("Capsule created. Transaction signature:", tx);
    return capsulePda;
  } catch (error) {
    console.error("Error creating capsule:", error);
    throw error;
  }
};

// Helper function to get Metadata PDA
const getMetadataPda = async (mint: PublicKey) => {
  const [metadataPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
      mint.toBuffer(),
    ],
    new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
  );
  return metadataPda;
};

// Helper function to get Master Edition PDA
const getMasterEditionPda = async (mint: PublicKey) => {
  const [masterEditionPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
  );
  return masterEditionPda;
};

// Helper function to get Associated Token Address
const getAssociatedTokenAddress = async (mint: PublicKey, owner: PublicKey) => {
  const [associatedTokenAddress] = PublicKey.findProgramAddressSync(
    [
      owner.toBuffer(),
      anchor.utils.token.TOKEN_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")
  );
  return associatedTokenAddress;
};