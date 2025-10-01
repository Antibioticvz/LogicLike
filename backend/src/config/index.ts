import dotenv from "dotenv"

dotenv.config()

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  host: process.env.HOST || "0.0.0.0",

  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  database: {
    url: process.env.DATABASE_URL || "",
  },

  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    timeWindow: process.env.RATE_LIMIT_WINDOW || "1 minute",
  },

  voting: {
    maxVotesPerIp: parseInt(process.env.MAX_VOTES_PER_IP || "10", 10),
  },
}

export default config
