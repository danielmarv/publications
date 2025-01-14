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
import { reviewItems } from '@/constants';
import { Button } from '@/components/ui/button';
import {
  addReview,
  updatePublication,
} from '@/lib/actions/pubs.actions';
import { usePathname } from 'next/navigation';

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

  const renderDialogContent = () => {
    if (!action) return null;

    return (
      <DialogContent className="shad-dialog button">
          <DialogHeader>
            <DialogTitle>Review Publication</DialogTitle>
          </DialogHeader>
          <textarea
            placeholder="Enter your review comment (optional)"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full rounded border p-2"
          />
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleReview} disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Review'}
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
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
