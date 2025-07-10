'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Edit, Save, Trash2, MessageSquare } from 'lucide-react'
import Link from 'next/link'

// Mock data
const mockThreadDetail = {
  id: 1,
  title: 'Discussion: Dune Part Two',
  content: 'Just watched Dune Part Two and I have to say it exceeded all my expectations. The cinematography was absolutely stunning, and the performances were top-notch. What did everyone else think?',
  movieId: 'tt15239678',
  author: 'John Doe',
  date: '2024-01-15',
  replies: 23,
  isActive: true,
  comments: [
    { id: 1, author: 'Jane Smith', content: 'Totally agree! The desert scenes were incredible.', date: '2024-01-15' },
    { id: 2, author: 'Movie Lover', content: 'Hans Zimmer\'s score was perfect as always.', date: '2024-01-15' },
    { id: 3, author: 'Sci-Fi Fan', content: 'The world-building was phenomenal. Can\'t wait for the next one!', date: '2024-01-16' },
  ]
}

export default function ThreadDetail() {
  const params = useParams()
  const [thread, setThread] = useState(mockThreadDetail)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedContent, setEditedContent] = useState('')

  useEffect(() => {
    // Simulate API call
    const fetchThread = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setThread(mockThreadDetail)
      setEditedTitle(mockThreadDetail.title)
      setEditedContent(mockThreadDetail.content)
      setLoading(false)
    }

    fetchThread()
  }, [params.id])

  const handleSave = () => {
    setThread({
      ...thread,
      title: editedTitle,
      content: editedContent,
    })
    setEditing(false)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this thread?')) {
      // Handle delete logic
      console.log('Delete thread:', thread.id)
    }
  }

  const handleDeleteComment = (commentId: number) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      setThread({
        ...thread,
        comments: thread.comments.filter(comment => comment.id !== commentId)
      })
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/threads">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Threads
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Thread Details</h1>
          </div>
          <div className="flex items-center space-x-2">
            {editing ? (
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-1" />
                Save Changes
              </Button>
            ) : (
              <Button onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={handleDelete}>
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
                  <CardTitle className="text-2xl">{thread.title}</CardTitle>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>by {thread.author}</span>
                  <span>{thread.date}</span>
                  <span>Movie ID: {thread.movieId}</span>
                  <span>{thread.replies} replies</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={thread.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {thread.isActive ? 'Active' : 'Closed'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            ) : (
              <div className="prose max-w-none">
                <p>{thread.content}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Replies ({thread.comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {thread.comments.map((comment) => (
                <div key={comment.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">{comment.author}</span>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}