"use client"

import { useState, useEffect } from "react"
import Thumbnail from "@/components/Thumbnail"
import FormattedDateTime from "@/components/FormattedDateTime"
import ActionDropdown from "./action"
import DocumentViewer from "./DocumentViewer"
import { getFileByBucketId } from "@/lib/actions/file.actions"

interface PublicationCardProps {
  publication: {
    title: string
    owner: Array<{
      fullName: string
      email: string
      avatar: string
      accountId: string
      role: string
    }>
    $collectionId: string
    $createdAt: Date
    $databaseId: string
    $id: string
    $permissions: string[]
    $updatedAt: string
    PubDownloadUrl: string
    PubSize: number | null
    approvers: string[]
    citationCount: number
    description: string
    fileId: string
    review: string[]
    status: string
    tags: string[]
  }
  role: string
  name: string
}

const Card = ({ publication, role, name }: PublicationCardProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [file, setFile] = useState<any>(null)

  useEffect(() => {
    if (!publication.fileId) {
      console.error("Missing fileId for publication:", publication);
      return;
    }
  
    const getFile = async () => {
      try {
        const file = await getFileByBucketId(publication.fileId);
        setFile(file);
      } catch (error) {
        console.error("Failed to fetch file:", error);
      }
    };
  
    getFile();
  }, [publication.fileId]);
  

  return (
    <>
      <div className="file-card cursor-pointer" onClick={() => setIsViewerOpen(true)}>
        <div className="flex justify-between">
          <Thumbnail
            type={publication.status}
            extension={publication.title.split(".").pop() || ""}
            url={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${publication.fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`}
            className="!size-20"
            imageClassName="!size-11"
          />
          {(role === "reviewer" || role === "approver" || role === "admin") && (
            <div className="flex flex-col items-end justify-between">
              <ActionDropdown publication={publication} role={role} currentUserName={name} />
            </div>
          )}
        </div>

        <div className="file-card-details">
          <p className="subtitle-2 line-clamp-1">{publication.title}</p>
          <p className="body-2 line-clamp-2">{publication.description}</p>
          <FormattedDateTime date={publication.$createdAt} className="body-2 text-light-100" />
          <p className="caption line-clamp-1 text-light-200">By: {publication.owner[0]?.fullName}</p>

          {/* Reviews Section */}
          {publication.review.length > 0 ? (
            <div className="caption line-clamp-4 text-light-200">
              Reviews ({publication.review.length}):{" "}
              {publication.review
                .map((review: any) => review.name)
                .filter((name: string) => !!name)
                .join(", ")}
            </div>
          ) : (
            <div className="caption line-clamp-1 text-light-200">No reviews</div>
          )}
        </div>
      </div>

      <DocumentViewer
        url={file?.url}
        title={publication.title}
        isOpen={isViewerOpen}
        fileType={file?.extension}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  )
}

export default Card

