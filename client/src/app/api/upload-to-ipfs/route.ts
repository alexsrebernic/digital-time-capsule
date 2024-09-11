import type { NextApiRequest, NextApiResponse } from 'next'
import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { title, description, openingDate, files } = req.body;

    // Create a JSON metadata file
    const metadata = JSON.stringify({
      name: title,
      description,
      openingDate,
    });

    // Upload metadata to IPFS
    const metadataResult = await pinata.pinJSONToIPFS(JSON.parse(metadata));

    // For simplicity, we're not handling file uploads here.
    // In a real application, you'd need to handle file uploads separately.

    // Create a final metadata object
    const finalMetadata = {
      ...JSON.parse(metadata),
      metadataHash: metadataResult.IpfsHash,
      files: files.map((file: string) => ({ name: file })), // Just storing file names for now
    };

    // Upload final metadata to IPFS
    const finalResult = await pinata.pinJSONToIPFS(finalMetadata);

    res.status(200).json({ ipfsHash: finalResult.IpfsHash });
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    res.status(500).json({ message: 'Error uploading to IPFS' });
  }
}