'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { listPublications, UpdateCiteCount } from '@/lib/actions/pubs.actions';
import { constructDownloadUrl, constructFileUrl } from '@/lib/utils';
import mammoth from 'mammoth';
import { TextAlignCenterIcon } from '@radix-ui/react-icons';
import CiteModal from './CiteModal';
import { getCurrentUser } from '@/lib/actions/user.actions';

type Publication = {
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
  extractedText:string;
};


const PublicationList = () => {
  const [publications, setpublications] = useState<Publication[]>([]);
  const [active, Setactive] = useState<string | null>(null);
  const [currentUser, setcurrentUser] = useState<any | null>(null);
  useEffect(() => {
    const handleGetPublications = async () => {
      const currentUser = await getCurrentUser();
      setcurrentUser(currentUser);
      try {
        const publication = await listPublications({
          searchText: '',
          limit: 10,
        });
        setpublications(publication);
      } catch (error) {
        console.error('Error fetching publications:', error);
      }
    };

    handleGetPublications();
  }, []);
  useEffect(() => {
        const handleExtractedData = async () => {
          try {
            for (const publication of publications) {
              if (publication.fileId) {
                const fileUrl = constructFileUrl(publication.fileId);
                const response = await fetch(fileUrl);
                const arrayBuffer = await response.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                setpublications((prevPublications) =>
                  prevPublications.map((pub) =>
                    pub.fileId === publication.fileId
                      ? { ...pub, extractedText: result.value.slice(0,255)+" . . . " }
                      : pub
                  )
                );
              }
            }
          } catch (error) {
            console.error("Error reading file:", error);
          }
        };
        handleExtractedData();
      }, [publications]);

      const handleCiteModal = (pub_Id: string)=>{
        UpdateCiteCount(pub_Id)
        Setactive(pub_Id)
      }
      const handleClose = ()=>{
        Setactive(null)
      }
      
  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 md:p-8">
      <h1 className="mb-6 text-center text-xl font-semibold sm:text-2xl md:text-left">
        Publications
      </h1>
      <ul className="space-y-6">
        {publications ? (
          publications.map((pub, index) => (
            <li
              key={index}
              className="flex flex-col border-b pb-6 last:border-none lg:flex-row lg:items-start lg:space-x-4"
            >
              <div className="flex-1">
                <h2 className="hover:underline sm:text-lg text-blue-600 text-base font-medium">
                  {pub.$id ? (
                    <a href={`/publication/${pub.$id}`} target="_blank" rel="noopener noreferrer">
                      {pub.title}
                    </a>
                  ) : (
                    pub.title
                  )}
                </h2>

                <p className="text-sm text-gray-600 mb-1">
                  Athour: {pub.owner.fullName}{' '}
                  <span className="block md:inline px-6">
                    {' '}
                    Created At: {new Date(pub.$createdAt).toLocaleDateString()}
                  </span>
                </p>

                {pub.description && (
                  <Link href={`/publication/${pub.$id}`}>
                    <p className="hover:cursor-pointer mb-2 text-sm max-w-[800px] text-gray-700">
                      {pub.description} {pub.extractedText}
                    </p>
                  </Link>
                )}

                {
                        active && (<CiteModal handleClose={handleClose} pub_Id={active} />)
                }

                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500  ">
                  <span className="cursor-pointer hover:underline font-bold">
                    Save
                  </span>

                  <span onClick={()=>handleCiteModal(pub.$id)} className="cursor-pointer hover:underline font-bold">
                    {' '}
                    <TextAlignCenterIcon className="inline font-bold text-4xl" />{' '}
                    Cite
                  </span>
                  {
                    <span className="hover:underline font-bold">
                      Cited by {pub.citationCount}
                    </span>
                  }
                  {
                    <a
                      href={''}
                      className="hover:underline text-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Related articles
                    </a>
                  }
                </div>
              </div>
              {
                <div className="mt-4 lg:mt-0 lg:ml-auto">
                {currentUser ? (
                  <a
                    href={constructDownloadUrl(pub.fileId)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="destructive"
                      className="text-sm text-white bg-rose-400 hover:bg-rose-500 px-4 py-1 rounded shadow-md w-full md:w-auto"
                    >
                      Download
                    </Button>
                  </a>
                ) : (
                  <Link href="/sign-in">
                    <Button
                      variant="destructive"
                      className="text-sm text-white bg-rose-400 hover:bg-rose-500 px-4 py-1 rounded shadow-md w-full md:w-auto"
                    >
                      Download
                    </Button>
                  </Link>
                )}
              </div>
              }
            </li>
          ))
        ) : (
          <div>
            <h1>No publications found</h1>
          </div>
        )}
      </ul>
    </div>
  );
};

export default PublicationList;
