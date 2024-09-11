use anchor_lang::prelude::*;
use anchor_spl::{token::{TokenAccount, Mint, Token}, associated_token::AssociatedToken};
use mpl_token_metadata::instructions::{CreateMasterEditionV3CpiBuilder,CreateMetadataAccountV3CpiBuilder};
use mpl_token_metadata::types::{Creator, DataV2, };
use mpl_token_metadata::accounts::{Metadata, MasterEdition};

declare_id!("CUktgcSXVf9YHzHw9YrZ3gFDYeegaBrxFuCxEwdE6VAF");

#[program]
pub mod contract {

    use super::*;

    pub fn initialize_capsule_machine(ctx: Context<InitializeMachine>) -> Result<()> {
        let capsule_machine: &mut Account<CapsuleMachine> = &mut ctx.accounts.capsule_machine;
        capsule_machine.count = 0; 
        Ok(())
    }

    pub fn create_capsule(ctx: Context<CreateCapsule>,
        release_date: i64,
        cid: String) -> Result<()> {
        msg!("create capsule");
        let capsule: &mut Account<Capsule> = &mut ctx.accounts.capsule;
        let capsule_machine: &mut Account<CapsuleMachine> = &mut ctx.accounts.capsule_machine;

        capsule.creator = ctx.accounts.user.key();
        capsule.released_date = release_date;
        capsule.ipfs_cid = cid;
        capsule.id = capsule_machine.count;
        
        capsule_machine.count += 1;
        
        msg!("minting beggins");
        //NFT minting

        let (metadata_pda, metadata_bump) = Metadata::find_pda(&ctx.accounts.mint.key());
        let (master_edition_pda, metadata_bump) = MasterEdition::find_pda(&ctx.accounts.mint.key());

        let creators = vec![Creator {
            address: ctx.accounts.user.key(),
            verified: true,
            share: 100,
        }];

        let data = DataV2 {
            name: "Time Capsule NFT".to_string(),
            symbol: "TCNFT".to_string(),
            uri: "ipfs://your_ipfs_link_to_metadata".to_string(),
            seller_fee_basis_points: 500,
            creators: Some(creators),
            collection: None,
            uses: None,
        };

        let bump = ctx.bumps.capsule; // Get the bump seed
        let capsule_machine_key = capsule_machine.key();
        // Define the signer seeds for the capsule PDA
        let signer_seeds: &[&[u8]] = &[
            &capsule_machine.count.to_be_bytes(),   // Seed 1
            capsule_machine_key.as_ref(),         // Seed 2
            &[bump],                                // Bump seed
        ];
        
        msg!("metadata: {:?}", ctx.accounts.metadata);
        msg!("mint: {:?}", ctx.accounts.mint);
        msg!("metadata: {:?}", ctx.accounts.user);
        /* 
        CreateMetadataAccountV3CpiBuilder::new(&ctx.accounts.token_metadata_program)
        .metadata(&ctx.accounts.metadata) // Metadata PDA
        .mint(&ctx.accounts.mint.to_account_info()) // Mint o                                                                                                                                                                                                                                                                                                                         f the NFT
        .mint_authority(&ctx.accounts.user) // Mint authority (user creating the NFT)
        .payer(&ctx.accounts.user) // Payer of the transaction
        .update_authority(&ctx.accounts.user, true) // Update authority of the NFT
        .data(data)
        .is_mutable(false) // Whether the metadata is mutable
        .invoke()?;

        CreateMasterEditionV3CpiBuilder::new(&ctx.accounts.token_metadata_program)
        .edition(&ctx.accounts.master_edition) // Unallocated edition V2 account with address as pda of [‘metadata’, program id, mint, ‘edition’]
        .mint(&ctx.accounts.mint.to_account_info()) // Metadata mint
        .update_authority(&ctx.accounts.user) // Update authority
        .mint_authority(&ctx.accounts.user) // Mint authority on the metadata’s mint - THIS WILL TRANSFER AUTHORITY AWAY FROM THIS KEY
        .payer(&ctx.accounts.user) // Payer of the transaction
        .metadata(&ctx.accounts.metadata)
        .token_program(&ctx.accounts.token_program)
        .system_program(&ctx.accounts.system_program)
        //.rent() // rent (optional)
        //.max_supply(max_supply) // (optional)
        .add_remaining_account(&ctx.accounts.token_account.to_account_info(), true, false) //Add an additional account to the instruction.
        .invoke_signed(&[signer_seeds])?;*/

        Ok(())
    }

    pub fn retrieve_capsule(ctx: Context<RetrieveCapsule>)-> Result<()>{
        //It uses Solana's Clock sysvar to get the current blockchain time.
        //It compares the current time with the unlock time.
        let capsule: &Account<Capsule>= &ctx.accounts.capsule;

        let clock: Clock = Clock::get()?;
        let current_time: i64 = clock.unix_timestamp;

        require!(current_time >= capsule.released_date, ErrorCode::AccessDenied);
        
        // If verification passes, proceed with accessing the time capsule
        msg!("Time capsule unlocked!");
        //retrieve all possible info or ipfs
        Ok(())
    }

    //instructions
}

//------------Context------------------
#[derive(Accounts)]
pub struct InitializeMachine<'info> {             
    #[account(init, payer=user, space = 8 + 8)] //TODO: check allocation space
    pub capsule_machine: Account<'info, CapsuleMachine>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct CreateCapsule<'info> {             
    //seed schema     
    #[account(init, 
        seeds = [
            &capsule_machine.count.to_be_bytes(), 
            capsule_machine.key().as_ref()
        ], 
        //constraint = ,
        bump, 
        payer = user, 
        space=80
    )]
    pub capsule: Account<'info, Capsule>,
    #[account(mut)]
    pub capsule_machine: Account<'info, CapsuleMachine>,
    #[account(mut)]
    pub user: Signer<'info>,
    // NFT related accounts
    #[account(init, payer = user, mint::decimals = 0, mint::authority = user)]
    pub mint: Account<'info, Mint>,
    #[account(init, payer = user, associated_token::mint = mint, associated_token::authority = user)]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"metadata", token_metadata_program.key().as_ref(), mint.key().as_ref()], bump, seeds::program = token_metadata_program.key())]
    ///CHECK: This seems to be dangerous but idk
    pub metadata: AccountInfo<'info>,
    #[account(mut, seeds = [b"metadata", token_metadata_program.key().as_ref(), mint.key().as_ref(), b"edition"], bump,seeds::program = token_metadata_program.key())]
    ///CHECK: This too lol
    pub master_edition: AccountInfo<'info>,
    
    
    // Programs
    ///CHECK: Maybe changing account types?
    /// Two of the Anchor account types, AccountInfo and UncheckedAccount do not implement any checks on the account being passed.
    /// Anchor implements safety checks that encourage additional documentation describing why additional checks are not necesssary.
    pub token_metadata_program: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct RetrieveCapsule<'info> {
    //TODO: NFT access control, can it be put as a constrain or 
    //do we need to implement the logic in the fn?.
    #[account(mut)]
    pub capsule: Account<'info, Capsule>,
    pub user: Signer<'info>,
}

//------------Accounts------------------
#[account]
pub struct CapsuleMachine{
    pub count: u64,
}

#[account]
#[derive(Default)] //pda capsule 
pub struct Capsule{
    pub creator: Pubkey,
    pub id: u64,
    pub ipfs_cid: String,
    pub released_date: i64, //unix timestamp
    //pub encryption_key: String,
}

//------------Errors------------------
#[error_code]
pub enum ErrorCode {
    #[msg("Access denied. The opening date has not been reached.")]
    AccessDenied,
}