'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, SearchIcon, FilterIcon } from 'lucide-react'
import Link from 'next/link'

// Mock data for capsules
const capsules = [
  { id: 1, title: "Graduation Memories", creationDate: "2023-05-15", openingDate: "2028-05-15", status: "sealed" },
  { id: 2, title: "Wedding Time Capsule", creationDate: "2023-06-01", openingDate: "2033-06-01", status: "sealed" },
  { id: 3, title: "First Job Memories", creationDate: "2022-01-10", openingDate: "2027-01-10", status: "sealed" },
  { id: 4, title: "2020 Pandemic Capsule", creationDate: "2020-12-31", openingDate: "2025-12-31", status: "sealed" },
  { id: 5, title: "Family Reunion 2022", creationDate: "2022-07-04", openingDate: "2023-07-04", status: "opened" },
]

export function MyCapsules() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredCapsules = capsules.filter(capsule => 
    capsule.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === "all" || capsule.status === statusFilter)
  )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Capsules</h1>
      
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search capsules..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <FilterIcon className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Capsules</SelectItem>
            <SelectItem value="sealed">Sealed</SelectItem>
            <SelectItem value="opened">Opened</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCapsules.map(capsule => (
          <Card key={capsule.id} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">{capsule.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Created: {capsule.creationDate}</p>
              <p className="text-sm text-gray-600">Opens: {capsule.openingDate}</p>
            </CardContent>
            <CardFooter>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                capsule.status === 'sealed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}>
                {capsule.status.charAt(0).toUpperCase() + capsule.status.slice(1)}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Link href='/create'>
        <Button 
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
        >
          <PlusIcon className="w-6 h-6" />
          <span className="sr-only">Create new capsule</span>
        </Button>
      </Link>
      
    </div>
  )
}