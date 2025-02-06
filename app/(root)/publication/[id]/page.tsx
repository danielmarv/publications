"use client"

import { useEffect, useState } from "react"
import { GetPublicationById } from "@/lib/actions/pubs.actions"
import { getFileByBucketId } from "@/lib/actions/file.actions"
import type { Publication } from "@/types/publication"
import Image from "next/image"

interface PageProps {
  params: { id: string }
}

const PublicationDetails = ({ params }: PageProps) => {
  const [publication, setPublication] = useState<Publication | null>(null)
  const [file, setFile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  useEffect(() => {
    const fetchPublication = async () => {
      if (!params.id) {
        setError("Publication ID is missing")
        setIsLoading(false)
        return
      }

      try {
        const result = await GetPublicationById(params.id)
        if (!result) throw new Error("Publication not found")
        setPublication(result)
      } catch (error) {
        console.error("Error fetching publication:", error)
        setError("Failed to load publication")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublication()
  }, [params.id])

  useEffect(() => {
    if (!publication || !publication.fileId) {
      console.error("Missing bucketFileId for publication:", publication);
      return;
    }
      const getFile = async () => {
        try {
          const fetchedFile = await getFileByBucketId(publication.fileId);
          console.log("Fetched File:", fetchedFile);
          setFile(fetchedFile);
        } catch (error) {
          console.error("Failed to fetch file:", error);
          setFile(null);
        }
      };
        getFile();
    }, [publication]);

  if (isLoading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>
  if (!publication) return <div className="text-center py-10">No publication found</div>

  const owner = publication.owner

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-4">{publication.title}</h1>

      <div className="flex items-center mb-6">
        <Image
          src={owner.avatar || "/placeholder-avatar.png"}
          alt={`${owner.fullName}'s avatar`}
          width={50}
          height={50}
          className="rounded-full mr-4"
        />
        <div>
          <p className="font-semibold">{owner.fullName}</p>
          <p className="text-sm text-gray-600">{owner.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="font-semibold">Citation Count:</p>
          <p>{publication.citationCount}</p>
        </div>
        <div>
          <p className="font-semibold">Created At:</p>
          <p>{formatDate(publication.$createdAt)}</p>
        </div>
        <div>
          <p className="font-semibold">File Type:</p>
          {file ? (
            <p>{file.extension}</p>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
        </div>
        <div>
          <p className="font-semibold">Tags:</p>
          <p>{publication.tags.join(", ")}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{publication.description}</p>
      </div>

      <div>
        <a
          href={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${publication.fileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Download Publication
        </a>
      </div>
    </div>
  )
}

export default PublicationDetails

