export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION!,
  filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION!,
  approverCollectionId: process.env.NEXT_PUBLIC_APPWRITE_APPROVER_COLLECTION!,
  publicationCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PUBLICATION_COLLECTION!,
  departmentCollectionId: process.env.NEXT_PUBLIC_APPWRITE_DEPARTMENT_COLLECTION!,
  reviewCollectionId: process.env.NEXT_PUBLIC_APPWRITE_REVIEW_COLLECTION!,
  citationCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CITATION_COLLECTION!,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secretKey: process.env.NEXT_APPWRITE_SECRET!,
};
