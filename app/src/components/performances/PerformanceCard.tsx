import { Card, CardContent, CardFooter, CardHeader } from "../ui/layout/card";
import { Badge } from "../ui/data-display/badge";
import { Button } from "../ui/buttons/button";
import { MapPin, Calendar, Star, Clock, Heart } from "lucide-react";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";

export interface Performance {
  id: string;
  title: string;
  category: string;
  venue: string;
  district: string;
  date: string;
  time: string;
  price: string;
  image: string;
  rating: number;
  reviewCount: number;
  description: string;
  organizer: string;
}

interface PerformanceCardProps {
  performance: Performance;
  onViewDetails: (performance: Performance) => void;
  onDateProposal?: (performance: Performance) => void;
}

export function PerformanceCard({ performance, onViewDetails, onDateProposal }: PerformanceCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm bg-white/90 border-2 hover:border-emerald-200">
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <ImageWithFallback
          src={performance.image}
          alt={performance.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge className="absolute top-2 sm:top-3 right-2 sm:right-3 text-xs sm:text-sm bg-white/95 backdrop-blur-sm text-black hover:bg-white shadow-lg border-0">
          {performance.category}
        </Badge>
      </div>
      
      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base sm:text-lg group-hover:text-emerald-600 transition-colors">{performance.title}</h3>
          <div className="flex items-center gap-1 shrink-0 bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="size-3 sm:size-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs sm:text-sm">{performance.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-1.5 sm:space-y-2 pb-2 sm:pb-3 p-3 sm:p-6 pt-0">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
          <MapPin className="size-3 sm:size-4 shrink-0 text-emerald-500" />
          <span className="truncate">{performance.venue}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Calendar className="size-3 sm:size-4 shrink-0 text-emerald-500" />
          <span className="truncate">{performance.date}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Clock className="size-3 sm:size-4 shrink-0 text-emerald-500" />
          <span className="truncate">{performance.time}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700">{performance.district}</Badge>
          <span className="text-xs sm:text-sm">{performance.price}</span>
        </div>
      </CardContent>

      <CardFooter className="gap-2 p-3 sm:p-6 pt-0">
        <Button 
          className="flex-1 text-xs sm:text-sm h-8 sm:h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all" 
          onClick={() => onViewDetails(performance)}
        >
          상세정보
        </Button>
        {onDateProposal && (
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 size-8 sm:size-10 hover:border-pink-400 transition-all"
            onClick={() => onDateProposal(performance)}
          >
            <Heart className="size-3 sm:size-4 text-pink-500 hover:fill-pink-500 transition-all" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}