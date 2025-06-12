import fourOfour from "../assets/404.png";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <img src={fourOfour} alt="404 Not Found" className="w-full md:w-96 lg:w-196 h-auto mb-6" draggable="false"/>
      <h1 className="text-3xl font-bold mb-2 text-center">Page Not Found</h1>
      <p className="text-muted-foreground mb-6 text-center">
        Oops! The page you're looking for doesn't seem to exist.
      </p>
      <Button onClick={() => navigate("/")} className="px-6 bg-purple-600 hover:bg-purple-700 text-white">
        Go Back Home
      </Button>
    </div>
  );
}
