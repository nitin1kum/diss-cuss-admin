"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Ban, UserCheck, User } from "lucide-react";
import { useFetcher } from "@/hooks/useFetcher";
import { UserProfile } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Users() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounce, setDebounce] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasReached, setHasReached] = useState(false);
  const [role, setRole] = useState<"USER" | "ADMIN" | "TEST">("USER");
  const timer = useRef<any>(null);

  const fetchUsers = async (nextPage = 1, reset = false) => {
    try {
      if (nextPage === 1) setLoading(true);
      else setLoadingMore(true);
      const data = await useFetcher(
        `/users/list?q=${debounce}&role=${role}&page=${nextPage}&limit=20`
      );

      const {
        users: currentUsers,
        total_pages,
        page: currentPage,
      } = data as {
        users: UserProfile[];
        total: number;
        total_pages: number;
        limit: number;
        page: number;
      };
      setHasReached(currentPage >= total_pages);
      setPage(currentPage);
      setUsers(reset ? currentUsers : [...users, ...currentUsers]);
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setPage(1);
      setHasReached(false);
      setDebounce(searchTerm.trim());
    }, 500);
  }, [searchTerm]);

  // re-fetch on debounce change
  useEffect(() => {
    fetchUsers(1, true);
  }, [debounce, role]);

  // initial fetch
  useEffect(() => {
    fetchUsers(1, true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ALLOWED":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "BANNED":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-300";
    }
  };

  const getRoleColor = (userRole: string) => {
    switch (userRole) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "USER":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "TEST":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Users</h1>
          <Button>Add User</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage all users on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex my-5 gap-2">
              <Button
                onClick={() => {
                  setRole("USER");
                }}
                className={`${
                  role === "USER" && "bg-gray-400 hover:bg-gray-400"
                } hover:bg-gray-300`}
                variant={"secondary"}
              >
                User
              </Button>
              <Button
                onClick={() => {
                  setRole("ADMIN");
                }}
                className={`${
                  role === "ADMIN" && "bg-gray-400 hover:bg-gray-400"
                } hover:bg-gray-300`}
                variant={"secondary"}
              >
                Admin
              </Button>
              <Button
                onClick={() => {
                  setRole("TEST");
                }}
                className={`${
                  role === "TEST" && "bg-gray-400 hover:bg-gray-400"
                } hover:bg-gray-300`}
                variant={"secondary"}
              >
                Test
              </Button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 bg-gray-200 rounded-lg"
                      ></div>
                    ))}
                  </div>
                </div>
              ) : users.length === 0 ? (
                <p className="text-sm text-gray-500">No users found.</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={user.image || user.profileImage} alt="user image" />
                        <AvatarFallback>
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{user.username}</h3>
                          <Badge className={getRoleColor(role)}>{role}</Badge>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined: {user.createdAt.split("T")[0]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/users/${user.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      {user.status === "ALLOWED" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Ban
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Unban
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
              {!hasReached && users.length > 0 && (
                <div className="flex justify-center">
                  <Button
                    disabled={loadingMore}
                    className="mx-auto"
                    variant={"secondary"}
                    onClick={() => {
                      fetchUsers(page + 1);
                    }}
                  >
                    {loadingMore ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
