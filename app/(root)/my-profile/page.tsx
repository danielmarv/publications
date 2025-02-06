"use client"
import React, { useEffect, useState,useRef } from 'react';
import Image from 'next/image';
import { getCurrentUser, updateUserData } from '@/lib/actions/user.actions';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import {updateProfile} from '@/lib/actions/user.actions';
import { Grid } from 'react-loader-spinner'
import {FaEdit} from 'react-icons/fa'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';

const MyProfilePage = () => {
  // State to store user data
  const [user, setUser] = useState<any>(null);
  const [loading, setloading] = useState(false);
  const[Showform, setShowform] = useState(false)
  const [IsEditting, setIsEditing] = useState(false)

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getCurrentUser(); // Fetch the current user session
        console.log(fetchedUser)
        
        setUser(fetchedUser); // Update state with user data
      } catch (error) {
        console.error("No active session", error);
      } 
    };

    fetchUser();
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

 

  const handleFileChange =async (e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLFormElement>,
      updateType: 'file' | 'data') => {
            
    if (updateType === 'file' && e.target instanceof HTMLInputElement) {
      const file = e.target.files?.[0]
      setloading(true) 
      console.log(file)
      await updateProfile(file) 
      setTimeout(() => {
            window.location.reload(); // Reload after 2 seconds
          }, 7000);
      // setloading(false)
     } 
}
const handleFormData=(e: React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault(); // Prevent default form submission behavior
const formData = new FormData(e.currentTarget); // Extract form data
// Convert FormData to an object (optional)
const data = Object.fromEntries(formData.entries());
console.log("Form Data: ", data)
updateUserData(data) 
setIsEditing(false)
setTimeout(() => {
      window.location.reload(); // Reload after 2 seconds
    }, 2000);

}

      const handleForm = () =>{
            // setShowform((prevState)=>!prevState)
            setIsEditing((prevState)=>!prevState)
      }
      // You can add your image upload logic here
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e, 'file')}
        accept="image/*"
        style={{ display: 'none' }}
      />
      {user ? (
            
        <div className="md:flex flex flex-col ">
            <div className=' flex  mb-5 gap-[40%]'>
                  <div className='flex flex-col'>
                  <Image
                  key={user.avatar}
                        src={user.avatar || "/default-avatar.png"} // Fallback for avatar
                        alt={`${user.fullName}'s avatar`}
                        width={138}
                        height={128}
                        className=" flex rounded-full "
                  />
                  <button onClick={handleButtonClick}  className='flex font-bold bg-red rounded-lg px-3 ml-5 my-4 cursor-pointer'> Update</button>
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
                        className=" flex rounded-lg mx-2  my-1 "
                         />                              
                        </div>
                        ))}
                        </div>
                        

                  </div>
                  
                  
            </div>
            {loading && <><Grid
                                visible={true}
                                height="80"
                                width="80"
                                color="#4fa94d"
                                ariaLabel="grid-loading"
                                radius="12.5"
                                wrapperStyle={{}}
                                wrapperClass="grid-wrapper" /></>}

          <h2 className="mt-4 mb-3 text-xl font-semibold text-gray-900">{user.fullName.toUpperCase()}  </h2>
          
          <p className="text-gray-900">{user.email}  <FaEdit onClick={handleForm} className='inline text-xl hover:cursor-pointer'/></p>
          {/* <Label htmlFor="email">Email</Label> */}
              
              {Showform &&(<>
                  <Input className='w-60'
                  type="email"
                  id="email"
                  name="email"
                  required
                />
                <button onClick={handleButtonClick}   className=' w-20 flex font-bold bg-red rounded-lg px-3 ml-5 my-4 cursor-pointer'> Update</button>
                </>
              )}

<div className="flex-1">
          {IsEditting ? (
            <form onSubmit={handleFormData} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" defaultValue={user.fullName.toUpperCase()} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={user.email} required />
              </div>
              <div className="flex gap-2">
                <Button type="submit"    disabled={loading}>Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <>
              {/* <h2 className="text-2xl font-bold">{user.fullName}</h2>
              <p className="text-gray-600">{user.email}</p> */}
              <Button onClick={() => setIsEditing(true)} className="mt-2">Edit Profile</Button>
            </>
          )}
        </div>
  
          {/* <p className="mt-2 text-sm text-gray-500">{firstfile.name}</p> */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Department</dt>
                {user.department ? (
                <div className="mt-1 text-sm text-gray-900">{user.department.department || "N/A"}</div>
                ):(
                  <div className="mt-1 text-sm text-gray-900">{ "N/A"}</div>
                )
                  }
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
