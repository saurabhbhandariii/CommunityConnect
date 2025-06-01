import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRideSchema, insertItemSchema, insertHelpRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Rides endpoints
  app.get("/api/rides", async (req, res) => {
    try {
      const rides = await storage.getRides();
      res.json(rides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rides" });
    }
  });

  app.post("/api/rides", async (req, res) => {
    try {
      const rideData = insertRideSchema.parse(req.body);
      // For demo purposes, using user ID 1 as the current user
      const ride = await storage.createRide(rideData, 1);
      res.status(201).json(ride);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid ride data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create ride" });
      }
    }
  });

  app.patch("/api/rides/:id/request", async (req, res) => {
    try {
      const rideId = parseInt(req.params.id);
      const ride = await storage.getRide(rideId);
      
      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }

      if (ride.availableSeats <= 0) {
        return res.status(400).json({ message: "No seats available" });
      }

      const updatedRide = await storage.updateRideSeats(rideId, ride.availableSeats - 1);
      res.json(updatedRide);
    } catch (error) {
      res.status(500).json({ message: "Failed to request ride" });
    }
  });

  // Items endpoints
  app.get("/api/items", async (req, res) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const itemData = insertItemSchema.parse(req.body);
      // For demo purposes, using user ID 1 as the current user
      const item = await storage.createItem(itemData, 1);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid item data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create item" });
      }
    }
  });

  app.patch("/api/items/:id/request", async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const item = await storage.getItem(itemId);
      
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      if (!item.available) {
        return res.status(400).json({ message: "Item is no longer available" });
      }

      const updatedItem = await storage.updateItemAvailability(itemId, false);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to request item" });
    }
  });

  // Help requests endpoints
  app.get("/api/help-requests", async (req, res) => {
    try {
      const helpRequests = await storage.getHelpRequests();
      res.json(helpRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch help requests" });
    }
  });

  app.post("/api/help-requests", async (req, res) => {
    try {
      const requestData = insertHelpRequestSchema.parse(req.body);
      // For demo purposes, using user ID 1 as the current user
      const helpRequest = await storage.createHelpRequest(requestData, 1);
      res.status(201).json(helpRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid help request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create help request" });
      }
    }
  });

  app.patch("/api/help-requests/:id/offer-help", async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const helpRequest = await storage.getHelpRequest(requestId);
      
      if (!helpRequest) {
        return res.status(404).json({ message: "Help request not found" });
      }

      const updatedRequest = await storage.updateHelpersCount(requestId, helpRequest.helpersCount + 1);
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to offer help" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
