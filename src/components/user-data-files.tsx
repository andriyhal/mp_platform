'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'

interface DataFile {
  id: string
  fileName: string
  fileType: string
  uploadDate: string
}



interface UserDataFilesProps {
  UserID: string
}

export function UserDataFiles({ UserID }: UserDataFilesProps) {
  const [files, setFiles] = useState<DataFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()

  const fetchDataFiles = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/get-data-files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ UserID }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data files')
      }

      const data = await response.json()
      setFiles(data)
    } catch (err) {
      setError('Failed to load data files. Please try again.')
      toast({
        title: "Error",
        description: "Failed to load data files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDataFiles()
  }, [UserID])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Button onClick={fetchDataFiles} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <Table>
      <TableCaption>A list of your uploaded data files</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>File Type</TableHead>
          <TableHead>Upload Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.id}>
            <TableCell>{file.fileName}</TableCell>
            <TableCell>{file.fileType}</TableCell>
            <TableCell>{file.uploadDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}