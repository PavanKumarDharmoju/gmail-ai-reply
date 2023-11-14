function extractEmailId() {
  const matches = window.location.href.match(/#\/?[^\/]+\/([a-zA-Z0-9]+)/);
  return matches ? matches[1] : null;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getEmailId") {
      const emailId = extractEmailId();
      if (emailId) {
          sendResponse({ emailId: emailId });
      } else {
          sendResponse({ error: "Email ID not found." });
      }
  }
});
