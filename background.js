function fetchEmailContent(token, emailId) {
  const url = `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}`;
  return new Promise((resolve, reject) => {
      fetch(url, {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok.'))
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchEmailContent" && request.emailId) {
      chrome.identity.getAuthToken({interactive: true}, (token) => {
          if (token) {
              fetchEmailContent(token, request.emailId)
              .then(emailContent => sendResponse({emailContent: emailContent}))
              .catch(error => sendResponse({error: error.message}));
          } else {
              sendResponse({error: chrome.runtime.lastError.message});
          }
      });
      return true; // Keep the message channel open for the response
  }
});

// Utility function to decode the body of an email
function getBody(payload) {
  let encodedBody = '';
  if (payload.parts === undefined) {
      encodedBody = payload.body.data;
  } else {
      encodedBody = getPlainTextPart(payload.parts);
  }
  encodedBody = encodedBody.replace(/-/g, '+').replace(/_/g, '/');
  return decodeURIComponent(escape(window.atob(encodedBody)));
}

// Utility function to find the 'text/plain' part in a multipart email
function getPlainTextPart(parts) {
  for (let part of parts) {
      if (part.mimeType === 'text/plain') {
          return part.body.data;
      } else if (part.parts && part.parts.length) {
          return getPlainTextPart(part.parts);
      }
  }
  return '';
}
