'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { FileUp, Download } from 'lucide-react'

export default function ImportCSV() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [processedData, setProcessedData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile)
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid CSV file.",
        variant: "destructive",
      })
    }
  }

  const processFile = async () => {
    if (!file) return

    setIsLoading(true)
    try {
      const text = await file.text()
      const rows = text.split('\n')
      const headers = rows[0].split(',')
      const data = rows.slice(1).filter(row => row.trim()).map(row => {
        const values = row.split(',')
        return headers.reduce((obj, header, index) => {
          obj[header.trim()] = values[index]?.trim() || ''
          return obj
        }, {} as Record<string, string>)
      })
      
      setProcessedData(data)
      toast({
        title: "File processed successfully",
        description: `Processed ${data.length} records.`,
      })
    } catch (error) {
      console.error('Error processing file:', error)
      toast({
        title: "Error",
        description: "Failed to process the CSV file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    if (!processedData) return

    const content = JSON.stringify(processedData, null, 2)
    const filename = 'exported_data.json'
    const mimeType = 'application/json'

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: `Data exported as ${filename}`,
    })
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Import CSV File</CardTitle>
          <CardDescription>Upload a CSV file and export it as JSON</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">CSV files only</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".csv" />
            </Label>
          </div>
          {file && (
            <div className="text-sm text-gray-500">
              Selected file: {file.name}
            </div>
          )}
          <Button onClick={processFile} disabled={!file || isLoading} className="w-full">
            {isLoading ? 'Processing...' : 'Process CSV File'}
          </Button>
          {processedData && (
            <Button onClick={exportData} className="w-full">
              <Download className="mr-2 h-4 w-4" /> Export as JSON
            </Button>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
