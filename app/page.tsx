"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Cookies from "js-cookie";

interface User {
  email: string;
  name: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          Cookies.remove("token");
          router.push("/signin");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        Cookies.remove("token");
        router.push("/signin");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/signin");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to the application</CardTitle>
          <CardDescription>
            {user
              ? `Hello, ${user.name}! You are successfully logged in.`
              : "Welcome!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Your email: {user?.email}</p>
          <Button onClick={() => handleLogout()} className="w-full">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
