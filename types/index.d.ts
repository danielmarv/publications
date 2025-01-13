/* eslint-disable no-unused-vars */

declare type FileType = "document" | "image" | "video" | "audio" | "other";

declare interface ActionType {
  label: string;
  icon: string;
  value: string;
}

declare interface SearchParamProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

declare interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}
declare interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
  drafted?: boolean;
}

declare interface GetDepartmentsProps {
  searchText?: string;
  sort?: string;
  limit?: number;
}

declare interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}
declare interface UpdateFileUsersProps {
  fileId: string;
  emails: string[];
  path: string;
}
declare interface DeleteFileProps {
  fileId: string;
  bucketFileId: string;
  path: string;
}

declare interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

declare interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}
declare interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

declare interface ThumbnailProps {
  type: string;
  extension: string;
  url: string;
  className?: string;
  imageClassName?: string;
}

declare interface ShareInputProps {
  file: Models.Document;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (email: string) => void;
}

// ============================== CREATE PUBLICATION
declare interface CreatePublicationProps {
  file: string;  // The file object (document, image, etc.) to be uploaded
  title: string;  // The title of the publication
  description: string;  // A brief description of the publication
  ownerId: string;  // The ID of the user who owns the publication
  path: string;  // The path for cache revalidation after creating the publication
}


// ============================== PUBLICATION RESPONSE
declare interface Publication {
  $id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileType: FileType;
  fileSize: number;
  owner: string;
  bucketFileId: string;
  citationCount: number;
}

// ============================== STORAGE FILE RESPONSE
declare interface StorageFile {
  $id: string;  // File ID in the storage
  name: string;  // The name of the file
  sizeOriginal: number;  // Original file size
  $createdAt: string;  // Date when the file was created
  $updatedAt: string;  // Date when the file was last updated
}

// ============================== PUBLICATION CREATION RESPONSE
declare interface CreatePublicationResponse {
  status: "success" | "error";  // Status of the publication creation
  publication: Publication | null;  // The created publication or null if failed
  errorMessage?: string;  // Optional error message if something went wrong
}

// ============================== FILE CREATION RESPONSE
declare interface FileCreationResponse {
  fileUrl: string;  // URL where the file can be accessed
  fileName: string;  // Name of the file
  fileType: FileType;  // Type of the file (document, image, etc.)
  fileSize: number;  // Size of the file
}

// ============================== GET PUBLICATIONS
declare interface GetPublicationsProps {
  ownerId: string;
  searchText?: string;
  sort?: string;
  limit?: number;
}

// ============================== UPDATE PUBLICATION
declare interface UpdatePublicationProps {
  publicationId: string;
  updates: Partial<Publication>;
  path: string;
}

// ============================== DELETE PUBLICATION
declare interface DeletePublicationProps {
  publicationId: string;
  bucketFileId: string;
  path: string;
}

// ============================== SPACE USAGE
declare interface SpaceUsage {
  usedSpace: number;
  totalSpace: number;
}

declare interface CreateCommentProps {
  publicationId: string;
  commentText: string;
  userId: string;
  status: "approved" | "rejected" | "pending";
}

declare interface GetCommentsProps {
  publicationId: string;
  limit?: number;
  sort?: string;
}

declare interface UpdateCommentStatusProps {
  commentId: string;
  status: "approved" | "rejected" | "pending";
  newStatus: "pending" | "approved" | "rejected";
}

declare interface DeleteCommentProps {
  commentId: string;
  publicationId: string;
  path
}


declare interface CreateDepartmentProps {
  department: string;
}

declare interface UpdateDepartmentProps {
  departmentId: string;
  updates: {
    department?: string;
  };
  path: string;
}

declare interface DeleteDepartmentProps {
  departmentId: string;
  path: string;
}

declare interface Department {
  $id: string;
  department: string;
}

declare interface DepartmentWithUsers extends Department {
  users: { userId: string }[];
}

declare interface UploadPublicationProps {
  file: File;
  title: string;
  description: string;
  ownerId: string;
  emails: string;
  path: string;
}
 declare interface RenamePublicationProps {
  publicationId: string;
  newTitle: string;
  path: string;
}

interface SharePublicationProps {
  publication: Publication; 
  emails: string[]; // Array of emails to share the publication with
  onEmailChange: (emails: string[]) => void; // Callback for when the list of emails changes
  onRemoveEmail: (email: string) => void; // Callback for removing an email
}

declare interface SharePublicationInputProps {
  publication: Publication; 
  emails: string[]; // Array of emails to share the publication with
  onEmailChange: (emails: string[]) => void; // Callback for when the list of emails changes
  onRemoveEmail: (email: string) => void; // Callback for removing an email
}

declare interface User {
  fullName: string;
  email: string;
  avatar: string;
  accountId: string;
}

declare interface UpdateUserData {
      fullName: string;
      email: string;
      avatar: string;
      accountId: string;
    }