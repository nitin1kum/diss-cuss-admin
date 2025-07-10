"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Edit, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useFetcher } from "@/hooks/useFetcher";
import { Blog } from "@/types/types";
import { toast } from "sonner";

export default function BlogDetail() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const router = useRouter();
  const [saving, setSaving] = useState(false)
  const [editedCoverImage, setEditedCoverImage] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedPublished, setEditedPublished] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchBlog = async () => {
      const data = await useFetcher(`/blogs/blog/${params.id}`);
      setBlog(data as Blog);
      const { title, html, coverImage } = data as Blog;
      setEditedTitle(title);
      setEditedContent(html);
      setEditedCoverImage(coverImage);
      setEditedPublished(true);
      setLoading(false);
    };

    fetchBlog();
  }, [params.id]);

  const handleSave = async () => {
    if (!blog) return;
    try {
      setSaving(true)
      const data = await useFetcher(`/blogs/edit/${blog.slug}`, {
        method: "POST",
        body: JSON.stringify({
          author_id: blog.author.id,
          id: blog.id,
          coverImage: editedCoverImage,
          title: editedTitle,
          content: blog.content,
          html: editedContent,
          tags: blog.tags,
        }),
      });
      const {blog : newBlog} = data as {message : string,blog : Blog};
      router.push(`/blogs/${newBlog.slug}`);
      setBlog(newBlog);
      const { title, html, coverImage } = newBlog;
      setEditedTitle(title);
      setEditedContent(html);
      setEditedCoverImage(coverImage);
    } catch (error :any) {
      toast.error(error.message || "Error saving data")
      console.log("Error updating data - ",error)
    }
    finally {
      setEditing(false);
      setSaving(false)
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        const data = (await useFetcher(`/blogs/delete/${blog?.slug}`, {
          method: "DELETE",
        })) as { message: string };
        toast.success(data.message || "Blog delete successfully");
        router.push("/blogs")
      } catch (error) {
        toast.error("Error deleting blog");
        console.log(error);
      }
    }
  };

  if (loading || !blog) {
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/blogs">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Blogs
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Blog Details</h1>
          </div>
          <div className="flex items-center space-x-2">
            {editing ? (
              <Button disabled={saving} onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save Changes
              </Button>
            ) : (
              <Button onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                {editing ? (
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-2xl font-bold mb-2"
                  />
                ) : (
                  <CardTitle className="text-2xl">{blog.title}</CardTitle>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>by {blog.author.username}</span>
                  <span>{blog.createdAt.split("T")[0]}</span>
                  <span>{blog.views} views</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  className={
                    1
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {"published"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editedPublished}
                    onCheckedChange={setEditedPublished}
                  />
                  <Label>Published</Label>
                </div>
                <div>
                  <Label htmlFor="content">Cover Image</Label>
                  <Input
                    id="content"
                    value={editedCoverImage}
                    onChange={(e) => setEditedCoverImage(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
                <div>
                  <p>Preview</p>
                  <img src={editedCoverImage} alt="preview" className="w-48" />
                </div>
                <div>
                  <Label htmlFor="content">Content (HTML)</Label>
                  <Textarea
                    id="content"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                  />
                </div>
              </div>
            ) : (
              <>
                <img
                  src={blog.coverImage}
                  alt="blog cover image"
                  className="max-w-7xl w-full mb-10 object-cover h-full"
                />
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: blog.html }} />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
