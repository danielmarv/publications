"use client"

import type React from "react"
import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// PDF Worker Setup
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"

interface DocumentViewerProps {
  url: string
  title: string
  isOpen: boolean
  fileType: "pdf" | "image" | "docx" | "xlsx" | "txt"
  onClose: () => void
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ url, title, isOpen, fileType, onClose }) => {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center">
          {fileType === "pdf" && (
            <div className="max-h-[calc(100vh-200px)] overflow-auto">
              <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
              </Document>
              <div className="flex items-center justify-between w-full mt-4">
                <Button onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))} disabled={pageNumber <= 1}>
                  Previous
                </Button>
                <p>Page {pageNumber} of {numPages}</p>
                <Button onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))} disabled={pageNumber >= (numPages || 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {fileType === "image" && <img src={url} alt={title} className="max-h-[calc(100vh-200px)]" />}

          {fileType === "txt" && (
            <iframe src={url} className="w-full h-[500px] border rounded-md" title={title}></iframe>
          )}

          {fileType === "docx" || fileType === "xlsx" ? (
            <div className="text-center">
              <p>Unsupported format for preview.</p>
              <a href={url} download className="text-blue-500 underline">Download file</a>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentViewer
