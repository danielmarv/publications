'use server';

import { createAdminClient, createSessionClient } from '@/lib/appwrite';
import { InputFile } from 'node-appwrite/file';
import { appwriteConfig } from '@/lib/appwrite/config';
import { ID, Query } from 'node-appwrite';
import {
  constructDownloadUrl,
  constructFileUrl,
  getFileType,
  parseStringify,
} from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/actions/user.actions';

// Handle errors consistently
const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  throw error;
};

// ============================== CREATE PUBLICATION
export const createPublication = async ({
  file,
  title,
  description,
  ownerId,
  path,
}: CreatePublicationProps): Promise<Publication | null> => {
  const { databases } = await createAdminClient();

  try {
    //     const DocId = file

    const storageFile = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      file
    );
    console.log(storageFile);

    const publication = {
      title,
      fileId: storageFile.bucketFileId,
      description,
      owner: ownerId,
      PubDownloadUrl: constructDownloadUrl(storageFile.$id),
      // fileName: storageFile.name,
      // fileType: getFileType(storageFile.name).type,
      PubSize: storageFile.sizeOriginal,
      // bucketFileId: storageFile.$id,
    };

    const newPublication = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.publicationCollectionId,
      ID.unique(),
      publication
    );

    revalidatePath(path);
    return parseStringify(newPublication);
  } catch (error) {
    handleError(error, 'Failed to create publication');
    return null;
  }
};

export const getPublications = async ({
  ownerId,
  role,
  searchText,
  limit,
}: {
  ownerId: string;
  role: string;
  searchText?: string;
  limit?: number;
}): Promise<Publication[] | null> => {
  const { databases } = await createAdminClient();

  try {
   
    const queries = [];

    if (role === "admin" || role === "reviewer") {
      // Fetch all publications for admin or reviewers
      queries.push(Query.orderDesc("$createdAt"));
    } else if (role === "author") {
      // Fetch only owned publications for normal users
      queries.push(Query.equal("owner", [ownerId]));
    }

    if (searchText) {
      queries.push(Query.search("title", searchText));
    }

    if (limit) {
      queries.push(Query.limit(limit));
    }

    const publications = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.publicationCollectionId,
      queries
    );

    return parseStringify(publications.documents);
  } catch (error) {
    handleError(error, 'Failed to fetch publications');
    return null;
  }
};

export const updatePublication = async ({
  publicationId,
  updates,
  path,
}: UpdatePublicationProps): Promise<Publication | null> => {
  const { databases } = await createAdminClient();

  try {
    const updatedPublication = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.publicationCollectionId,
      publicationId,
      updates
    );

    revalidatePath(path);
    return parseStringify(updatedPublication);
  } catch (error) {
    handleError(error, 'Failed to update publication');
    return null; // Return null in case of error
  }
};

export const addReview = async ({
  publicationId,
  reviewerName,
  reviewComment,
}: {
  publicationId: string;
  reviewerName: string;
  reviewComment: string;
}): Promise<boolean> => {
  const { databases } = await createAdminClient();

  try {
    // Fetch the current publication
    const publication = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.publicationCollectionId,
      publicationId
    );

    // Check if the current user has already reviewed this publication
    const existingReviews = publication.review || [];
    for (const reviewId of existingReviews) {
      const review = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.reviewCollectionId,
        reviewId
      );

      if (review.name === reviewerName) {
        console.log("Duplicate review detected for user:", reviewerName);
        return false; // Indicate failure due to duplicate review
      }
    }

    // Create a new review in the "review" table
    const newReview = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reviewCollectionId, // ID of the review collection
      ID.unique(),
      {
        name: reviewerName,
        comment: reviewComment,
        publication: publicationId,
      }
    );

    // Add the new review ID to the publication's "review" field
    const updatedReviews = [...existingReviews, newReview.$id];

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.publicationCollectionId,
      publicationId,
      { review: updatedReviews }
    );

    return true; // Indicate success
  } catch (error) {
    console.error("Failed to add review:", error);
    return false; // Indicate failure
  }
};

export const deletePublication = async ({
  publicationId,
  bucketFileId,
  path,
}: DeletePublicationProps): Promise<
  { status: string } | boolean | undefined
> => {
  const { databases, storage } = await createAdminClient();

  try {
    const deletedPublication = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.publicationCollectionId,
      publicationId
    );

    if (deletedPublication) {
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }

    revalidatePath(path);
    return parseStringify({ status: 'success' });
  } catch (error) {
    handleError(error, 'Failed to delete publication');
  }
};

export const getPublicationsSpaceUsage =
  async (): Promise<SpaceUsage | null> => {
    try {
      const { databases } = await createSessionClient();
      const currentUser = await getCurrentUser();

      if (!currentUser) throw new Error('User is not authenticated');

      const publications = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.publicationCollectionId,
        [Query.equal('owner', [currentUser.$id])]
      );

      let totalSize = 0;

      publications.documents.forEach((publication) => {
        totalSize += publication.fileSize;
      });

      return parseStringify({
        usedSpace: totalSize,
        totalSpace: 2 * 1024 * 1024 * 1024,
      });
    } catch (error) {
      handleError(
        error,
        'Failed to calculate total space used by publications'
      );
      return null;
    }
  };

export const uploadPublication = async ({
  file,
  title,
  description,
  ownerId,
  path,
}: UploadPublicationProps): Promise<Publication | null> => {
  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const storageFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    const publication = {
      title,
      description,
      fileUrl: constructFileUrl(storageFile.$id),
      fileName: storageFile.name,
      fileType: getFileType(storageFile.name).type,
      fileSize: storageFile.sizeOriginal,
      owner: ownerId,
      bucketFileId: storageFile.$id,
    };

    const newPublication = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.publicationCollectionId,
      ID.unique(),
      publication
    );

    revalidatePath(path);
    return parseStringify(newPublication);
  } catch (error) {
    handleError(error, 'Failed to create publication');
    return null;
  }
};

// ============================== UPDATE PUBLICATION USERS
export const updatePublicationUsers = async ({
  publicationId,
  emails,
  path,
}: UpdatePublicationProps & {
  emails: string[];
}): Promise<Publication | null> => {
  const { databases } = await createAdminClient();

  try {
    const updatedPublication = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.publicationCollectionId,
      publicationId,
      {
        users: emails,
      }
    );

    revalidatePath(path);
    return parseStringify(updatedPublication);
  } catch (error) {
    handleError(error, 'Failed to update publication users');
    return null; // Return null in case of error
  }
};

// ============================== RENAME PUBLICATION
export const renamePublication = async ({
  publicationId,
  newTitle,
  path,
}: RenamePublicationProps): Promise<Publication | null> => {
  const { databases } = await createAdminClient();

  try {
    const updatedPublication = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.publicationCollectionId,
      publicationId,
      {
        title: newTitle,
      }
    );

    revalidatePath(path);
    return parseStringify(updatedPublication);
  } catch (error) {
    handleError(error, 'Failed to rename publication');
    return null; // Return null in case of error
  }
};

export const sharePublication = async ({
  publicationId,
  emails,
  path,
}: SharePublicationProps): Promise<Publication | null> => {
  const { databases } = await createAdminClient();

  try {
    const updatedPublication = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.publicationCollectionId,
      publicationId,
      {
        users: emails,
      }
    );

    revalidatePath(path);
    return parseStringify(updatedPublication);
  } catch (error) {
    handleError(error, 'Failed to share publication');
    return null; // Return null in case of error
  }
};
