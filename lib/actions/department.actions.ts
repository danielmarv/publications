"use server";

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";
import { revalidatePath } from "next/cache";

// Handle errors consistently
const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  throw error;
};

// ============================== CREATE DEPARTMENT
export const createDepartment = async ({
  name,
  path,
}: CreateDepartmentProps) => {
  const { databases } = await createAdminClient();

  try {
    const newDepartment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.departmentCollectionId,
      ID.unique(),
      { name }
    );

    revalidatePath(path);
    return newDepartment;
  } catch (error) {
    handleError(error, "Failed to create department");
    return null;
  }
};

// ============================== GET DEPARTMENTS
export const getDepartments = async ({
  searchText = "",
  sort = "$createdAt-desc",
  limit,
}: GetDepartmentsProps): Promise<Department[]> => {
  const { databases } = await createAdminClient();

  try {
    const queries = [
      ...(searchText ? [Query.search("name", searchText)] : []),
      ...(limit ? [Query.limit(limit)] : []),
      Query.orderDesc(sort.split("-")[0]),
    ];

    const departments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.departmentCollectionId,
      queries
    );

    return departments.documents.map((doc) => ({
      $id: doc.$id,
      department: doc.department || "Unnamed Department",
    }));
  } catch (error) {
    handleError(error, "Failed to fetch departments");
    return [];
  }
};

// ============================== GET DEPARTMENT WITH USERS
export const getDepartmentWithUsers = async (
  departmentId: string
) => {
  const { databases } = await createAdminClient();

  try {
    const department = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.departmentCollectionId,
      departmentId
    );

    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("departmentId", departmentId)]
    );

    return { ...department, users: users.documents };
  } catch (error) {
    handleError(error, "Failed to fetch department with users");
    return null;
  }
};

// ============================== UPDATE DEPARTMENT
export const updateDepartment = async ({
  departmentId,
  updates,
  path,
}: UpdateDepartmentProps) => {
  const { databases } = await createAdminClient();

  try {
    const updatedDepartment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.departmentCollectionId,
      departmentId,
      updates
    );

    revalidatePath(path);
    return updatedDepartment;
  } catch (error) {
    handleError(error, "Failed to update department");
    return null;
  }
};

// ============================== DELETE DEPARTMENT
export const deleteDepartment = async ({
  departmentId,
  path,
}: DeleteDepartmentProps): Promise<{ status: string } | null> => {
  const { databases } = await createAdminClient();

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.departmentCollectionId,
      departmentId
    );

    revalidatePath(path);
    return { status: "success" };
  } catch (error) {
    handleError(error, "Failed to delete department");
    return null;
  }
};
