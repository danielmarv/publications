"use client"
import React, { use, useEffect, useState } from 'react'
import { GetPublicationById } from '@/lib/actions/pubs.actions';
import { constructFileUrl } from '@/lib/utils';
import mammoth from 'mammoth';
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
interface PageProps {
        params: Promise<{ id: string }>
      }
    
const SinglePost =  ({ params }: PageProps) => {
        const [publication, setpublication] = useState<Publication[]>([]);
        const { id } = use(params); // Extract the job ID from params
        // console.log("Publication Id ",id)
          useEffect(() => {
            if (!id) {
              console.warn("pub_Id is undefined. Skipping fetch.");
              return;
            }
        
            const fetchPublication = async () => {
              try {
                const result = await GetPublicationById(id);
                // console.log("Publication id ",id)
                // console.log("Publication id ",result)
                setpublication(result);
        
              } catch (error) {
                console.error("Error fetching publication:", error);
              }
            };
        
            fetchPublication();
          }, [id]);

          useEffect(() => {
                const handleExtractedData = async () => {
                  try {
                   
                      if (publication.fileId) {
                        const fileUrl = constructFileUrl(publication.fileId);
                        const response = await fetch(fileUrl);
                        const arrayBuffer = await response.arrayBuffer();
                        const result = await mammoth.extractRawText({ arrayBuffer });
                        console.log("extraxted text is : ", result.value);
                        setpublication((prevPublication) =>({
                                ...prevPublication,
                                 extractedText: result.value}//.slice(0,255)+" . . . " }
                                ));
                        console.log("extraxted text is : ",result.value); 
                      }
                    
                  } catch (error) {
                    console.log("Error reading file:", error);
                  }
                };
                handleExtractedData();
              }, [publication]);
  return (
        <>
        {publication? (
                <div className='flex overflow-wrap text-wrap flex-col  mx-[5%] '>
                
                  <div>
                    <div className='flex gap-12'>
                        <div>
                        <h1 className='flex text-4xl font-bold'>{publication.title}</h1>
                        </div>

                        <div>
                        <h1 className='flex '> By: {publication.owner?.fullName}</h1>
                        </div>
                
                    </div>
                    <div className='flex overflow-wrap  '>
                      <article className='text-wrap' style={{ fontFamily: "Times New Roman, Times, serif" }}>
                        {publication.extractedText}
                      </article>
                    </div>
                  </div>
          </div>
     
                
        ):( <div>Loading...</div>)}
        </>
    
  )
}

export default SinglePost