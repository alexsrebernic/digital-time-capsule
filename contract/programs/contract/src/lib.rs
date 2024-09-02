use anchor_lang::prelude::*;

declare_id!("DWScEV42ig3zGpZUhVXtuV2BzwQ4oxnFeXiBdZB6uDaZ");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
