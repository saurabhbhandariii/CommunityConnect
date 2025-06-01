import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRideSchema, type Ride } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Filter, ArrowUpDown, Star, Shield, Calendar, Users, Car, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type RideFormData = z.infer<typeof insertRideSchema>;

export default function RideShare() {
  const { toast } = useToast();
  
  const { data: rides = [], isLoading } = useQuery<Ride[]>({
    queryKey: ["/api/rides"],
  });

  const createRideMutation = useMutation({
    mutationFn: async (data: RideFormData) => {
      const response = await apiRequest("POST", "/api/rides", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      toast({ title: "Success", description: "Ride created successfully!" });
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create ride", variant: "destructive" });
    },
  });

  const requestRideMutation = useMutation({
    mutationFn: async (rideId: number) => {
      const response = await apiRequest("PATCH", `/api/rides/${rideId}/request`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      toast({ title: "Success", description: "Ride requested successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to request ride", variant: "destructive" });
    },
  });

  const form = useForm<RideFormData>({
    resolver: zodResolver(insertRideSchema),
    defaultValues: {
      fromLocation: "",
      toLocation: "",
      date: "",
      time: "",
      totalSeats: 1,
      costPerPerson: 50,
      vehicleInfo: "",
    },
  });

  const onSubmit = (data: RideFormData) => {
    createRideMutation.mutate(data);
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours), parseInt(minutes));
      return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return "Tomorrow";
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Create New Ride */}
      <div className="lg:w-1/3">
        <Card className="sticky top-24">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <PlusCircle className="text-uni-blue mr-2" />
              Create Ride
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fromLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <Input placeholder="Pickup location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="toLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <Input placeholder="Destination" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalSeats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seats</FormLabel>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select seats" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="7">7</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="costPerPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost per person</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="₹50" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="vehicleInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle</FormLabel>
                      <FormControl>
                        <Input placeholder="Honda City, Maruti Swift, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-uni-blue hover:bg-blue-700"
                  disabled={createRideMutation.isPending}
                >
                  {createRideMutation.isPending ? "Creating..." : "Create Ride"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Available Rides */}
      <div className="lg:w-2/3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Available Rides</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : rides.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rides available</h3>
              <p className="text-gray-500">Be the first to create a ride and help your fellow students!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <Card key={ride.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={ride.driverImage || ""} alt={ride.driverName} />
                        <AvatarFallback>{ride.driverName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{ride.driverName}</h3>
                        <div className="flex items-center space-x-2 text-sm text-neutral-medium">
                          <span className="flex items-center">
                            <Star className="w-3 h-3 text-energy-orange mr-1" />
                            {ride.driverRating}
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Shield className="w-3 h-3 text-trust-green mr-1" />
                            Verified Student
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-uni-blue">₹{ride.costPerPerson}</p>
                      <p className="text-sm text-neutral-medium">per person</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-trust-green rounded-full"></div>
                      <span className="text-gray-900 font-medium">{ride.fromLocation}</span>
                    </div>
                    <div className="ml-6 border-l-2 border-dashed border-gray-300 h-4"></div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-gray-900 font-medium">{ride.toLocation}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm text-neutral-medium mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(ride.date)}, {formatTime(ride.time)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{ride.availableSeats} seats left</span>
                    </div>
                    <div className="flex items-center">
                      <Car className="w-4 h-4 mr-2" />
                      <span>{ride.vehicleInfo}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      className="flex-1 bg-uni-blue hover:bg-blue-700"
                      onClick={() => requestRideMutation.mutate(ride.id)}
                      disabled={ride.availableSeats === 0 || requestRideMutation.isPending}
                    >
                      {ride.availableSeats === 0 ? "No Seats Available" : "Request Ride"}
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
