"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, FileText, MessageSquare, TrendingUp } from "lucide-react";
import { useFetcher } from "@/hooks/useFetcher";
import { DashboardData } from "@/types/types";

// Mock data - in real app, this would come from your API
const mockData = {
  stats: {
    totalUsers: 1250,
    totalBlogs: 89,
    totalThreads: 456,
    activeUsers: 324,
  },
  recentUsers: [
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      username: "jane_smith",
      email: "jane@example.com",
      joinDate: "2024-01-14",
    },
    {
      id: 3,
      username: "movie_lover",
      email: "lover@example.com",
      joinDate: "2024-01-13",
    },
    {
      id: 4,
      username: "critic_pro",
      email: "critic@example.com",
      joinDate: "2024-01-12",
    },
    {
      id: 5,
      username: "cinema_fan",
      email: "fan@example.com",
      joinDate: "2024-01-11",
    },
  ],
  recentBlogs: [
    {
      id: 1,
      title: "Top 10 Movies of 2024",
      author: "John Doe",
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "The Art of Film Noir",
      author: "Jane Smith",
      date: "2024-01-14",
    },
    {
      id: 3,
      title: "Marvel vs DC: The Ultimate Showdown",
      author: "Movie Lover",
      date: "2024-01-13",
    },
    {
      id: 4,
      title: "Independent Cinema Rising",
      author: "Critic Pro",
      date: "2024-01-12",
    },
    {
      id: 5,
      title: "Horror Movies That Changed Cinema",
      author: "Cinema Fan",
      date: "2024-01-11",
    },
  ],
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);
      const data = await useFetcher("/dashboard/data");
      setData(data as DashboardData);
    } catch (error) {
      console.log("Error fetching data - ", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.users.count.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +{data.users.last7Days} from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.blogs.count}</div>
              <p className="text-xs text-muted-foreground">
                +{data.blogs.last7Days} from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Threads
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.threads.count}</div>
              <p className="text-xs text-muted-foreground">
                +{data.threads.last7Days} from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Discussions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.discussions.count}</div>
              <p className="text-xs text-muted-foreground">
                +{data.discussions.last7Days} from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>
                Latest 5 users who joined the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.lastFive.users.map((user) => (
                  <a target="_blank" href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/profile/${user.id}`} key={user.id} className="p-3 flex flex-col justify-between bg-gray-50 rounded-lg">
                    <p className="font-medium">{user.username}</p>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="text-sm text-gray-500">
                        {user.createdAt.split("T")[0]}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Blogs</CardTitle>
              <CardDescription>Latest 5 blog posts published</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.lastFive.blogs.map((blog) => (
                  <a target="_blank" href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/blogs/blog/${blog.slug}`} key={blog.id} className="p-3 flex flex-col bg-gray-50 rounded-lg">
                    <p className="font-medium">{blog.title}</p>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">
                        by {blog.author.username}
                      </p>
                      <div className="text-sm text-gray-500">
                        {blog.createdAt.split("T")[0]}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
