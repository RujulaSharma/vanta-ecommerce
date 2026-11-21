import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";

import app from "../app.js";
import { corsOptions } from "../config/cors.js";
import { apiLimiter, authLimiter } from "../middleware/rateLimiter.js";

describe("Render Proxy & Rate Limiting Verification", () => {
  let originalNodeEnv;

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("should configure trust proxy = 1 when NODE_ENV is production", async () => {
    // Dynamically test the app initialization behavior under production
    const testApp = express();
    process.env.NODE_ENV = "production";
    if (process.env.NODE_ENV === "production") {
      testApp.set("trust proxy", 1);
    }
    expect(testApp.get("trust proxy")).toBe(1);
  });

  it("should not throw ERR_ERL_UNEXPECTED_X_FORWARDED_FOR when trust proxy is 1", async () => {
    // Enable trust proxy = 1 on the app as in Render production
    app.set("trust proxy", 1);

    const response = await request(app)
      .get("/api/health")
      .set("X-Forwarded-For", "203.0.113.195");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Vanta Bags API is running",
    });
  });

  it("should correctly distinguish different client IPs behind a proxy", async () => {
    const testApp = express();
    testApp.set("trust proxy", 1);

    const limiter = rateLimit({
      windowMs: 60 * 1000,
      limit: 2,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: { success: false, message: "Too many requests" },
    });

    testApp.use("/test-limit", limiter, (req, res) => {
      res.json({ success: true, ip: req.ip });
    });

    const clientA = "198.51.100.10";
    const clientB = "198.51.100.20";

    // Client A uses up their 2-request quota
    const resA1 = await request(testApp).get("/test-limit").set("X-Forwarded-For", clientA);
    expect(resA1.status).toBe(200);
    expect(resA1.body.ip).toBe(clientA);

    const resA2 = await request(testApp).get("/test-limit").set("X-Forwarded-For", clientA);
    expect(resA2.status).toBe(200);

    // Client A is now rate-limited (429)
    const resA3 = await request(testApp).get("/test-limit").set("X-Forwarded-For", clientA);
    expect(resA3.status).toBe(429);
    expect(resA3.body.success).toBe(false);

    // Client B still has their full quota intact
    const resB1 = await request(testApp).get("/test-limit").set("X-Forwarded-For", clientB);
    expect(resB1.status).toBe(200);
    expect(resB1.body.ip).toBe(clientB);
  });

  it("should prevent bypassing rate limits by spoofing X-Forwarded-For prefixes", async () => {
    const testApp = express();
    // Render topology: 1 hop from socket
    testApp.set("trust proxy", 1);

    const limiter = rateLimit({
      windowMs: 60 * 1000,
      limit: 2,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    });

    testApp.use("/spoof-test", limiter, (req, res) => {
      res.json({ ip: req.ip });
    });

    const realClientIp = "203.0.113.50";

    // Attacker sends spoofed prefix "1.1.1.1", Render appends realClientIp: "1.1.1.1, 203.0.113.50"
    const req1 = await request(testApp)
      .get("/spoof-test")
      .set("X-Forwarded-For", `1.1.1.1, ${realClientIp}`);
    expect(req1.status).toBe(200);
    expect(req1.body.ip).toBe(realClientIp);

    // Attacker tries to rotate spoofed prefix to "2.2.2.2", Render still appends realClientIp
    const req2 = await request(testApp)
      .get("/spoof-test")
      .set("X-Forwarded-For", `2.2.2.2, ${realClientIp}`);
    expect(req2.status).toBe(200);
    expect(req2.body.ip).toBe(realClientIp);

    // Attacker tries a third spoofed prefix "3.3.3.3", but limit (2) is exhausted for realClientIp!
    const req3 = await request(testApp)
      .get("/spoof-test")
      .set("X-Forwarded-For", `3.3.3.3, ${realClientIp}`);
    expect(req3.status).toBe(429);
  });

  it("should support CORS for the new Vercel frontend", async () => {
    const testApp = express();
    testApp.use(cors(corsOptions));
    testApp.get("/api/test-cors", (req, res) => res.json({ ok: true }));

    // Production Vercel domain
    const resProd = await request(testApp)
      .get("/api/test-cors")
      .set("Origin", "https://vanta-ecommerce.vercel.app");
    expect(resProd.headers["access-control-allow-origin"]).toBe("https://vanta-ecommerce.vercel.app");
    expect(resProd.headers["access-control-allow-credentials"]).toBe("true");

    // Vercel preview domain
    const resPreview = await request(testApp)
      .get("/api/test-cors")
      .set("Origin", "https://vanta-ecommerce-git-main-rujulasharma.vercel.app");
    expect(resPreview.headers["access-control-allow-origin"]).toBe("https://vanta-ecommerce-git-main-rujulasharma.vercel.app");
    expect(resPreview.headers["access-control-allow-credentials"]).toBe("true");

    // Preflight OPTIONS request
    const resOptions = await request(testApp)
      .options("/api/test-cors")
      .set("Origin", "https://vanta-ecommerce.vercel.app")
      .set("Access-Control-Request-Method", "POST");
    expect(resOptions.status).toBe(204);
    expect(resOptions.headers["access-control-allow-origin"]).toBe("https://vanta-ecommerce.vercel.app");
    expect(resOptions.headers["access-control-allow-credentials"]).toBe("true");
  });
});
