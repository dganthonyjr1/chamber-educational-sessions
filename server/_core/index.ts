import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // REST API endpoints for ChatGPT Custom GPT integration
  app.get("/api/gpt/chambers", async (req, res) => {
    try {
      const { city, state, latitude, longitude } = req.query;
      const orgDb = await import("../db-organizations");
      const chambers = await orgDb.getAllOrganizations();

      // If coordinates provided, find closest Chamber
      if (latitude && longitude) {
        const { findClosestChamber } = await import("../geolocation");
        const closestChamber = findClosestChamber(
          parseFloat(latitude as string),
          parseFloat(longitude as string),
          chambers
        );
        return res.json({
          success: true,
          chamber: closestChamber,
          searchMethod: "coordinates",
        });
      }

      // If city/state provided, find matching Chamber
      if (city && state) {
        const matchingChamber = chambers.find(
          (c) =>
            c.city?.toLowerCase() === (city as string).toLowerCase() &&
            c.state?.toLowerCase() === (state as string).toLowerCase()
        );

        if (matchingChamber) {
          return res.json({
            success: true,
            chamber: { ...matchingChamber, distance: 0 },
            searchMethod: "city_state",
          });
        }

        return res.json({
          success: false,
          message: `No Chamber found for ${city}, ${state}. Here are nearby options:`,
          suggestions: chambers.slice(0, 5),
          searchMethod: "city_state",
        });
      }

      // If no input provided, return all Chambers
      return res.json({
        success: true,
        chambers: chambers.map((c) => ({
          id: c.id,
          name: c.name,
          city: c.city,
          state: c.state,
          website: c.website,
          signupUrl: c.signupUrl,
          description: c.description,
          socialMedia: {
            linkedin: c.linkedinUrl,
            facebook: c.facebookUrl,
            twitter: c.twitterUrl,
            instagram: c.instagramUrl,
            tiktok: c.tiktokUrl,
          },
        })),
        searchMethod: "all",
      });
    } catch (error) {
      console.error("[GPT API Error]", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
