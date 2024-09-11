use anchor_lang::prelude::*;
use anchor_spl::{token::{TokenAccount, Mint, Token}, associated_token::AssociatedToken};
use mpl_token_metadata::instructions::{CreateMasterEditionV3CpiBuilder,CreateMetadataAccountV3CpiBuilder};
use mpl_token_metadata::types::{Creator, DataV2, };
use mpl_token_metadata::accounts::{Metadata, MasterEdition};

declare_id!("DWScEV42ig3zGpZUhVXtuV2BzwQ4oxnFeXiBdZB6uDaZ");

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
        cid: String)-> Result<()> {
            msg!("create capsule");

        let capsule: &mut Account<Capsule> = &mut ctx.accounts.capsule;
        let capsule_machine: &mut Account<CapsuleMachine> = &mut ctx.accounts.capsule_machine;

        capsule.creator = ctx.accounts.user.key();
        capsule.released_date = release_date;
        capsule.ipfs_cid = cid;
        capsule.id = capsule_machine.count;
        
        capsule_machine.count += 1;
        Ok(())
    }
}

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
        space=98
    )]
    pub capsule: Account<'info, Capsule>,
    #[account(mut)]
    pub capsule_machine: Account<'info, CapsuleMachine>,
    #[account(mut)]
    pub user: Signer<'info>,
    
    // Programs
    pub system_program: Program<'info, System>,
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