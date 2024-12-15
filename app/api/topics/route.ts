"use server";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { console } from "inspector";

// Function to fetch user targets (email and phone)
export const fetchUserTargets = async () => {
    const { account } = await createSessionClient();
    try {
        const user = await account.get();
        const targets = user.targets;
        const target = targets.find(t => t.providerType === 'email');
        console.log('Fetched user targets:', target);
        return target;
    } catch (error) {
        console.error('Error fetching user targets:', error);
        throw new Error('Could not fetch user targets.');
    }
};

// Subscribe to a topic
export const subscribeToNews = async (userEmail: string) => {
    return await subscribeUserToTopic(appwriteConfig.newsID, userEmail, 'News');
};

export const subscribeToUpdates = async (userEmail: string) => {
    return await subscribeUserToTopic(appwriteConfig.updatesID, userEmail, 'Updates');
};

export const subscribeToNotifications = async (userEmail: string) => {
    return await subscribeUserToTopic(appwriteConfig.notificationID, userEmail, 'Notifications');
};

export const subscribeToBugemaPublications = async (userEmail: string) => {
    return await subscribeUserToTopic(appwriteConfig.mainID, userEmail, 'Bugema University Publication');
};

const subscribeUserToTopic = async (topicId: string, userEmail: string, topicName: string) => {
    const targets = await fetchUserTargets();

    if (!targets || !targets.$id) {
        throw new Error('User targets not found.');
    }
    
    const targetId = targets.$id;
    console.log('User targetId:', targetId); // Debugging

    try {
        const { email } = await createAdminClient();
        
        // Create subscriber
        const subscriber = await email.createSubscriber(
            topicId,
            userEmail,
            targetId
        );
        
        if (!subscriber) {
            throw new Error('Could not subscribe user to topic.');
        }
        console.log('Subscriber created successfully:', subscriber);
        
        // Send confirmation email
        const emailResult = await email.createEmail(
            userEmail,
            `Subscription to ${topicName} Successful`,
            `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                }
                .email-container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background: #fff;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #333;
                }
                p {
                  color: #555;
                  line-height: 1.6;
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <h1>Subscription to ${topicName} Successful</h1>
                <p>Hello,</p>
                <p>Thank you for subscribing to the topic: <strong>${topicName}</strong>.</p>
                <p>You will now receive updates and notifications related to this topic directly in your inbox.</p>
                <p>Best regards,<br>Your Team</p>
              </div>
            </body>
            </html>
            `
        );

        console.log(`Email sent for ${topicName} subscription:`, emailResult);

    } catch (error) {
        console.error(`Error subscribing user to ${topicName}:`, error);
        throw error;
    }
};
