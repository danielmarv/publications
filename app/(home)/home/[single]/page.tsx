import React from 'react'
import { publications } from '@/data/publications';
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
    
const SinglePost = () => {
      async function GET(request: Request, {params}:{params: {data: string}}) {
            const { data } =  await params;
            const publication = publications.find(publication => publication.title === data)
            return Response.json(publication);
      }
  return (
    <div>
            <div className='flex gap-[30%]'>
                  <div className='flex flex-col gap-3 ml-[5%]'>
                        <h1 className='flex text-4xl font-bold'>SinglePost Title</h1>
                        <div className='flex '>
                         <h1 className='text-2xl ' style={{ fontFamily: "Times New Roman, Times, serif" }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi natus praesen
                              tium magni optio? Voluptas perferendis soluta distinctio ad qui natus sequi, earum veritatis numquam impedit tempor
                              a, sunt laudantium obcaecati mollitia! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, voluptate! Enim in voluptate, repellat reprehenderit
                            obcaecati molestiae ipsam rerum harum corporis veritatis at maxime repellendus, dolores officiis officia. 
                            </h1>
                        </div>
                  </div>
                  
                  <div className='flex'>
                  <h1 className='flex text-4xl'>Related Articles</h1>
                  </div>
            </div>
      </div>
  )
}

export default SinglePost