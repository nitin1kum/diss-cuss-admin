'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Save, Plus, X } from 'lucide-react'
import { useFetcher } from '@/hooks/useFetcher'

// Mock data
const mockConfig = {
  featuredMovies: ['tt15239678', 'tt15398776', 'tt10872600'],
  featuredThreads: ['thread1', 'thread2', 'thread3']
}

export default function HomepageConfig() {
  const [config, setConfig] = useState(mockConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newMovieId, setNewMovieId] = useState('')
  const [newThreadId, setNewThreadId] = useState('')

  async function fetchData() {
    const data = await useFetcher("/dashboard/data");
    
  }

  useEffect(() => {

    
    fetchData();
    const fetchConfig = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setConfig(mockConfig)
      setLoading(false)
    }

    fetchConfig()
  }, [])

  const handleAddMovie = () => {
    if (newMovieId.trim()) {
      setConfig({
        ...config,
        featuredMovies: [...config.featuredMovies, newMovieId.trim()]
      })
      setNewMovieId('')
    }
  }

  const handleRemoveMovie = (movieId: string) => {
    setConfig({
      ...config,
      featuredMovies: config.featuredMovies.filter(id => id !== movieId)
    })
  }

  const handleAddThread = () => {
    if (newThreadId.trim()) {
      setConfig({
        ...config,
        featuredThreads: [...config.featuredThreads, newThreadId.trim()]
      })
      setNewThreadId('')
    }
  }

  const handleRemoveThread = (threadId: string) => {
    setConfig({
      ...config,
      featuredThreads: config.featuredThreads.filter(id => id !== threadId)
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would send this to your backend API
      const payload = {
        featuredMovies: config.featuredMovies,
        featuredThreads: config.featuredThreads
      }
      
      console.log('Saving config:', payload)
      
      // Show success message
      alert('Configuration saved successfully!')
    } catch (error) {
      alert('Error saving configuration')
    } finally {
      setSaving(false)
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Homepage Configuration</h1>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-1" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Movies</CardTitle>
              <CardDescription>
                Configure which movies will be featured on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter movie ID (e.g., tt15239678)"
                    value={newMovieId}
                    onChange={(e) => setNewMovieId(e.target.value)}
                  />
                  <Button onClick={handleAddMovie}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Current Featured Movies:</Label>
                  <div className="flex flex-wrap gap-2">
                    {config.featuredMovies.map((movieId) => (
                      <Badge key={movieId} variant="secondary" className="flex items-center space-x-1">
                        <span>{movieId}</span>
                        <button
                          onClick={() => handleRemoveMovie(movieId)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Movie IDs should be in IMDb format (e.g., tt15239678). 
                    These movies will be prominently displayed on the homepage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Threads</CardTitle>
              <CardDescription>
                Configure which discussion threads will be featured on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter thread ID (e.g., thread1)"
                    value={newThreadId}
                    onChange={(e) => setNewThreadId(e.target.value)}
                  />
                  <Button onClick={handleAddThread}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label>Current Featured Threads:</Label>
                  <div className="flex flex-wrap gap-2">
                    {config.featuredThreads.map((threadId) => (
                      <Badge key={threadId} variant="secondary" className="flex items-center space-x-1">
                        <span>{threadId}</span>
                        <button
                          onClick={() => handleRemoveThread(threadId)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Note:</strong> Thread IDs should match the IDs in your database. 
                    These threads will be highlighted on the homepage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuration Preview</CardTitle>
            <CardDescription>
              This is how your configuration will be sent to the backend API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-700">
                {JSON.stringify(
                  {
                    featuredMovies: config.featuredMovies,
                    featuredThreads: config.featuredThreads
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}