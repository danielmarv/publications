import React from "react";
import NewsletterSubscription from "../_components/Newsletter";
import { getCurrentUser } from "@/lib/actions/user.actions";

const HomePage = async () => {
  const currentUser = await  getCurrentUser();
  
  return (
    <div>
      {currentUser ? (
        <NewsletterSubscription />
      ) : (
        <p>Please log in to subscribe to our newsletter.</p>
      )}
      <h2 className="text-xl font-semibold">Welcome to My App</h2>
      <p>This is the homepage content.</p>
      </div>
  );
};

export default HomePage;
