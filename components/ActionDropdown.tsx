'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import Image from 'next/image';
import { Models } from 'node-appwrite';
import Link from 'next/link';
import { constructDownloadUrl } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  deleteFile,
  draftDocument,
  renameFile,
  undraftDocument,
  updateFileUsers,
} from '@/lib/actions/file.actions';
import { createPublication } from '@/lib/actions/pubs.actions';
import { usePathname } from 'next/navigation';
import { FileDetails, ShareInput } from '@/components/ActionsModalContent';
import { getCurrentUser } from '@/lib/actions/user.actions';

interface DraftDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: Models.Document;
}

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [Title, setTitle] = useState(file.name);
  const [Description, setDescription] = useState(file.name);

  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
    //   setEmails([]);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;
    const currentUser = await getCurrentUser();
    const OwnerId = currentUser.$id;
    const actions = {
      publish: () =>
        createPublication({
          file: file.$id,
          title: Title,
          description: Description,
          ownerId: OwnerId,
          path,
        }),
      rename: () =>
        renameFile({ fileId: file.$id, name, extension: file.extension, path }),
      share: () => updateFileUsers({ fileId: file.$id, emails, path }),
      delete: () =>
        deleteFile({ fileId: file.$id, bucketFileId: file.bucketFileId, path }),
      draft: () => draftDocument(file.$id),
      undraft: () => undraftDocument(file.$id),
    };

    success = await actions[action.value as keyof typeof actions]();
    if (success) closeAllModals();

    setIsLoading(false);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = emails.filter((e) => e !== email);

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmails,
      path,
    });

    if (success) setEmails(updatedEmails);
    closeAllModals();
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === 'rename' && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === 'details' && <FileDetails file={file} />}
          {value === 'share' && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
          {value === 'publish' && (
            <>
              <Input
                type="text"
                placeholder="Title of Publication"
                //      value={file.name}
                required
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                type="text"
                //      value=""
                required
                placeholder="Publication Description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </>
          )}
          {value === 'delete' && (
            <p className="delete-confirmation">
              Are you sure you want to delete{` `}
              <span className="delete-file-name">{file.name}</span>?
            </p>
          )}
          {value === 'draft' && (
            <p>
              Are you sure you want to draft the document titled &quot;{file.name}&quot;
              for publishing?
            </p>
          )}
          {value === 'undraft' && (
            <p>
              Are you sure you want to undraft the document titled "{file.name}"
              ?
            </p>
          )}
        </DialogHeader>
        {['publish', 'rename', 'delete', 'share', 'draft', 'undraft'].includes(
          value
        ) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  const draftAction = file.drafted
    ? { value: 'undraft', label: 'Undraft', icon: '/assets/icons/file-svg.svg' }
    : {
        value: 'draft',
        label: 'Draft for Publishing',
        icon: '/assets/icons/file-svg.svg',
      };

  const actionsDropdownItems = [
    draftAction,
    {
      label: 'Publish',
      icon: '/assets/icons/publish.svg',
      value: 'publish',
    },
    {
      label: 'Rename',
      icon: '/assets/icons/edit.svg',
      value: 'rename',
    },
    {
      label: 'Details',
      icon: '/assets/icons/info.svg',
      value: 'details',
    },
    {
      label: 'Share',
      icon: '/assets/icons/share.svg',
      value: 'share',
    },
    {
      label: 'Download',
      icon: '/assets/icons/download.svg',
      value: 'download',
    },
    {
      label: 'Delete',
      icon: '/assets/icons/delete.svg',
      value: 'delete',
    },
  ];

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem);

                if (
                  [
                    'publish',
                    'rename',
                    'share',
                    'delete',
                    'details',
                    'draft',
                    'undraft',
                  ].includes(actionItem.value)
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {actionItem.value === 'download' ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
