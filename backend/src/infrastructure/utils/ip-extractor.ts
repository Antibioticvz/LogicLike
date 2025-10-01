import type { FastifyRequest } from "fastify"
import { isIP } from "net"

/**
 * Extract real IP address from request
 * Handles X-Forwarded-For header for reverse proxy support
 *
 * Используем встроенную Node.js функцию isIP() для проверки формата
 * Поддерживаем как IPv4 так и IPv6
 */
export function extractIpAddress(request: FastifyRequest): string {
  // Проверить заголовок X-Forwarded-For (устанавливается обратными прокси, такими как Nginx)
  const forwardedFor = request.headers["x-forwarded-for"]

  if (forwardedFor) {
    // X-Forwarded-For может содержать несколько IP: "client, proxy1, proxy2"
    // Нам нужен первый (оригинальный IP клиента)
    const ips =
      typeof forwardedFor === "string"
        ? forwardedFor.split(",").map(ip => ip.trim())
        : forwardedFor

    const clientIp = Array.isArray(ips) ? ips[0] : ips

    // Валидация первого IP из списка
    if (clientIp && isIP(clientIp) !== 0) {
      return clientIp
    }
  }

  // Откат к IP прямого соединения
  const ip = request.ip || "127.0.0.1"

  // Финальная проверка IP на валидность
  // isIP возвращает: 0 (невалидный), 4 (IPv4), 6 (IPv6)
  if (isIP(ip) === 0) {
    throw new Error(
      `Invalid IP address detected. Received: ${ip}. This should not happen with Fastify.`
    )
  }

  return ip
}
