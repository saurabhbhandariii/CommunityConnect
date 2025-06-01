import { users, rides, items, helpRequests, type User, type InsertUser, type Ride, type InsertRide, type Item, type InsertItem, type HelpRequest, type InsertHelpRequest } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Ride methods
  getRides(): Promise<Ride[]>;
  getRide(id: number): Promise<Ride | undefined>;
  createRide(ride: InsertRide, userId: number): Promise<Ride>;
  updateRideSeats(id: number, availableSeats: number): Promise<Ride | undefined>;
  
  // Item methods
  getItems(): Promise<Item[]>;
  getItem(id: number): Promise<Item | undefined>;
  createItem(item: InsertItem, userId: number): Promise<Item>;
  updateItemAvailability(id: number, available: boolean): Promise<Item | undefined>;
  
  // Help request methods
  getHelpRequests(): Promise<HelpRequest[]>;
  getHelpRequest(id: number): Promise<HelpRequest | undefined>;
  createHelpRequest(request: InsertHelpRequest, userId: number): Promise<HelpRequest>;
  updateHelpersCount(id: number, count: number): Promise<HelpRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private rides: Map<number, Ride>;
  private items: Map<number, Item>;
  private helpRequests: Map<number, HelpRequest>;
  private currentUserId: number;
  private currentRideId: number;
  private currentItemId: number;
  private currentHelpRequestId: number;

  constructor() {
    this.users = new Map();
    this.rides = new Map();
    this.items = new Map();
    this.helpRequests = new Map();
    this.currentUserId = 1;
    this.currentRideId = 1;
    this.currentItemId = 1;
    this.currentHelpRequestId = 1;

    // Create a default user
    this.createUser({
      username: "saurabh.bhandari",
      password: "password123",
      fullName: "Saurabh Bhandari",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getRides(): Promise<Ride[]> {
    return Array.from(this.rides.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getRide(id: number): Promise<Ride | undefined> {
    return this.rides.get(id);
  }

  async createRide(insertRide: InsertRide, userId: number): Promise<Ride> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const id = this.currentRideId++;
    const ride: Ride = {
      ...insertRide,
      id,
      driverId: userId,
      driverName: user.fullName,
      driverImage: user.profileImage || "",
      driverRating: "4.8",
      availableSeats: insertRide.totalSeats,
      createdAt: new Date().toISOString(),
    };
    this.rides.set(id, ride);
    return ride;
  }

  async updateRideSeats(id: number, availableSeats: number): Promise<Ride | undefined> {
    const ride = this.rides.get(id);
    if (!ride) return undefined;
    
    const updatedRide = { ...ride, availableSeats };
    this.rides.set(id, updatedRide);
    return updatedRide;
  }

  async getItems(): Promise<Item[]> {
    return Array.from(this.items.values())
      .filter(item => item.available)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getItem(id: number): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async createItem(insertItem: InsertItem, userId: number): Promise<Item> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const id = this.currentItemId++;
    const item: Item = {
      ...insertItem,
      id,
      sharerId: userId,
      sharerName: user.fullName,
      sharerImage: user.profileImage || "",
      available: true,
      createdAt: new Date().toISOString(),
    };
    this.items.set(id, item);
    return item;
  }

  async updateItemAvailability(id: number, available: boolean): Promise<Item | undefined> {
    const item = this.items.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, available };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async getHelpRequests(): Promise<HelpRequest[]> {
    return Array.from(this.helpRequests.values())
      .filter(request => !request.resolved)
      .sort((a, b) => {
        // Sort by urgency first, then by date
        const urgencyOrder = { "Very Urgent": 0, "Urgent": 1, "Soon": 2, "Not urgent": 3 };
        const aUrgency = urgencyOrder[a.urgency as keyof typeof urgencyOrder] || 4;
        const bUrgency = urgencyOrder[b.urgency as keyof typeof urgencyOrder] || 4;
        
        if (aUrgency !== bUrgency) return aUrgency - bUrgency;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async getHelpRequest(id: number): Promise<HelpRequest | undefined> {
    return this.helpRequests.get(id);
  }

  async createHelpRequest(insertRequest: InsertHelpRequest, userId: number): Promise<HelpRequest> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const id = this.currentHelpRequestId++;
    const request: HelpRequest = {
      ...insertRequest,
      id,
      requesterId: userId,
      requesterName: user.fullName,
      requesterImage: user.profileImage || "",
      helpersCount: 0,
      resolved: false,
      createdAt: new Date().toISOString(),
    };
    this.helpRequests.set(id, request);
    return request;
  }

  async updateHelpersCount(id: number, count: number): Promise<HelpRequest | undefined> {
    const request = this.helpRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, helpersCount: count };
    this.helpRequests.set(id, updatedRequest);
    return updatedRequest;
  }
}

export const storage = new MemStorage();
