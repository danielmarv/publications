import React from 'react';
import NewsletterSubscription from '../_components/Newsletter';
import { getCurrentUser } from '@/lib/actions/user.actions';

const HomePage = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="w-full px-5">
      <h2 className="text-xl font-semibold">Home Page</h2>
      <p>This is the homepage content.</p>
      
      {currentUser  === undefined ? (
        <p>Loading...</p>
      ) : currentUser  ? (
        <NewsletterSubscription />
      ) : (
        <p>Please log in to subscribe to our newsletter.</p>
      )}
    </div>
  );
};

export default HomePage;
