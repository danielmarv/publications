"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

const MyProfilePage = () => {
  const [user, setUser] = useState<any>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser();

        setUser(fetchedUser);
      } catch (error) {
        console.error("No active session", error);
      }
    };

    fetchUser();
  }, []);
//   const firstfile= user.files[0]

  // Render the profile page
  return (
    <div className="bg-white shadow rounded-lg p-6 bg-gray-400">
      {user ? (
            
        <div className="md:flex flex flex-col ">
            <div className=' flex  mb-5 gap-[40%]'>
                  <div className='flex flex-col'>
                  <Image
                        src={user.avatar || "/default-avatar.png"} // Fallback for avatar
                        alt={`${user.fullName}'s avatar`}
                        width={128}
                        height={128}
                        className=" flex rounded-full hover:cursor-pointer"
                  />
                  <button className='flex font-bold bg-red rounded-lg px-3 ml-5 my-4 cursor-pointer'> Update</button>
                  </div>

                  <div className='flex  flex-col gap-4 mx-3'>
                        <h1 className=' flex font-semibold mx-auto'> your Files</h1>
                        <div className='flex'>
                        {user. files.map((file: { $id: React.Key | null | undefined; url: string | StaticImport; name: string; }) => (
                        <div key={file.$id} className=" flex file-details">
                              
                              {/* <h3>{file.name}</h3> */}
                              {/* <p>Type: {file.type}</p> */}
                              {/* <p>Size: {file.size} bytes</p> */}
                              {/* <p>Created At: {new Date(file.$createdAt).toLocaleString()}</p> */}
                              
                              <Image
                        src={file.url } // Fallback for avatar
                        alt={file.name}
                        width={100}
                        height={100}
                        className=" flex rounded-lg mx-2  my-1 hover:cursor-pointer"
                         />                              
                        </div>
                        ))}
                        </div>
                        

                  </div>
                  
                  
            </div>
          <h2 className="mt-4 mb-3 text-xl font-semibold text-gray-900">{user.fullName.toUpperCase()}</h2>
          <p className="text-gray-900">{user.email}</p>
         
  
          {/* <p className="mt-2 text-sm text-gray-500">{firstfile.name}</p> */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Department</dt>
                <div className="mt-1 text-sm text-gray-900">{user.department || "N/A"}</div>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.role ? (
                    <a href={user.website} className="text-blue-600 hover:underline">
                      {user.role.toUpperCase()}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Joined</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {user.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : "N/A"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default MyProfilePage;
