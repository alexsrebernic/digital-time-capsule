'use client'

import { useState, useEffect } from 'react'
import { Share2, Edit2, Trash2, Lock, Unlock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TimeCapsuleContent {
  type: 'text' | 'image';
  content: string;
}

interface TimeCapsuleProps {
  title: string;
  status: 'sealed' | 'opened';
  openingDate: string;
  contents: TimeCapsuleContent[];
  isOwner: boolean;
}

export function TimeCapsuleView({ 
  title = "My Time Capsule",
  status = "sealed",
  openingDate = "2024-12-31T00:00:00",
  contents = [
    { type: 'text', content: 'This is a memory from 2023...' },
    { type: 'image', content: 'placeholder.com?height=300&width=400' },
    { type: 'text', content: 'Another cherished moment...' },
    { type: 'image', content: 'placeholder.com?height=300&width=400' },
  ],
  isOwner = true
}: TimeCapsuleProps) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (status === 'sealed') {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const openingTime = new Date(openingDate).getTime()
        const difference = openingTime - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((difference % (1000 * 60)) / 1000)

          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        } else {
          clearInterval(timer)
          setTimeLeft('Time capsule is ready to be opened!')
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [status, openingDate])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="flex items-center justify-center space-x-2">
          {status === 'sealed' ? (
            <Lock className="text-yellow-500" />
          ) : (
            <Unlock className="text-green-500" />
          )}
          <span className="text-xl font-semibold capitalize">{status}</span>
        </div>
        {status === 'sealed' && (
          <div className="text-2xl font-mono">{timeLeft}</div>
        )}
      </header>

      {status === 'opened' && (
        <ScrollArea className="h-[400px] rounded-md border">
          <div className="p-4 space-y-4">
            {contents.map((item, index) => (
              <div key={index} className="space-y-2">
                {item.type === 'text' ? (
                  <p>{item.content}</p>
                ) : (
                  <img src={item.content} alt={`Memory ${index + 1}`} className="rounded-lg shadow-md" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <div className="flex justify-center space-x-4">
        <Button variant="ghost" className="hover:bg-gray-100 transition-colors duration-200">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        {isOwner && (
          <>
            <Button variant="ghost" className="hover:bg-gray-100 transition-colors duration-200">
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="ghost" className="hover:bg-red-100 text-red-600 transition-colors duration-200">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  )
}