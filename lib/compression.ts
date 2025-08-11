// Compression utility for resume data using Brotli
// This helps reduce storage usage in Supabase

export async function compressData(data: any): Promise<string> {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data)
    
    // Use TextEncoder to convert to Uint8Array
    const encoder = new TextEncoder()
    const uint8Array = encoder.encode(jsonString)
    
    // Compress using best available stream (prefer br, then gzip)
    const { format, compressed } = await compressWithBestAvailable(uint8Array)
    
    // Convert to base64 for storage
    const base64 = btoa(String.fromCharCode(...compressed))
    
    // Verify compression is actually smaller
    if (base64.length >= jsonString.length) {
      console.warn('Compression did not reduce size, using original data')
      return jsonString
    }
    
    // Prefix with format so we can decompress safely later
    return `${format}:${base64}`
  } catch (error) {
    console.error('Compression failed:', error)
    // Fallback to original JSON string
    return JSON.stringify(data)
  }
}

export async function decompressData(compressedData: string): Promise<any> {
  try {
    // Check if data is compressed (base64) or plain JSON
    if (compressedData.startsWith('{') || compressedData.startsWith('[')) {
      // Plain JSON, return as is
      return JSON.parse(compressedData)
    }
    // Handle new prefixed format "br:" or "gz:"
    let format: 'br' | 'gzip' | null = null
    let payload = compressedData
    if (compressedData.startsWith('br:')) {
      format = 'br'
      payload = compressedData.slice(3)
    } else if (compressedData.startsWith('gz:')) {
      format = 'gzip'
      payload = compressedData.slice(3)
    }

    // Decode base64
    const binaryString = atob(payload)
    const uint8Array = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i)
    }
    
    // Decompress based on format, or try br then gzip for legacy data
    let decompressed: Uint8Array
    if (format === 'br') {
      decompressed = await decompressBrotli(uint8Array)
    } else if (format === 'gzip') {
      decompressed = await decompressGzip(uint8Array)
    } else {
      try {
        decompressed = await decompressBrotli(uint8Array)
      } catch {
        decompressed = await decompressGzip(uint8Array)
      }
    }
    
    // Convert back to string and parse
    const decoder = new TextDecoder()
    const jsonString = decoder.decode(decompressed)
    
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Decompression failed:', error)
    // Try to parse as plain JSON as fallback
    try {
      return JSON.parse(compressedData)
    } catch {
      throw new Error('Failed to decompress data')
    }
  }
}

// Select best available compression ('br' preferred, then 'gzip'); return format and data
async function compressWithBestAvailable(data: Uint8Array): Promise<{ format: 'br' | 'gz'; compressed: Uint8Array }> {
  // Try Brotli
  try {
    const compressed = await compressWithFormat(data, 'br')
    return { format: 'br', compressed }
  } catch {}
  // Try gzip
  try {
    const compressed = await compressWithFormat(data, 'gzip')
    return { format: 'gz', compressed }
  } catch {}
  // Fallback: no compression
  throw new Error('No supported CompressionStream format (br/gzip)')
}

async function compressWithFormat(data: Uint8Array, format: 'br' | 'gzip'): Promise<Uint8Array> {
  if (!('CompressionStream' in globalThis)) throw new Error('CompressionStream not available')
  let stream: any
  try {
    stream = new (CompressionStream as any)(format)
  } catch (e) {
    throw new Error(`Unsupported compression format: ${format}`)
  }
  const writer = stream.writable.getWriter()
  const reader = stream.readable.getReader()
  writer.write(data)
  writer.close()
  const chunks: Uint8Array[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }
  return result
}

// Brotli decompression using Web API (if available) or fallback
async function decompressBrotli(data: Uint8Array): Promise<Uint8Array> {
  if ('DecompressionStream' in globalThis) {
    // Use native DecompressionStream if available
    const stream = new DecompressionStream('br')
    const writer = stream.writable.getWriter()
    const reader = stream.readable.getReader()
    
    writer.write(data)
    writer.close()
    
    const chunks: Uint8Array[] = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }
    
    // Combine chunks
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }
    
    return result
  } else {
    // Fallback: return original data if Brotli is not available
    console.warn('Brotli decompression not available, using original data')
    return data
  }
} 

async function decompressGzip(data: Uint8Array): Promise<Uint8Array> {
  if ('DecompressionStream' in globalThis) {
    let stream: any
    try {
      stream = new (DecompressionStream as any)('gzip')
    } catch (e) {
      throw new Error('Gzip decompression not available')
    }
    const writer = stream.writable.getWriter()
    const reader = stream.readable.getReader()
    writer.write(data)
    writer.close()
    const chunks: Uint8Array[] = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
    }
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }
    return result
  }
  throw new Error('DecompressionStream not available')
}