// Exporting an asynchronous function to get the URL of the active tab
export async function getActiveTabURL() {
    // Querying the Chrome tabs API to get the current active tab in the current window
    const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true
    });
   
    // Returning the first tab in the tabs array
    return tabs[0];
   }
   