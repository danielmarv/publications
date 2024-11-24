"use server";

import { createAdminClient } from "@/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";

// Handle errors consistently
const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  throw error;
};

// ============================== CREATE COMMENT
export const createComment = async ({
  publicationId,
  userId,
  commentText,
}: CreateCommentProps): Promise<Comment | null> => {
  const { databases } = await createAdminClient();

  try {
    const comment = {
      commentText,
      users: [userId],
      publication: publicationId,
      createdAt: new Date().toISOString(),
    };

    const newComment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.approverCollectionId,
      ID.unique(),
      comment
    );

    return parseStringify(newComment);
  } catch (error) {
    handleError(error, "Failed to create comment");
    return null;
  }
};

// ============================== GET COMMENTS BY PUBLICATION
export const getCommentsByPublication = async ({
  publicationId,
  limit = 10,
}: GetCommentsProps): Promise<Comment[] | null> => {
  const { databases } = await createAdminClient();

  try {
    const queries = [
      Query.equal("publication", [publicationId]),
      Query.limit(limit),
      Query.orderDesc("$createdAt"),
    ];

    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.approverCollectionId,
      queries
    );

    return parseStringify(comments.documents);
  } catch (error) {
    handleError(error, "Failed to fetch comments");
    return null;
  }
};

// ============================== UPDATE COMMENT STATUS (APPROVERS)
export const updateCommentStatus = async ({
  commentId,
  newStatus,
}: UpdateCommentStatusProps): Promise<Comment | null> => {
  const { databases } = await createAdminClient();

  try {
    const updatedComment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.approverCollectionId,
      commentId,
      { status: newStatus }
    );

    return parseStringify(updatedComment);
  } catch (error) {
    handleError(error, "Failed to update comment status");
    return null;
  }
};

// ============================== DELETE COMMENT
export const deleteComment = async ({
  commentId,
  path,
}: DeleteCommentProps): Promise<{ status: string } | null> => {
  const { databases } = await createAdminClient();

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.approverCollectionId,
      commentId
    );

    revalidatePath(path);
    return parseStringify({ status: "success" });
  } catch (error) {
    handleError(error, "Failed to delete comment");
    return null;
  }
};

// ============================== GET COMMENTS SPACE USAGE
export const getCommentsSpaceUsage = async (): Promise<SpaceUsage | null> => {
  try {
    const { databases } = await createAdminClient();
    const currentUser = await getCurrentUser();

    if (!currentUser) throw new Error("User is not authenticated");

    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.approverCollectionId,
      [Query.equal("users", [currentUser.$id])]
    );

    let totalSize = 0;

    comments.documents.forEach((comment) => {
      if (comment.fileSize) {
        totalSize += comment.fileSize;
      }
    });

    return parseStringify({
      usedSpace: totalSize,
      totalSpace: 2 * 1024 * 1024 * 1024, 
    });
  } catch (error) {
    handleError(error, "Failed to calculate total space used by comments");
    return null;
  }
};
