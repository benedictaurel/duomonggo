import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Award, Crown, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SidebarUser from "../components/sidebar-user";
import SidebarAdmin from "../components/sidebar-admin";
import Logo from "../assets/Logo.svg";

interface User {
  id: number;
  username: string;
  email: string;
  exp: number;
  role: string;
  imageUrl?: string;
}

const getPodiumIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Crown className="h-8 w-8 text-yellow-500" />;
    case 2:
      return <Medal className="h-7 w-7 text-gray-400" />;
    case 3:
      return <Award className="h-6 w-6 text-amber-600" />;
    default:
      return null;
  }
};

const getPodiumHeight = (position: number) => {
  switch (position) {
    case 1:
      return "h-32";
    case 2:
      return "h-24";
    case 3:
      return "h-20";
    default:
      return "h-16";
  }
};

export default function Component() {
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (!storedUsername) {
      navigate("/login");
      return;
    }

    setUsername(storedUsername);
    setRole(storedRole);
  }, [navigate]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8091/accounts");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.payload) {
          const usersOnly = data.payload.filter(
            (user: User) => user.role === "USER"
          );
          const sortedUsers = usersOnly.sort(
            (a: User, b: User) => b.exp - a.exp
          );

          const top10Users = sortedUsers.slice(0, 10);
          setLeaderboardData(top10Users);
        } else {
          throw new Error("Failed to fetch leaderboard data");
        }
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        setError("Failed to load leaderboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const topThree = leaderboardData.slice(0, 3);
  const remaining = leaderboardData.slice(3);

  if (loading) {
    return (
      <div className="sm:flex min-h-screen bg-gray-50">
        <div className="hidden sm:block w-64 bg-white shadow-lg">
          <div className="p-6">
            {role === "ADMIN" ? <SidebarAdmin /> : <SidebarUser />}
          </div>
        </div>

        <div className="flex-1">
          <div className="sm:hidden bg-white shadow-sm border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={Logo} alt="Duomonggo Logo" className="h-10 w-10" />
                <span className="text-xl font-semibold text-purple-600">
                  Duomonggo
                </span>
              </div>

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-64 p-0"
                  title="Navigation Menu"
                  description="Navigation options for Duomonggo application"
                >
                  <div className="p-6">
                    {role === "ADMIN" ? <SidebarAdmin /> : <SidebarUser />}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8 flex justify-center items-center">
              <p className="text-xl font-semibold text-gray-700">
                Loading leaderboard data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sm:flex min-h-screen bg-gray-50">
        <div className="hidden sm:block w-64 bg-white shadow-lg">
          <div className="p-6">
            {role === "ADMIN" ? <SidebarAdmin /> : <SidebarUser />}
          </div>
        </div>

        <div className="flex-1">
          <div className="sm:hidden bg-white shadow-sm border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={Logo} alt="Duomonggo Logo" className="h-10 w-10" />
                <span className="text-xl font-semibold text-purple-600">
                  Duomonggo
                </span>
              </div>

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-64 p-0"
                  title="Navigation Menu"
                  description="Navigation options for Duomonggo application"
                >
                  <div className="p-6">
                    {role === "ADMIN" ? <SidebarAdmin /> : <SidebarUser />}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8 flex justify-center items-center">
              <p className="text-xl font-semibold text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:flex min-h-screen bg-gray-50">
      <div className="hidden sm:block w-64 bg-white shadow-lg">
        <div className="p-6">
          {role === "ADMIN" ? <SidebarAdmin /> : <SidebarUser />}
        </div>
      </div>

      <div className="flex-1">
        <div className="sm:hidden bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="Duomonggo Logo" className="h-10 w-10" />
              <span className="text-xl font-semibold text-purple-600">
                Duomonggo
              </span>
            </div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 p-0"
                title="Navigation Menu"
                description="Navigation options for Duomonggo application"
              >
                <div className="p-6">
                  {role === "ADMIN" ? <SidebarAdmin /> : <SidebarUser />}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="h-8 w-8 text-purple-500" />
                <h1 className="text-4xl font-bold text-gray-900">
                  Leaderboard
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Top players by experience points
              </p>
            </div>

            {topThree.length > 0 && (
              <div className="mb-12">
                <div className="flex items-end justify-center gap-4 mb-8">
                  {topThree.length > 1 && (
                    <div className="flex flex-col items-center">
                      <div className="mb-4 text-center">
                        {" "}
                        <Avatar className="h-16 w-16 mx-auto mb-2 ring-4 ring-gray-300">
                          <AvatarImage
                            src={topThree[1]?.imageUrl}
                            alt={topThree[1]?.username}
                            draggable="false"
                          />
                          <AvatarFallback>
                            {topThree[1]?.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-gray-900">
                          {topThree[1]?.username}
                        </h3>
                        <p className="text-2xl font-bold text-gray-700">
                          {topThree[1]?.exp.toLocaleString()}
                        </p>
                      </div>
                      <Card
                        className={`w-32 ${getPodiumHeight(
                          2
                        )} bg-gradient-to-t from-gray-300 to-gray-200 border-gray-300`}
                      >
                        <CardContent className="flex items-center justify-center h-full p-0">
                          <div className="text-center">
                            {getPodiumIcon(2)}
                            <div className="text-3xl font-bold text-gray-700 mt-2">
                              2
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {topThree.length > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="mb-4 text-center">
                        {" "}
                        <Avatar className="h-20 w-20 mx-auto mb-2 ring-4 ring-yellow-400">
                          <AvatarImage
                            src={topThree[0]?.imageUrl}
                            alt={topThree[0]?.username}
                            draggable="false"
                          />
                          <AvatarFallback>
                            {topThree[0]?.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-gray-900">
                          {topThree[0]?.username}
                        </h3>
                        <p className="text-3xl font-bold text-yellow-600">
                          {topThree[0]?.exp.toLocaleString()}
                        </p>
                      </div>
                      <Card
                        className={`w-32 ${getPodiumHeight(
                          1
                        )} bg-gradient-to-t from-yellow-400 to-yellow-300 border-yellow-400`}
                      >
                        <CardContent className="flex items-center justify-center h-full p-0">
                          <div className="text-center">
                            {getPodiumIcon(1)}
                            <div className="text-4xl font-bold text-yellow-700 mt-2">
                              1
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {topThree.length > 2 && (
                    <div className="flex flex-col items-center">
                      <div className="mb-4 text-center">
                        {" "}
                        <Avatar className="h-14 w-14 mx-auto mb-2 ring-4 ring-amber-500">
                          <AvatarImage
                            src={topThree[2]?.imageUrl}
                            alt={topThree[2]?.username}
                            draggable="false"
                          />
                          <AvatarFallback>
                            {topThree[2]?.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-gray-900">
                          {topThree[2]?.username}
                        </h3>
                        <p className="text-xl font-bold text-amber-600">
                          {topThree[2]?.exp.toLocaleString()}
                        </p>
                      </div>
                      <Card
                        className={`w-32 ${getPodiumHeight(
                          3
                        )} bg-gradient-to-t from-amber-500 to-amber-400 border-amber-500`}
                      >
                        <CardContent className="flex items-center justify-center h-full p-0">
                          <div className="text-center">
                            {getPodiumIcon(3)}
                            <div className="text-2xl font-bold text-amber-700 mt-2">
                              3
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            )}

            {remaining.length > 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {remaining.map((player, index) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 text-center">
                            <span className="text-lg font-bold text-gray-600">
                              {index + 4}
                            </span>
                          </div>{" "}
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={player.imageUrl}
                              alt={player.username}
                              draggable="false"
                            />
                            <AvatarFallback>
                              {player.username
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {player.username}
                            </h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {player.exp.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">exp</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  No additional players to display.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
