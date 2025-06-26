const BASE_URL = process.env.KV_REST_API_URL;
const TOKEN = process.env.KV_REST_API_TOKEN;

async function fetchWithRetry(url: string, options: RequestInit = {}, retries: number = 3): Promise<Response> {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Fetch failed');
        return response;
    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying... Attempts remaining: ${retries}`);
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
}

export async function get(key: string): Promise<string | null> {
    const url = `${BASE_URL}/get/${key}`;
    const options: RequestInit = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
        },
    };

    const response = await fetchWithRetry(url, options);
    const data = await response.json();
    return data.result;
}

export async function set(key: string, value: any): Promise<void> {
    const response = await fetch(`${BASE_URL}/set/${key}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
    });

    if (!response.ok) {
        throw new Error(`Failed to set key in Redis: ${response.statusText}`);
    }
}
