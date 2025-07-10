'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Eye, Edit, Trash2, Plus } from 'lucide-react'

// Mock data
const mockThreads = [
  { id: 1, title: 'Discussion: Dune Part Two', movieId: 'tt15239678', author: 'John Doe', date: '2024-01-15', replies: 23, isActive: true },
  { id: 2, title: 'What are your thoughts on Marvel Phase 5?', movieId: 'tt10872600', author: 'Jane Smith', date: '2024-01-14', replies: 45, isActive: true },
  { id: 3, title: 'Oppenheimer vs The Dark Knight', movieId: 'tt15398776', author: 'Movie Lover', date: '2024-01-13', replies: 12, isActive: false },
  { id: 4, title: 'Best Horror Movies of 2024', movieId: 'tt13560574', author: 'Horror Fan', date: '2024-01-12', replies: 67, isActive: true },
  { id: 5, title: 'Independent Cinema Discussion', movieId: 'tt11464826', author: 'Indie Lover', date: '2024-01-11', replies: 8, isActive: true },
  { id: 6, title: 'Animation vs Live Action', movieId: 'tt6443346', author: 'Animation Pro', date: '2024-01-10', replies: 34, isActive: false },
]

export default function Threads() {
  const [threads, setThreads] = useState(mockThreads)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchThreads = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setThreads(mockThreads)
      setLoading(false)
    }

    fetchThreads()
  }, [])

  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.movieId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this thread?')) {
      setThreads(threads.filter(thread => thread.id !== id))
    }
  }

  const toggleStatus = (id: number) => {
    setThreads(threads.map(thread => 
      thread.id === id ? { ...thread, isActive: !thread.isActive } : thread
    ))
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Threads</h1>
          <Button>
            <Plus className="h-4 w-4 mr-1" />
            New Thread
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thread Management</CardTitle>
            <CardDescription>Manage all discussion threads on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search threads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <div key={thread.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium">{thread.title}</h3>
                      <Badge className={thread.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {thread.isActive ? 'Active' : 'Closed'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">by {thread.author}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>Movie ID: {thread.movieId}</span>
                      <span>{thread.date}</span>
                      <span>{thread.replies} replies</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/threads/${thread.id}`}>
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
                      onClick={() => toggleStatus(thread.id)}
                      className={thread.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                    >
                      {thread.isActive ? 'Close' : 'Open'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(thread.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}