import React from "react";
import { Button } from "./ui/button";
import { kMaxLength } from "buffer";

type Publication = {
  title: string;
  authors: string;
  year: number;
  description?: string;
  source?: string;
  citedBy?: number;
  link?: string;
  relatedLink?: string;
  downloadLink?: string;
};

interface PublicationListProps {
  publications: Publication[];
}
const truncateString = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + " . . ." : text;
};

const PublicationList: React.FC<PublicationListProps> = ({ publications }) => {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Publications</h1>
      <ul className="space-y-6">
        {publications.map((pub, index) => (
          <li
            key={index}
            className="flex items-start border-b pb-4 last:border-none"
          >

            <div className="flex-1">
              <h2 className="text-lg font-medium text-blue-600 hover:underline">
                {pub.link ? (
                  <a href={pub.link} target="_blank" rel="noopener noreferrer">
                    {pub.title}
                  </a>
                ) : (
                  pub.title
                )}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                {pub.authors}  <span className="px-6" >{pub.year}</span>
              </p>

              {pub.description && (
                <p className="text-sm max-w-[800px] text-gray-700 hover:cursor-pointer mb-2">{truncateString(pub.description, 225)}</p>
              )}

              {pub.source && (
                <p className="text-xs italic text-gray-500">{pub.source}</p>
              )}

              <div className="text-xs text-gray-500 mt-2 space-x-32">
                <span className="cursor-pointer hover:underline">Save</span>
                <span className="cursor-pointer hover:underline">Cite</span>
                {pub.citedBy && (
                  <span className="hover:underline">
                    Cited by {pub.citedBy}
                  </span>
                )}
                {pub.relatedLink && (
                  <a
                    href={pub.relatedLink}
                    className="hover:underline text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Related articles
                  </a>
                )}
              </div>
            </div>

            {pub.downloadLink && (
              <div className="ml-auto">
                <a href={pub.downloadLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="destructive"
                    className="text-sm text-white bg-rose-400 hover:bg-rose-500 px-4 py-1 rounded shadow-md"
                  >
                    Download
                  </Button>
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicationList;
