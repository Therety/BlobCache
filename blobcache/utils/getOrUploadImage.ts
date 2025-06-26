import { get, set } from '../lib/redis';
import { downloadAndUploadImageToBlob } from '../lib/blob';

export async function getOrUploadImage(imageUrl: string, sku: string): Promise<string> {
    const redisKey = `blob:${sku}`;

    const cachedUrl = await get(redisKey);
    if (cachedUrl) {
        return cachedUrl;
    }

    const uploadedUrl = await downloadAndUploadImageToBlob(imageUrl, sku);
    if (uploadedUrl) {
        await set(redisKey, uploadedUrl);
    }

    return uploadedUrl;
}
