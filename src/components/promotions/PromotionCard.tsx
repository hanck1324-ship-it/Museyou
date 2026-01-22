import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "../common/figma/ImageWithFallback";

export interface Promotion {
  id: string;
  title: string;
  district: string;
  category: string;
  date: string;
  image: string;
  description: string;
  organizer: string;
  link?: string;
}

interface PromotionCardProps {
  promotion: Promotion;
}

export function PromotionCard({ promotion }: PromotionCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-2 border-purple-200 dark:border-purple-800 hover:border-indigo-300 dark:hover:border-indigo-700">
      <div className="relative h-36 sm:h-40 overflow-hidden">
        <ImageWithFallback
          src={promotion.image}
          alt={promotion.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 shadow-lg backdrop-blur-sm text-xs sm:text-sm">
          {promotion.district}
        </Badge>
      </div>
      
      <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-base sm:text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors dark:text-gray-100">{promotion.title}</h3>
          <Badge variant="outline" className="shrink-0 text-xs border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
            {promotion.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6 pt-0">
        <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 line-clamp-2">
          {promotion.description}
        </p>
        
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200 transition-colors">
          <MapPin className="size-3 sm:size-4 shrink-0 text-purple-500 dark:text-purple-400" />
          <span className="truncate">{promotion.organizer}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-gray-200 transition-colors">
          <Calendar className="size-3 sm:size-4 shrink-0 text-purple-500 dark:text-purple-400" />
          <span className="truncate">{promotion.date}</span>
        </div>

        {promotion.link && (
          <Button 
            variant="outline" 
            className="w-full text-xs sm:text-sm h-8 sm:h-10 border-2 border-purple-200 dark:border-purple-800 hover:bg-gradient-to-r hover:from-purple-50 dark:hover:from-purple-900/30 hover:to-indigo-50 dark:hover:to-indigo-900/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all group-button dark:text-gray-200" 
            asChild
          >
            <a href={promotion.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              자세히 보기
              <ExternalLink className="size-3 sm:size-4 ml-2" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
