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
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { reviewItems, approveItems } from '@/constants';
import { Button } from '@/components/ui/button';
import { addReview, updatePublication } from '@/lib/actions/pubs.actions';

const ActionDropdown = ({
  publication,
  role,
  currentUserName,
}: {
  publication: Publication;
  role: string;
  currentUserName: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const path = usePathname();

  const handleReview = async () => {
    setIsLoading(true);

    const success = await addReview({
      publicationId: publication.$id,
      reviewerName: currentUserName,
      reviewComment,
    });

    if (success) {
      setIsModalOpen(false);
    }

    setIsLoading(false);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;
    const actions = {
      review: () =>
        addReview({
          publicationId: publication.$id,
          reviewerName: currentUserName,
          reviewComment,
        }),
      approve: () =>
        updatePublication({
          publicationId: publication.$id,
          updates: { status: 'Approved' },
          path,
        }),
    };

    try {
      success = await actions[action.value as keyof typeof actions]();
      if (success) {
        console.log(`${action.label} action completed successfully.`);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(`Failed to execute ${action.label} action:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        {value === 'review' && (
          <textarea
            placeholder="Enter your review comment (optional)"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full rounded border p-2"
          />
        )}
        {value === 'approve' && (
          <p>
            Are you sure you want to approve the document: &quot;
            {publication.title}&quot; to be published?
          </p>
        )}
        <DialogFooter>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAction} disabled={isLoading}>
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
      </DialogContent>
    );
  };

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
            {publication.title}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {role === 'reviewer' && (
            <div>
              {reviewItems.map((actionItem) => (
                <DropdownMenuItem
                  key={actionItem.value}
                  className="shad-dropdown-item"
                  onClick={() => {
                    setAction(actionItem);

                    if (['review'].includes(actionItem.value)) {
                      setIsModalOpen(true);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />
                    {actionItem.label}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}

          {role === 'approver' && (
            <div>
              {approveItems.map((actionItem) => (
                <DropdownMenuItem
                  key={actionItem.value}
                  className="shad-dropdown-item"
                  onClick={() => {
                    setAction(actionItem);

                    if (['approve'].includes(actionItem.value)) {
                      setIsModalOpen(true);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />
                    {actionItem.label}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
