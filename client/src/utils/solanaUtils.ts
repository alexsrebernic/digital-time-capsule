import { PublicKey, Keypair, SystemProgram, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
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
    const tx = new Transaction();

    console.log(program,provider)
    const instruction = await program.methods
      .initializeCapsuleMachine()
      .accounts(init_accounts)
      .instruction();
    tx.add(instruction)
    tx.feePayer = provider.wallet.publicKey
    tx.recentBlockhash = (await provider.connection.getLatestBlockhash()).blockhash;
    tx.partialSign(capsuleMachine);

    await provider.wallet.signTransaction(tx)

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
    console.log(capsuleMachinePublicKey)
  
    const capsuleMachineAccount = await program.account.capsuleMachine.fetch(
      capsuleMachinePublicKey
    );

    const [capsulePda] = PublicKey.findProgramAddressSync(
      [
        new anchor.BN(capsuleMachineAccount.count).toArrayLike(Buffer, "be", 8),
        capsuleMachinePublicKey.toBuffer(),
      ],
      program.programId
    );
    const mint = Keypair.generate();
    const metadata = await getMetadataPda(mint.publicKey);
    const masterEdition = await getMasterEditionPda(mint.publicKey);
    const accounts = {
      capsuleMachine: capsuleMachinePublicKey,
      user: provider.wallet.publicKey,
      mint: mint.publicKey,
      // metadata,
      tokenAccount: await getAssociatedTokenAddress(mint.publicKey, provider.wallet.publicKey),
      // tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
      systemProgram: SystemProgram.programId,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      associatedTokenProgram: new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"),
    };
    const tx = new Transaction();

    const instruction = await program.methods
      .createCapsule(new anchor.BN(releaseDate), ipfsHash)
      .accounts(accounts)
      .instruction()

      tx.add(instruction)
      tx.recentBlockhash = (await provider.connection.getLatestBlockhash()).blockhash;
      tx.partialSign(mint);
  
      await provider.wallet.signTransaction(tx)
    console.log("Capsule created. Transaction signature:", tx);
    console.log("Capsule created. Transaction signature:", tx);
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