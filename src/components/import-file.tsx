'use client'

import { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileUp } from 'lucide-react'
import { Input } from "@/components/ui/input"

export function ImportFile() {
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [results, setResults] = useState('')
  const { toast } = useToast()

  

  return (
    <div>
        <Card>
      <CardHeader>
        <CardTitle> </CardTitle>
        <CardDescription> </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center w-full" >
          <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600" 
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
              const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
              fileInput.files = e.dataTransfer.files;
              toast({
                title: "File selected",
                description: `File selected: ${file.name}`,
                variant: "default",
              });
              // Display the filename in the dropzone with a file icon
              // const filenameElement = e.currentTarget.querySelector('.filename');
              // if (filenameElement) {
              //   filenameElement.innerHTML = `${file.name}`;
              // }
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('bg-gray-200', 'dark:bg-gray-600');
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove('bg-gray-200', 'dark:bg-gray-600');
          }}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileUp className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOC, DOCX (MAX. 10MB)</p>
              <p className="filename text-sm text-gray-500 dark:text-gray-400 p-6"></p>
            </div>
           
          </Label>
          
        </div>
         <Input id="dropzone-file" type="file" className="max-w-md" />
      </CardContent>
      <CardFooter>
        
        <Button onClick={async () => {
            setIsSubmitting(true)
          const formData = new FormData();
          const fileInput = document.getElementById('dropzone-file') as HTMLInputElement;
          if (fileInput && fileInput.files && fileInput.files[0]) {
            formData.append('file', fileInput.files[0]);
          }
          formData.append('UserID', localStorage.getItem('userEmail') || '');
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT}/import-file`, {
              method: 'POST',
              body: formData,
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (!response.ok) {
              throw new Error('Failed to upload file ' );
            }
            const data = await response.json();
            
            // toast({
            //     title: "File uploaded successfully.",
                
            //     variant: "default",
            //   })
              //alert(`File uploaded successfully. OCR Text: ${data.ocrText}`)
              setIsSubmitting(false)
              setResults(data.ocrText)
              setShowDialog(true)
            
          } catch (error) {
            console.log(error)
            setIsSubmitting(false)
            toast({
                title: "Error uploading file",
                // description: ` ${error.message}`,
                variant: "destructive",
              })
          }
        }} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Upload Data'}</Button>
      </CardFooter>
    </Card>
        {/* <Toaster /> */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Your Report data</DialogTitle>
          </DialogHeader>
          {results ? results : ''}
        </DialogContent>
      </Dialog>
    </div>
  )
}
