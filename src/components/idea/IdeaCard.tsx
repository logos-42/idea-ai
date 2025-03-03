
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface IdeaCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  aiExpanded: boolean;
  date: string;
}

export function IdeaCard({ id, title, excerpt, category, aiExpanded, date }: IdeaCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2 text-xs">
            {category}
          </Badge>
          {aiExpanded && (
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
              AI Enhanced
            </Badge>
          )}
        </div>
        <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 text-xs text-muted-foreground border-t">
        <span>{date}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-auto hover:bg-transparent hover:text-primary"
          asChild
        >
          <Link to={`/idea/${id}`}>
            <span className="mr-1">View</span>
            <MessageSquare className="h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
