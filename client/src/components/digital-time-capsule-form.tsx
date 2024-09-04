'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Lock, Unlock } from 'lucide-react'
import { format } from 'date-fns'
import { useDropzone } from 'react-dropzone'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function DigitalTimeCapsuleForm() {
  const [isPublic, setIsPublic] = useState(false)
  const [files, setFiles] = useState([])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {'image/*': [], 'application/pdf': []},
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })))
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    // Handle form submission here
    console.log('Form submitted')
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 max-w-2xl"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Create Your Digital Time Capsule</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Capsule Title</Label>
          <Input id="title" placeholder="Enter capsule title" required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Describe your time capsule" required />
        </div>
        <div>
          <Label htmlFor="openingDate">Opening Date</Label>
          <Input id="openingDate" type="date" min={format(new Date(), 'yyyy-MM-dd')} required />
        </div>
        <div>
          <Label htmlFor="fileUpload">Upload Files</Label>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors duration-300 ${
              isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">Drag & drop files here, or click to select files</p>
          </div>
          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium">Uploaded files:</h4>
              <ul className="mt-2 text-sm text-gray-500">
                {files.map((file) => (
                  <li key={file.name}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="public" 
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <Label htmlFor="public" className="flex items-center cursor-pointer">
            {isPublic ? (
              <Unlock className="h-4 w-4 mr-2" />
            ) : (
              <Lock className="h-4 w-4 mr-2" />
            )}
            Make capsule {isPublic ? 'public' : 'private'}
          </Label>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button type="submit" className="w-full">
            Create Capsule
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}