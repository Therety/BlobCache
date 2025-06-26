import { put } from '@vercel/blob';

function generateFilename(sku: string): string {
    const safeSku = sku.replace(/\s+/g, '-');
    return `${safeSku}.png`;  // Add file extension to the filename
}

export async function uploadImageToBlob(imageBuffer: Buffer, sku: string): Promise<string> {
    try {
        // Generate a consistent filename based on SKU
        const filename = generateFilename(sku);
        const imageUrl = `https://url.public.blob.vercel-storage.com/${filename}?timestamp=${Date.now()}`; // Vercel blob url

        // Check if the image already exists by fetching it with a cache-busting query parameter
        const response = await fetch(imageUrl, {
            cache: "no-store"
        });
        if (response.ok) {
            return imageUrl.replace(/\?timestamp=\d+$/, '');  // Return existing URL without the timestamp if found
        }

        // Upload the image buffer to Vercel Blob storage with no random suffix
        const blobResult = await put(filename, imageBuffer, {
            access: 'public',        // Make sure the blob is publicly accessible
            addRandomSuffix: false,  // Disable random suffix for predictable URLs
        });

        // Return the predictable URL without the cache-busting parameter
        return blobResult.url;
    } catch (error) {
        console.error(`Failed to upload image to Vercel Blob: ${error}`);
        throw error;
    }
}

export async function downloadAndUploadImageToBlob(imageUrl: string | undefined, sku: string): Promise<string | null> {
    try {
        if (!imageUrl) {
            return ''; // Image that will be displayed in case there is no image
        }

        // Fetch the image from the external source
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image from ${imageUrl}`);
        }

        // Convert the response to a Buffer
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload the image buffer to Vercel Blob storage
        return await uploadImageToBlob(buffer, sku);  // The filename will be generated inside this function
    } catch (error) {
        console.error(`Error in downloading or uploading image for SKU: ${sku}`, error);
        throw error;
    }
}