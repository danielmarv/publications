"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";

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
    handleError(error, "Failed to create publication");
    return null;  
  }
};

export const getPublications = async ({
  ownerId,
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetPublicationsProps): Promise<Publication[] | null> => {
  const { databases } = await createAdminClient();

  try {
    const queries = [
      Query.equal("owner", [ownerId]),
      ...(searchText ? [Query.search("title", searchText)] : []),
      ...(limit ? [Query.limit(limit)] : []),
      Query.orderDesc(sort.split("-")[0]),
    ];

    const publications = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.publicationCollectionId,
      queries
    );

    return parseStringify(publications.documents);  
  } catch (error) {
    handleError(error, "Failed to fetch publications");
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
    handleError(error, "Failed to update publication");
    return null;  // Return null in case of error
  }
};

export const deletePublication = async ({
  publicationId,
  bucketFileId,
  path,
}: DeletePublicationProps): Promise<{ status: string } | null> => {
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
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to delete publication");
    return null;  // Return null in case of error
  }
};

export const getPublicationsSpaceUsage = async (): Promise<SpaceUsage | null> => {
  try {
    const { databases } = await createSessionClient();
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User is not authenticated");

    const publications = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.publicationCollectionId,
      [Query.equal("owner", [currentUser.$id])]
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
    handleError(error, "Failed to calculate total space used by publications");
    return null;  
  }
};
