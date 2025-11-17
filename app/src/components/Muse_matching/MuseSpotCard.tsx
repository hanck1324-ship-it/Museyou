import { Card, CardContent, CardFooter, CardHeader } from "../ui/layout/card";
import { Badge } from "../ui/data-display/badge";
import { Button } from "../ui/buttons/button";
import { MapPin, Heart, Star, Clock, Users, Calendar, Cloud } from "lucide-react";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";

export interface CoupleSpot {
  id: string;
  title: string;
  category: string;
  location: string;
  district: string;
  atmosphere: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  priceRange: string;
  tags: string[];
  coupleDiscount?: string;
  // Enhanced fields for detailed recommendations
  recommendedDate?: string;
  weather?: {
    condition: string; // e.g., "맑음", "흐림", "비"
    temperature: string; // e.g., "18°C"
    icon: string; // weather icon
  };
  performanceAvailable?: boolean;
  performanceInfo?: string;
  nearbyAttractions?: string[];
  specialFeatures?: string[];
  // Location data for map integration
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  nearbyRestaurants?: {
    name: string;
    category: string;
    distance: string;
    rating: number;
  }[];
}

interface CoupleSpotCardProps {
  spot: CoupleSpot;
  onViewDetails: (spot: CoupleSpot) => void;
}

export function CoupleSpotCard({ spot, onViewDetails }: CoupleSpotCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm bg-white/90 border-2 border-purple-200 hover:border-purple-300 relative animate-pulse-glow">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-purple-500/5 to-pink-400/5 pointer-events-none" />
      
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <ImageWithFallback
          src={spot.image}
          alt={spot.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-2">
          <Badge className="bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-400 text-white border-0 text-xs sm:text-sm shadow-lg backdrop-blur-sm animate-float">
            <Users className="size-3 mr-1" />
            <span className="hidden sm:inline">문화공구</span>
            <span className="sm:hidden">문화공구</span>
          </Badge>
        </div>
        {spot.coupleDiscount && (
          <Badge className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 text-xs sm:text-sm shadow-lg backdrop-blur-sm">
            {spot.coupleDiscount}
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6 relative">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base sm:text-lg group-hover:text-purple-600 transition-colors">{spot.title}</h3>
          <div className="flex items-center gap-1 shrink-0 bg-pink-50 px-2 py-1 rounded-full">
            <Heart className="size-3 sm:size-4 fill-pink-400 text-pink-400 animate-pulse" />
            <span className="text-xs sm:text-sm">{spot.rating}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{spot.atmosphere}</p>
      </CardHeader>

      <CardContent className="space-y-1.5 sm:space-y-2 pb-2 sm:pb-3 p-3 sm:p-6 pt-0 relative">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
          {spot.description}
        </p>
        
        {/* Date and Weather Info */}
        {spot.recommendedDate && (
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/20 dark:to-pink-950/20 p-2.5 rounded-lg space-y-1 border border-purple-100 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs">
              <Calendar className="size-3 text-purple-600 shrink-0" />
              <span className="truncate">{spot.recommendedDate}</span>
            </div>
            {spot.weather && (
              <div className="flex items-center gap-1.5 text-xs">
                <Cloud className="size-3 text-purple-600 shrink-0" />
                <span className="truncate">{spot.weather.icon} {spot.weather.condition}, {spot.weather.temperature}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
          <MapPin className="size-3 sm:size-4 shrink-0 text-purple-500" />
          <span className="truncate">{spot.location}</span>
        </div>
        
        <div className="flex items-center justify-between pt-1">
          <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">{spot.category}</Badge>
          <span className="text-xs sm:text-sm text-muted-foreground">{spot.priceRange}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {spot.tags.slice(0, 3).map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-0">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-6 pt-0 relative">
        <Button 
          className="w-full bg-gradient-to-r from-emerald-500 via-purple-500 to-pink-400 hover:from-emerald-600 hover:via-purple-600 hover:to-pink-500 text-xs sm:text-sm h-8 sm:h-10 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden" 
          onClick={() => onViewDetails(spot)}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Heart className="size-3 sm:size-4 mr-2 relative z-10" />
          <span className="relative z-10">자세히 보기</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
