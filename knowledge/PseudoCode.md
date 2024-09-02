function create_capsule(creator: PublicKey, open_date: UnixTimestamp, is_public: bool):
       // Verify the creator has signed the transaction
       verify_signer(creator)
       
       // Generate a PDA for the new capsule
       capsule_address = generate_capsule_pda(creator, current_timestamp())
       
       // Create the capsule account
       create_account(capsule_address)
       
       // Initialize capsule data
       capsule_data = {
           creator: creator,
           creation_date: current_timestamp(),
           open_date: open_date,
           is_public: is_public,
           content_count: 0,
           is_opened: false
       }
       
       // Store capsule data in the account
       store_data(capsule_address, capsule_data)
       
       // Mint an NFT representing the capsule
       nft_address = mint_capsule_nft(creator, capsule_address)
       
       // Link the NFT to the capsule data
       update_capsule_data(capsule_address, nft: nft_address)
       
       // Return the capsule address and NFT address
       return (capsule_address, nft_address)