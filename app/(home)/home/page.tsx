import React from 'react';
// import NewsletterSubscription from '../_components/Newsletter';
// import { getCurrentUser } from '@/lib/actions/user.actions';
import PublicationList from '@/components/List';
// import { publications } from "@/data/publications";

const HomePage = async () => {
  // const currentUser = await getCurrentUser();

  return (
    <div className="w-full px-5">
      <PublicationList  />
      
      {/* {currentUser  === undefined ? (
        <p>Loading...</p>
      ) : currentUser  ? (
        <NewsletterSubscription />
      ) : (
        <p>Please log in to subscribe to our newsletter.</p>
      )} */}
    </div>
  );
};

export default HomePage;
