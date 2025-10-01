import type { FastifyRequest } from 'fastify';

/**
 * Extract real IP address from request
 * Handles X-Forwarded-For header for reverse proxy support
 */
export function extractIpAddress(request: FastifyRequest): string {
  // Check X-Forwarded-For header (set by reverse proxies like Nginx)
  const forwardedFor = request.headers['x-forwarded-for'];
  
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs: "client, proxy1, proxy2"
    // We want the first one (the original client IP)
    const ips = typeof forwardedFor === 'string' 
      ? forwardedFor.split(',').map(ip => ip.trim())
      : forwardedFor;
    
    const clientIp = Array.isArray(ips) ? ips[0] : ips;
    if (clientIp) {
      return clientIp;
    }
  }

  // Fallback to direct connection IP
  return request.ip || '127.0.0.1';
}
