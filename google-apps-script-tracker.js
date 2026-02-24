// The doPost function handles POST requests triggered from your Next.js application.
// This should be attached to a Google Sheet (Extensions -> Apps Script).
function doPost(e) {
    try {
        // 1. Get the active spreadsheet and append the row.
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var data = JSON.parse(e.postData.contents);

        // Create an array matching your sheet's columns.
        // **IMPORTANT:** Add a new column title in your Sheet for "Template"
        // Example order: Date, Name, Email, Phone, LinkedIn, Template, Is Authenticated
        var rowData = [
            new Date(),
            data.name,
            data.email,
            "'" + (data.phone || ""), // Adding a single quote forces Sheets to treat it as a pure string, preventing formula errors
            data.linkedin,
            data.template || "N/A",
            data.isLoggedIn ? "Yes" : "No"
        ];

        sheet.appendRow(rowData);

        // 2. Email notification to yourself (admin).
        var adminEmail = "createfreecv@gmail.com";
        var adminSubject = "New Resume Download on CreateFreeCV";
        var adminBody = "A user has downloaded a resume.\n\n" +
            "Name: " + (data.name || "N/A") + "\n" +
            "Email: " + (data.email || "N/A") + "\n" +
            "Phone: " + (data.phone || "N/A") + "\n" +
            "LinkedIn: " + (data.linkedin || "N/A") + "\n" +
            "Template: " + (data.template || "N/A") + "\n\n" +
            "Logged In: " + (data.isLoggedIn ? "Yes" : "No");

        MailApp.sendEmail({
            to: adminEmail,
            subject: adminSubject,
            body: adminBody
        });

        // 3. Email notification to the user (if they are logged in).
        if (data.isLoggedIn && data.email) {
            sendUserThankYouEmail(data.name, data.email);
        }

        // Return a success JSON response to the caller.
        return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // Return an error JSON response to the caller.
        return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Function to send a nicely formatted HTML email asking for feedback
function sendUserThankYouEmail(userName, userEmail) {
    var subject = "Thank you for using CreateFreeCV! 🎉";

    var firstName = userName ? userName.split(' ')[0] : "there";

    var htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #2e7d32; text-align: center;">Your Resume is Ready!</h2>
      <p>Hi ${firstName},</p>
      
      <p>Thank you so much for using <b>CreateFreeCV</b> to build your resume! We built this platform to help professionals like you put their best foot forward without the hassle or high costs.</p>
      
      <p>We're thrilled that you chose us to create your resume today. As a growing platform, your experience means the world to us.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #1565c0;">We'd Love Your Feedback 💡</h3>
        <p style="margin-bottom: 0;">If you have a quick minute, we would love to hear your thoughts. Did you encounter any issues? Is there a feature you'd love to see added? Just reply directly to this email – we read every single message!</p>
      </div>

      <p>We wish you the absolute best in your career journey and job search. You've got this! 🚀</p>
      
      <p>Warmest regards,<br>
      <b>The CreateFreeCV Team</b><br>
      <a href="https://createfreecv.com" style="color: #2e7d32;">createfreecv.com</a></p>
    </div>
  `;

    // Fallback plain text version for clients that don't render HTML well.
    var plainBody = "Hi " + firstName + ",\n\n" +
        "Thank you so much for using CreateFreeCV to build your resume! We built this platform to help professionals like you put their best foot forward.\n\n" +
        "We'd Love Your Feedback!\n" +
        "If you have a quick minute, we would love to hear your thoughts. Did you encounter any issues? Is there a feature you'd love to see added? Just reply directly to this email – we read every single message!\n\n" +
        "We wish you the absolute best in your career journey and job search. You've got this! 🚀\n\n" +
        "Warmest regards,\n" +
        "The CreateFreeCV Team\n" +
        "https://createfreecv.com";

    MailApp.sendEmail({
        to: userEmail,
        subject: subject,
        body: plainBody,
        htmlBody: htmlBody,
        name: "CreateFreeCV Team" // Shows nicely as the sender name
    });
}
