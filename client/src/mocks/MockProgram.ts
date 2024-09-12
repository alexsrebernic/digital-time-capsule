export class MockProgram {
    async createCapsule(releaseDate: number, ipfsHash: string) {
      console.log(`Mock createCapsule called with releaseDate: ${releaseDate}, ipfsHash: ${ipfsHash}`);
      return { transactionSignature: 'mock_signature' };
    }
  }