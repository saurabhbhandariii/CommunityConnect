import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertItemSchema, type Item } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, Package, Camera, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type ItemFormData = z.infer<typeof insertItemSchema>;

export default function ItemShare() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  
  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: ItemFormData) => {
      const response = await apiRequest("POST", "/api/items", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({ title: "Success", description: "Item shared successfully!" });
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to share item", variant: "destructive" });
    },
  });

  const requestItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const response = await apiRequest("PATCH", `/api/items/${itemId}/request`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({ title: "Success", description: "Item requested successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to request item", variant: "destructive" });
    },
  });

  const form = useForm<ItemFormData>({
    resolver: zodResolver(insertItemSchema),
    defaultValues: {
      name: "",
      category: "",
      condition: "",
      description: "",
      imageUrl: "",
    },
  });

  const onSubmit = (data: ItemFormData) => {
    createItemMutation.mutate(data);
  };

  const categories = ["All Categories", "Furniture", "Electronics", "Books", "Sports", "Clothing", "Other"];
  const conditions = ["Like New", "Good", "Fair", "Needs Repair"];

  const filteredItems = selectedCategory === "All Categories" 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Like New": return "bg-trust-green text-white";
      case "Good": return "bg-yellow-500 text-white";
      case "Fair": return "bg-orange-500 text-white";
      case "Needs Repair": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Furniture": return "bg-blue-100 text-blue-800";
      case "Electronics": return "bg-red-100 text-red-800";
      case "Books": return "bg-purple-100 text-purple-800";
      case "Sports": return "bg-green-100 text-green-800";
      case "Clothing": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    return `${diffInDays} days ago`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Post New Item */}
      <div className="lg:w-1/3">
        <Card className="sticky top-24">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <PlusCircle className="text-trust-green mr-2" />
              Share an Item
            </h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Study table, bicycle, etc." {...field} />
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
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.slice(1).map((category) => (
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
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {conditions.map((condition) => (
                            <SelectItem key={condition} value={condition}>
                              {condition}
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
                          rows={3} 
                          placeholder="Describe the item and why you're sharing it..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-trust-green hover:bg-green-700"
                  disabled={createItemMutation.isPending}
                >
                  {createItemMutation.isPending ? "Sharing..." : "Share Item"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Available Items */}
      <div className="lg:w-2/3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Available Items</h2>
          <div className="flex space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items available</h3>
              <p className="text-gray-500">
                {selectedCategory === "All Categories" 
                  ? "Be the first to share an item with your fellow students!"
                  : `No items found in ${selectedCategory} category.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-48 object-cover"
                  />
                )}
                {!item.imageUrl && (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                      <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getConditionColor(item.condition)}`}>
                      {item.condition}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={item.sharerImage || ""} alt={item.sharerName} />
                      <AvatarFallback>{item.sharerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.sharerName}</p>
                      <p className="text-xs text-neutral-medium">Posted {getTimeAgo(item.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      className="flex-1 bg-trust-green hover:bg-green-700"
                      onClick={() => requestItemMutation.mutate(item.id)}
                      disabled={!item.available || requestItemMutation.isPending}
                    >
                      {!item.available ? "No Longer Available" : "Request Item"}
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
