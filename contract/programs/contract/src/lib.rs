use anchor_lang::prelude::*;
//use mpl_token_metadata::state::Metadata;

declare_id!("DWScEV42ig3zGpZUhVXtuV2BzwQ4oxnFeXiBdZB6uDaZ");

#[program]
pub mod contract {
    use super::*;
    //use chrono::*;

    pub fn initialize_capsule_machine(ctx: Context<InitializeMachine>, _nft_ :Pubkey) -> Result<()> {
        let capsule_machine: &mut Account<CapsuleMachine> = &mut ctx.accounts.capsule_machine;
        capsule_machine.count = 0; 
        Ok(())
    }

    pub fn create_capsule(ctx: Context<CreateCapsule>, release_date: i64, cid: String) -> Result<()> {
        let capsule: &mut Account<Capsule> = &mut ctx.accounts.capsule;
        let capsule_machine: &mut Account<CapsuleMachine> = &mut ctx.accounts.capsule_machine;

        capsule.submitter = ctx.accounts.user.key();
        capsule.released_date = release_date;
        capsule.ipfs_cid = cid;
        capsule.id = capsule_machine.count;
        
        capsule_machine.count += 1;
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
        Ok(())
    }

    //instructions
}

//------------Helper fn----------------
/* 
pub fn is_token_owner(token_account: &AccountInfo, owner: &Pubkey) -> Result<bool, ProgramError> {
    // Implementation to check if the given owner owns the token
}
 
pub fn verify_nft_ownership(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let time_capsule_account = next_account_info(account_info_iter)?;
    let nft_token_account = next_account_info(account_info_iter)?;
    let nft_mint = next_account_info(account_info_iter)?;
    let metadata_account = next_account_info(account_info_iter)?;
    let owner = next_account_info(account_info_iter)?;

    // Verify NFT ownership
    if !is_token_owner(nft_token_account, owner.key)? {
        return Err(ProgramError::InvalidAccountData.into());
    }

    // Verify NFT metadata
    let metadata = Metadata::from_account_info(metadata_account)?;
    if metadata.mint != *nft_mint.key {
        return Err(ProgramError::InvalidAccountData.into());
    }

    Ok(())
}
*/
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
    pub user: Signer<'info>,
    #[account(mut)]
    pub capsule_machine: Account<'info, CapsuleMachine>,
    pub system_program: Program<'info, System>
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
    pub submitter: Pubkey,
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