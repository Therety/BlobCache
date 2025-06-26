## BlobCache

Vercel-based caching of blob images (e.g., sneakers) for quick access.  
This small project shows how to easily connect **Vercel Blob Storage** with **Vercel Redis (KV)** for predictable and cached image delivery.

Perfect for:
- Developers trying this setup for the first time
- People like me who forget stuff and need to read their code again later 😄

---

## What It Does

1. Takes an image URL and a sneaker SKU
2. Checks Redis (KV) for a cached blob URL
3. If not found:
   - Downloads the image
   - Uploads it to Vercel Blob with a predictable filename (no random suffix)
   - Stores the public blob URL in Redis
4. Returns the final public image URL
