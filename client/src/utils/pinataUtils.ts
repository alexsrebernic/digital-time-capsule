import axios from "axios";
import { CapsuleData } from "@/models/CapsuleData";

export async function uploadToPinata(data: CapsuleData): Promise<string> {
  try {
    const response = await axios.post('/api/upload-to-ipfs', {
      title: data.title,
      description: data.description,
      openingDate: data.openingDate,
      files: data.files.map(file => file.name), // Sending only file names for now
    });

    return response.data.ipfsHash;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw error;
  }
}