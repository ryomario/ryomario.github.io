export async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
  try {
    // Fetch the image from the URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    const blob = await response.blob();
    
    // Create a File object from the blob
    return new File([blob], filename, { type: mimeType || blob.type });
  } catch (error) {
    console.error('Error converting URL to File:', error);
    throw error;
  }
}