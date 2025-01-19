import Link from 'next/link';
import Thumbnail from '@/components/Thumbnail';
import FormattedDateTime from '@/components/FormattedDateTime';
import ActionDropdown from './action';

interface PublicationCardProps {
  publication: {
    title: string;
    owner: Array<{
      fullName: string;
      email: string;
      avatar: string;
      accountId: string;
      role: string;
    }>;
    $collectionId: string;
    $createdAt: Date;
    $databaseId: string;
    $id: string;
    $permissions: string[];
    $updatedAt: string;
    PubDownloadUrl: string;
    PubSize: number | null;
    approvers: string[];
    citationCount: number;
    description: string;
    fileId: string;
    review: string[];
    status: string;
    tags: string[];
  };
  role: string;
  name: string;
}

const Card = ({ publication, role, name }: PublicationCardProps) => {
  return (
    <Link
      href={publication.PubDownloadUrl}
      target="_blank"
      className="file-card"
    >
      <div className="flex justify-between">
        <Thumbnail
          type={publication.status}
          extension={publication.title.split('.').pop() || ''}
          url={publication.PubDownloadUrl}
          className="!size-20"
          imageClassName="!size-11"
        />
        {role === 'reviewer' && (
          <div className="flex flex-col items-end justify-between">
            <ActionDropdown
              publication={publication}
              role={role}
              currentUserName={name}
            />
          </div>
        )}

        {role === 'approver' && (
          <div className="flex flex-col items-end justify-between">
            <ActionDropdown
              publication={publication}
              role={role}
              currentUserName={name}
            />
          </div>
        )}

        {role === 'admin' && (
          <div className="flex flex-col items-end justify-between">
            <ActionDropdown
              publication={publication}
              role={role}
              currentUserName={name}
            />
          </div>
        )}
      </div>

      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1">{publication.title}</p>
        <p className="body-2 line-clamp-2">{publication.description}</p>
        <FormattedDateTime
          date={publication.$createdAt}
          className="body-2 text-light-100"
        />
        <p className="caption line-clamp-1 text-light-200">
          By: {publication.owner.fullName}
        </p>

        {/* Reviews Section */}
        {publication.review.length > 0 ? (
          <div className="caption line-clamp-4 text-light-200">
            Reviews ({publication.review.length}):{' '}
            {publication.review
              .map((review) => review.name)
              .filter((name) => !!name)
              .join(', ')}
          </div>
        ) : (
          <div className="caption line-clamp-1 text-light-200">
            No reviews
          </div>
        )}
      </div>
    </Link>
  );
};

export default Card;
