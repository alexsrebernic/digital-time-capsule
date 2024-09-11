import { NextResponse } from 'next/server';
import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export async function POST
(
  request: Request,
) {
  if (request.method !== 'POST') {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }

  try {
    const { title, description, openingDate, files } = await request.json();

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

    return NextResponse.json({ ipfsHash: finalResult.IpfsHash });
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    return NextResponse.json({ message: 'Error uploading to IPFS' }, { status: 500 });
  }
}