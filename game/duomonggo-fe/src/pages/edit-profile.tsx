import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu, Save, Upload } from "lucide-react";
import SidebarUser from "../components/sidebar-user";
import SidebarAdmin from "../components/sidebar-admin";
import Logo from "../assets/Logo.svg";
import { toast } from "../components/ui/use-toast";
import { Toaster } from "../components/ui/toaster";
import "../App.css";

export default function EditProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<any>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedUsername = localStorage.getItem("username");
    const storedRole = localStorage.getItem("role");

    if (!storedUserId || !storedUsername) {
      navigate("/login");
      return;
    }

    setUserId(storedUserId);
    setUsername(storedUsername);
    setRole(storedRole);

    fetchUserData(storedUserId);
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8091/accounts/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.payload) {
        setCurrentUserData(data.payload);
        setUsername(data.payload.username);
        setEmail(data.payload.email);
        if (data.payload.imageUrl) {
          setPreviewImage(data.payload.imageUrl);
        }
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load user profile data",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (password && password.length < 8) {
      toast({
        variant: "destructive",
        title: "Invalid password",
        description: "Password must be at least 8 characters long",
      });
      return false;
    }

    if (password && password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!userId) return;

    setIsLoading(true);

    try {
      const formData = new FormData();

      if (username !== currentUserData.username) {
        formData.append("username", username);
      }

      if (email !== currentUserData.email) {
        formData.append("email", email);
      }

      if (password) {
        formData.append("password", password);
      }

      if (profileImage) {
        formData.append("image", profileImage);
      }

      if (formData.entries().next().done) {
        toast({
          title: "No changes detected",
          description: "No profile information was updated",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8091/accounts/${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        if (username !== currentUserData.username) {
          localStorage.setItem("username", username);
        }

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });

        fetchUserData(userId);
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setPassword("");
      setConfirmPassword("");
    }
  };

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
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
                  Edit Profile
                </CardTitle>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col items-center space-y-4 mb-6">
                    <Avatar className="w-32 h-32">
                      {previewImage ? (
                        <AvatarImage src={previewImage} alt="Profile preview" />
                      ) : (
                        <AvatarFallback>
                          {username ? username.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div className="flex items-center">
                      <Label
                        htmlFor="image-upload"
                        className="cursor-pointer flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                      >
                        <Upload className="h-4 w-4" />
                        Upload new image
                      </Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Username"
                      value={username}
                      className="mt-2"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      className="mt-2"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      New Password (leave blank to keep current)
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="New Password"
                      value={password}
                      className="mt-2"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      className="mt-2"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={!password}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loader"></span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
