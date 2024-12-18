import Link from "next/link";
import Thumbnail from "@/components/Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDateTime from "@/components/FormattedDateTime";
import ActionDropdown from "./action";

interface PublicationCardProps {
  publication: {
    $id: string;
    title: string;
    description: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    owner: string;
    bucketFileId: string;
    $createdAt: string;
  };
}

const Card = ({ publication }: PublicationCardProps) => {
  return (
    <Link href={publication.fileUrl} target="_blank" className="file-card">
      <div className="flex justify-between">
        <Thumbnail
          type={publication.fileType}
          extension={publication.fileName.split(".").pop() || ""}
          url={publication.fileUrl}
          className="!size-20"
          imageClassName="!size-11"
        />

        <div className="flex flex-col items-end justify-between">
          <ActionDropdown publication={publication} />
          <p className="body-1">{convertFileSize(publication.fileSize)}</p>
        </div>
      </div>

      <div className="file-card-details">
        <p className="subtitle-2 line-clamp-1">{publication.title}</p>
        <p className="body-2 line-clamp-2">{publication.description}</p>
        <FormattedDateTime
          date={publication.$createdAt}
          className="body-2 text-light-100"
        />
        <p className="caption line-clamp-1 text-light-200">
          By: {publication.owner}
        </p>
      </div>
    </Link>
  );
};

export default Card;
