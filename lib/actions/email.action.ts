import { createAdminClient } from "@/lib/appwrite";
import { fetchPublication } from "@/app/api/doi/route";
import { getUserByEmail } from "@/lib/actions/user.actions";

export const sendPublicationEmail = async (publicationId: string) => {
  try {
    const { email } = await createAdminClient();
    const publication = await fetchPublication(publicationId);
    if (!publication) throw new Error("Publication not found");
    
    const user = await getUserByEmail(publication.ownerId);
    if (!user || !user.email) throw new Error("User not found");

    const userEmail = user.email;
    const publicationTitle = publication.title;
    const publicationUrl = publication.url; 
    
    const emailBody = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Publication Approved</title>
          <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                color: #333;
                margin: 0;
                padding: 0;
            }

            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }

            .email-header {
                background-color: #007BFF; /* Blue background for header */
                color: #fff;
                padding: 20px;
                text-align: center;
            }

            .email-header h1 {
                margin: 0;
                font-size: 24px;
            }

            .email-content {
                padding: 20px;
            }

            .email-content p {
                margin-bottom: 15px;
                line-height: 1.5;
            }

            .email-content a {
                color: #007BFF;
                text-decoration: none;
            }

            .email-content a:hover {
                text-decoration: underline;
            }

            .email-footer {
                background-color: #f1f1f1;
                color: #666;
                padding: 10px;
                text-align: center;
            }

            .email-footer a {
                color: #007BFF;
                text-decoration: none;
            }

            .email-footer a:hover {
                text-decoration: underline;
            }

          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Publication Approved</h1>
            </div>
            <div class="email-content">
              <p>Dear ${user.name},</p>
              <p>We are pleased to inform you that your publication titled "<strong>${publicationTitle}</strong>" has been approved.</p>
              <p>You can view your publication here: <a href="${publicationUrl}">View Publication</a></p>
              <p>Thank you for contributing to our platform.</p>
              <p>Best regards,</p>
              <p>The Bugema University Publication Team</p>
            </div>
            <div class="email-footer">
              <p>&copy; 2025 Bugema University. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await email.createEmail(
      userEmail,
      "Publication Approved",
      emailBody,
      ["text/html"]
    );

    return result;
  } catch (error) {
    console.error("Error sending email", error);
    return null;
  }
};
