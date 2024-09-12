import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contract } from "../models/contract";

const PROGRAM_ID = new PublicKey("DWScEV42ig3zGpZUhVXtuV2BzwQ4oxnFeXiBdZB6uDaZ");

// Function to initialize the capsule machine
export const initializeCapsuleMachine = async (program: Program<Contract>, provider: anchor.AnchorProvider) => {
  const capsuleMachine = Keypair.generate();

  try {
    const init_accounts = {
      capsuleMachine: capsuleMachine.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    };
    const tx = await program.methods
      .initializeCapsuleMachine()
      .accounts(init_accounts)
      .signers([capsuleMachine])
      .rpc();

    await provider.connection.confirmTransaction(tx, 'confirmed');

    console.log("Capsule machine initialized. Transaction signature:", tx);
    return capsuleMachine.publicKey;
  } catch (error) {
    console.error("Error initializing capsule machine:", error);
    throw error;
  }
};

// Function to create a capsule
export const createCapsule = async (
  program: Program<Contract>,
  provider: anchor.AnchorProvider,
  capsuleMachinePublicKey: PublicKey,
  ipfsHash: string,
  releaseDate: number
) => {
  try {
    const capsuleMachineAccount = await program.account.capsuleMachine.fetch(
      capsuleMachinePublicKey
    );

    const [capsulePda] = PublicKey.findProgramAddressSync(
      [
        new anchor.BN(capsuleMachineAccount.count).toArrayLike(Buffer, "be", 8),
        capsuleMachinePublicKey.toBuffer(),
      ],
      PROGRAM_ID
    );

    const mint = Keypair.generate();
    const metadata = await getMetadataPda(mint.publicKey);
    const masterEdition = await getMasterEditionPda(mint.publicKey);

    const accounts = {
      capsule: capsulePda,
      user: provider.wallet.publicKey,
      capsuleMachine: capsuleMachinePublicKey,
      mint: mint.publicKey,
      metadata,
      masterEdition,
      tokenAccount: await getAssociatedTokenAddress(mint.publicKey, provider.wallet.publicKey),
      tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
      systemProgram: SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    };

    const tx = await program.methods
      .createCapsule(new anchor.BN(releaseDate), ipfsHash)
      .accounts(accounts)
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
const getMetadataPda = async (mint: PublicKey): Promise<PublicKey> => {
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
const getMasterEditionPda = async (mint: PublicKey): Promise<PublicKey> => {
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
const getAssociatedTokenAddress = async (mint: PublicKey, owner: PublicKey): Promise<PublicKey> => {
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

export { PROGRAM_ID };