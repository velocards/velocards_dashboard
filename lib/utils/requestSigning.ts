import crypto from 'crypto';

/**
 * Generate request signature for sensitive operations
 * Backend requires signed requests for card freeze/unfreeze/delete and crypto withdrawals
 */
export function generateRequestSignature(
  method: string,
  url: string,
  body: any,
  secretKey: string
): {
  signature: string;
  timestamp: number;
  nonce: string;
} {
  const timestamp = Math.floor(Date.now() / 1000);
  const nonce = crypto.randomBytes(16).toString('hex');
  
  // Create payload to sign
  const payload = JSON.stringify({
    method: method.toUpperCase(),
    url,
    body: body || {},
    timestamp,
    nonce
  });
  
  // Generate HMAC signature
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('hex');
  
  return {
    signature,
    timestamp,
    nonce
  };
}

/**
 * Add request signing headers to config
 */
export function addRequestSigningHeaders(
  config: any,
  secretKey?: string
): any {
  // Skip if no secret key available
  if (!secretKey) {
    // No secret key available for request signing
    return config;
  }
  
  const { signature, timestamp, nonce } = generateRequestSignature(
    config.method || 'GET',
    config.url || '',
    config.data,
    secretKey
  );
  
  return {
    ...config,
    headers: {
      ...config.headers,
      'X-Signature': signature,
      'X-Timestamp': timestamp.toString(),
      'X-Nonce': nonce
    }
  };
}