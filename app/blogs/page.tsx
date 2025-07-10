"use client";

import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { SearchAndFilter } from "./_components/SearchAndFilter";
import { useFetcher } from "@/hooks/useFetcher";
import { Blog, BlogItem, BlogsData } from "@/types/types";

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasReached, setHasReached] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent");

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch blogs on filters (search, tags, sort) change
  useEffect(() => {
    const fetchInitialBlogs = async () => {
      setLoading(true);
      setPage(1);
      try {
        const tagQuery = selectedTags.length
          ? `&tags=${selectedTags.join(",")}`
          : "";
        const query = `/blogs?sort=${sortBy}&q=${debouncedSearch.trim()}${tagQuery}&page=1`;
        const data = await useFetcher(query);
        const {
          data: blogsData,
          page: currentPage,
          topTags,
          total_pages,
        } = data as BlogsData;

        setBlogs(blogsData);
        setPage(currentPage);
        setHasReached(currentPage >= total_pages);
        setAvailableTags(topTags || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialBlogs();
  }, [debouncedSearch, selectedTags, sortBy]);

  const fetchBlogs = async (pageNumber: number) => {
    setLoadingMore(true);
    try {
      const tagQuery = selectedTags.length
        ? `&tags=${selectedTags.join(",")}`
        : "";
      const query = `/blogs?sort=${sortBy}&q=${debouncedSearch.trim()}${tagQuery}&page=${pageNumber}`;
      const data = await useFetcher(query);
      const {
        data: blogsData,
        page: currentPage,
        total_pages,
      } = data as BlogsData;

      setBlogs((prev) => [...prev, ...blogsData]);
      setPage(currentPage);
      setHasReached(currentPage >= total_pages);
    } catch (err) {
      console.error("Failed to load more blogs:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Blogs</h1>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            New Blog
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Blog Management</CardTitle>
            <CardDescription>
              Manage all blog posts on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <SearchAndFilter
                handleSubmit={() => {}}
                onTagToggle={(tag) => {
                  setSelectedTags((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  );
                }}
                onSearchChange={(val) => setSearchTerm(val)}
                onSortChange={(val) => setSortBy(val)}
                availableTags={availableTags}
                selectedTags={selectedTags}
                searchTerm={searchTerm}
                sortBy={sortBy}
              />
            </div>

            <div className="space-y-4">
              {loading && (
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
              )}
              {!loading &&
                blogs.map((blog: BlogItem) => (
                  <div
                    key={blog.id}
                    className="flex flex-col items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium line-clamp-1">{blog.title}</h3>
                      <Badge className={getStatusColor("published")}>
                        {"published"}
                      </Badge>
                    </div>
                    <div className="flex justify-between w-full">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          by {blog.username}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>{blog.createdAt.split("T")[0]}</span>
                          <span>{blog.views} views</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/blogs/${blog.slug}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(blog.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              {!loading && !hasReached && (
                <div className="flex justify-center my-8">
                  <Button
                    onClick={() => fetchBlogs(page + 1)}
                    variant="secondary"
                  >
                    Load More
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
