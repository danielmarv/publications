import { Client, Databases } from 'node-appwrite';
import { appwriteConfig } from '@/lib/appwrite/config';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/appwrite';


export const fetchPublication = async (publicationId: string) => {
  try {
    const { databases } = await createAdminClient(); // Admin access for reading the publication
    const publication = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.publicationCollectionId, publicationId);
    return publication;
  } catch (error) {
    console.error("Error fetching publication", error);
    return null;
  }
};

export const updatePublicationCitationCount = async (publicationId: string, path: string) => {
  try {
    const { databases } = await createAdminClient();
    const updatedPublication = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.publicationCollectionId,
      publicationId,
      { citationCount: new Date().getFullYear() + 1 } // Example: incrementing citation count
    );
    revalidatePath(path); // Revalidate paths if needed
    return updatedPublication;
  } catch (error) {
    console.error("Error updating publication", error);
    return null;
  }
};
