export type Publication = {
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
    extractedText: string
  }
  
  