
import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-semibold text-sm">AI</span>
      </div>
      <span className="font-semibold text-lg tracking-tight">IdeasLab</span>
    </Link>
  );
}
