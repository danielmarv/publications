'use client';

import React, { useState } from "react";
import { subscribeToNews, subscribeToUpdates, subscribeToNotifications, subscribeToBugemaPublications } from "@/app/api/topics/route";
import { Button } from "@/components/ui/button";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("news");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    setLoading(true);
    setMessage("");
    

    try {
      let response;
      switch (topic) {
        case "news":
          response = await subscribeToNews(email);
          break;
        case "updates":
          response = await subscribeToUpdates(email);
          break;
        case "notifications":
          response = await subscribeToNotifications(email);
          break;
        case "bugema":
          response = await subscribeToBugemaPublications(email);
          break;
        default:
          throw new Error("Invalid topic selection.");
      }

      setMessage(`Successfully subscribed to ${topic}. Check your inbox for confirmation.`);
      console.log("Subscription response:", response);
    } catch (error) {
      console.error("Subscription error:", error);
      setMessage("Error subscribing to the topic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Subscribe to a Topic</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg p-2 w-full"
          required
        />
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="border rounded-lg p-2 w-full"
        >
          <option value="news">News</option>
          <option value="updates">Updates</option>
          <option value="notifications">Notifications</option>
          <option value="bugema">Bugema University Publication</option>
        </select>
        <Button
          type="submit"
          variant="destructive"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
};

export default NewsletterSubscription;
