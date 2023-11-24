// Listen for any updates to the tabs
chrome.tabs.onUpdated.addListener((tabId, tab) => {
    // Check if the updated tab's URL includes "youtube.com/watch"
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      // Split the URL at the "?" character to get the query parameters
      const queryParameters = tab.url.split("?")[1];
      // Create a new URLSearchParams object with the query parameters
      const urlParameters = new URLSearchParams(queryParameters);
   
      // Send a message to the tab with the type "NEW" and the video ID
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId: urlParameters.get("v"),
      });
    }
   });
   