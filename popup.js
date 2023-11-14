document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('get-email-content').addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "getEmailId"}, function(response) {
              if (response && !response.error) {
                  // Now fetch the email content using the email ID
                  chrome.runtime.sendMessage({action: "fetchEmailContent", emailId: response.emailId}, function(response) {
                      if (response && !response.error) {
                          document.getElementById('email-content').value = response.emailContent; // Display the email content
                      } else {
                          document.getElementById('email-content').value = `Error: ${response.error}`;
                      }
                  });
              } else {
                  document.getElementById('email-content').value = `Error: ${response.error}`;
              }
          });
      });
  });

  
    // Get the 'Generate AI Reply' button and set up a click event listener
    document.getElementById('generate-reply').addEventListener('click', function() {
      const userSuggestion = document.getElementById('user-suggestion').value;
      // TODO: Implement the generateAiResponse function or replace with your logic
      generateAiResponse(userSuggestion).then(aiResponse => {
        document.getElementById('ai-generated-reply').value = aiResponse;
      }).catch(error => {
        console.error('Error generating AI response:', error);
        document.getElementById('ai-generated-reply').value = `Error: ${error.message}`;
      });
    });
  });
  
  // TODO: Define the generateAiResponse function or your actual logic for AI response generation
  function generateAiResponse(userInput) {
    // Mock response, replace with actual API call or logic to get AI-generated reply
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (userInput.trim() === '') {
          reject(new Error('No suggestion provided'));
        } else {
          resolve(`AI reply based on suggestion: ${userInput}`);
        }
      }, 1000);
    });
  }
  