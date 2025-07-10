"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, Ban, UserCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { useFetcher } from "@/hooks/useFetcher";
import { Profile, UserProfile } from "@/types/types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { EditModal } from "./_components/EditModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UserDetail() {
  const params = useParams();
  const [user, setUser] = useState<Profile | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await useFetcher(`/users/profile/${params.id}`);
        console.log(data);
        setUser(data as Profile);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  async function imageUpload(file: File) {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload/image`, {
        method: "POST",
        body: formData,
      });
      if(!res.ok){
        console.log("Error uploading image")
        return null;
      }
      const image = res.json();
      return image;
    } catch (error: any) {
      console.error("Error while uploading image:", error);
      return null;
    }
  }

  const handleSaveProfile = async (data: {
    name: string;
    bio: string;
    profileImage: string;
    newImage?: File;
    private: boolean;
  }) => {
    if (!user) return;
    try {
      setUpdating(true);
      if (
        data.newImage ||
        data.name !== user.user_profile.username ||
        data.bio !== user.user_profile.bio ||
        data.private !== user.user_profile.private
      ) {
        let profileUrl = user.user_profile.profileImage;
        let publicId = "";
        if (data.newImage) {
          const image = await imageUpload(data.newImage);
          if (!image) {
            toast.info("Couldn't upload image.");
            return;
          }
          const { url, public_id } = image as {
            message: string;
            url: string;
            public_id: string;
          };
          profileUrl = url;
          publicId = public_id;
        }
        const newUser = await useFetcher(`/users/profile/edit`, {
          method: "POST",
          body: JSON.stringify({
            id: user.user_profile.id,
            username: data.name,
            bio: data.bio,
            image: profileUrl,
            publicId,
            private: data.private,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const {newUser : n} = newUser as {newUser : UserProfile}
        setShowModal(false);
        console.log(n,newUser)
        if(n){
          user.user_profile.username = n.username
          user.user_profile.bio = n.bio
          user.user_profile.image = n.image
          user.user_profile.private = n.private
        }
      }
    } catch (error) {
      console.log("Error editin profile - ", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ALLOWED":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "BANNED":
        return "bg-red-100 hover:bg-red-100 text-red-800";
      default:
        return "bg-gray-100 hover:bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 hover:bg-purple-100 text-purple-800";
      case "USER":
        return "bg-blue-100 hover:bg-blue-100 text-blue-800";
      case "TEST":
        return "bg-gray-100 hover:bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 hover:bg-gray-100 text-gray-800";
    }
  };

  if (loading || !user) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <EditModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        onSave={handleSaveProfile}
        loading={updating}
        initialData={{
          bio: user.user_profile.bio,
          name: user.user_profile.username,
          private: user.user_profile.private,
          profileImage: user.user_profile.profileImage,
        }}
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/users">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Users
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">User Details</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => setShowModal(true)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            {user.user_profile.status === "ALLOWED" ? (
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Ban className="h-4 w-4 mr-1" />
                Ban User
              </Button>
            ) : (
              <Button
                variant="outline"
                className="text-green-600 hover:text-green-700"
              >
                <UserCheck className="h-4 w-4 mr-1" />
                Unban User
              </Button>
            )}
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={
                      user.user_profile.image || user.user_profile.profileImage
                    }
                    alt="user image"
                  ></AvatarImage>
                  <AvatarFallback>
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {user.user_profile.username.charAt(0).toUpperCase()}
                    </div>
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-2xl">
                      {user.user_profile.username}
                    </CardTitle>
                    <Badge
                      className={getRoleColor(user.user_profile.role || "USER")}
                    >
                      {user.user_profile.role}
                    </Badge>
                    <Badge className={getStatusColor(user.user_profile.status)}>
                      {user.user_profile.status}
                    </Badge>
                  </div>
                  <CardDescription>{user.user_profile.email}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Join Date</p>
                <p className="text-lg font-semibold">
                  {user.user_profile.joinDate.split("T")[0]}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-lg font-semibold">
                  {user.user_profile.blogsCount}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">
                  Total Comments
                </p>
                <p className="text-lg font-semibold">
                  {user.user_profile.commentsCount}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-lg font-semibold">
                  {user.user_profile.likesCount}
                </p>
              </div>
            </div>

            <Tabs defaultValue="blogs" className="w-full">
              <TabsList>
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
                <TabsTrigger value="threads">Threads</TabsTrigger>
                <TabsTrigger value="likes">Likes</TabsTrigger>
              </TabsList>
              <TabsContent value="blogs" className="space-y-4">
                <div className="space-y-3">
                  {user.blogs.data.map((blog) => (
                    <div
                      key={blog.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{blog.title}</p>
                        <p className="text-sm text-gray-500">
                          {blog.createdAt.split("T")[0]}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={1 ? "default" : "secondary"}>
                          {"published"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="threads" className="space-y-4">
                <div className="space-y-3">
                  {user.comments?.data.map((thread) => (
                    <div
                      key={thread.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{thread.content}</p>
                        <p className="text-sm text-gray-500">
                          {thread.target} • {thread.date}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="likes" className="space-y-4">
                <div className="space-y-3">
                  {user.likes?.data.map((like) => (
                    <div
                      key={like.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{like.title}</p>
                        <p className="text-sm text-gray-500">
                          {like.type} • {like.date}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
