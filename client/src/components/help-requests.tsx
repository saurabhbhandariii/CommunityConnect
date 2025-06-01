import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertHelpRequestSchema, type HelpRequest } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { HandHeart, MapPin, Clock, Shield, Users, MessageCircle, Navigation } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type HelpRequestFormData = z.infer<typeof insertHelpRequestSchema>;

export default function HelpRequests() {
  const { toast } = useToast();
  
  const { data: helpRequests = [], isLoading } = useQuery<HelpRequest[]>({
    queryKey: ["/api/help-requests"],
  });

  const createHelpRequestMutation = useMutation({
    mutationFn: async (data: HelpRequestFormData) => {
      const response = await apiRequest("POST", "/api/help-requests", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/help-requests"] });
      toast({ title: "Success", description: "Help request created successfully!" });
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create help request", variant: "destructive" });
    },
  });

  const offerHelpMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await apiRequest("PATCH", `/api/help-requests/${requestId}/offer-help`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/help-requests"] });
      toast({ title: "Success", description: "Help offered successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to offer help", variant: "destructive" });
    },
  });

  const form = useForm<HelpRequestFormData>({
    resolver: zodResolver(insertHelpRequestSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
      location: "",
      urgency: "",
    },
  });

  const onSubmit = (data: HelpRequestFormData) => {
    createHelpRequestMutation.mutate(data);
  };

  const categories = ["Emergency", "Transportation", "Academic", "Technical", "Local Info", "Other"];
  const urgencyLevels = [
    "Very Urgent (within 1 hour)",
    "Urgent (today)",
    "Soon (this week)",
    "Not urgent"
  ];

  const getUrgencyColor = (urgency: string) => {
    if (urgency.includes("Very Urgent")) return "bg-red-100 text-red-800";
    if (urgency.includes("Urgent")) return "bg-orange-100 text-orange-800";
    if (urgency.includes("Soon")) return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Emergency": return "bg-red-100 text-red-800";
      case "Transportation": return "bg-yellow-100 text-yellow-800";
      case "Academic": return "bg-purple-100 text-purple-800";
      case "Technical": return "bg-blue-100 text-blue-800";
      case "Local Info": return "bg-gray-100 text-gray-800";
      default: return "bg-green-100 text-green-800";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Request Help */}
      <div className="lg:w-1/3">
        <Card className="sticky top-24">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <HandHeart className="text-energy-orange mr-2" />
              Ask for Help
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of help needed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Help Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Where do you need help?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {urgencyLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={4} 
                          placeholder="Describe what help you need..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-energy-orange hover:bg-yellow-600"
                  disabled={createHelpRequestMutation.isPending}
                >
                  {createHelpRequestMutation.isPending ? "Requesting..." : "Request Help"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Help Requests */}
      <div className="lg:w-2/3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Help Requests</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              Near Me
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              Urgent
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : helpRequests.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <HandHeart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No help requests</h3>
              <p className="text-gray-500">All current help requests have been resolved. Check back later!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {helpRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={request.requesterImage || ""} alt={request.requesterName} />
                        <AvatarFallback>{request.requesterName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.requesterName}</h3>
                        <div className="flex items-center space-x-2 text-sm text-neutral-medium">
                          <span className="flex items-center">
                            <Shield className="w-3 h-3 text-trust-green mr-1" />
                            Verified Student
                          </span>
                          <span>•</span>
                          <span>{getTimeAgo(request.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency.split(' ')[0]} {request.urgency.split(' ')[1]}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(request.category)}`}>
                        {request.category}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-lg font-medium text-gray-900 mb-2">{request.title}</h4>
                  
                  <p className="text-gray-600 mb-4">{request.description}</p>

                  <div className="flex items-center space-x-4 text-sm text-neutral-medium mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{request.helpersCount} people helping</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      className="flex-1 bg-energy-orange hover:bg-yellow-600"
                      onClick={() => offerHelpMutation.mutate(request.id)}
                      disabled={offerHelpMutation.isPending}
                    >
                      Offer Help
                    </Button>
                    <Button variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline">
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
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
