// Importing a function from utils.js
import { getActiveTabURL } from "./utils.js";

// Function to add a new bookmark
const addNewBookmark = (bookmarks, bookmark) => {
 // Creating new elements
 const bookmarkTitleElement = document.createElement("div");
 const controlsElement = document.createElement("div");
 const newBookmarkElement = document.createElement("div");

 // Setting text and class for bookmarkTitleElement
 bookmarkTitleElement.textContent = bookmark.desc;
 bookmarkTitleElement.className = "bookmark-title";

 // Setting class for controlsElement
 controlsElement.className = "bookmark-controls";

 // Setting attributes for controlsElement
 setBookmarkAttributes("play", onPlay, controlsElement);
 setBookmarkAttributes("delete", onDelete, controlsElement);

 // Setting id, class, and attribute for newBookmarkElement
 newBookmarkElement.id = "bookmark-" + bookmark.time;
 newBookmarkElement.className = "bookmark";
 newBookmarkElement.setAttribute("timestamp", bookmark.time);

 // Appending elements to newBookmarkElement
 newBookmarkElement.appendChild(bookmarkTitleElement);
 newBookmarkElement.appendChild(controlsElement);

 // Appending newBookmarkElement to bookmarks
 bookmarks.appendChild(newBookmarkElement);
};

// Function to view bookmarks
const viewBookmarks = (currentBookmarks=[]) => {
 // Getting bookmarks element
 const bookmarksElement = document.getElementById("bookmarks");
 bookmarksElement.innerHTML = "";

 // Checking if there are any bookmarks
 if (currentBookmarks.length > 0) {
   // Looping through each bookmark and adding it
   for (let i = 0; i < currentBookmarks.length; i++) {
     const bookmark = currentBookmarks[i];
     addNewBookmark(bookmarksElement, bookmark);
   }
 } else {
   // If there are no bookmarks, display a message
   bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
 }

 return;
};

// Function to play a bookmark
const onPlay = async e => {
 // Getting bookmark time
 const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
 // Getting active tab
 const activeTab = await getActiveTabURL();

 // Sending a message to the active tab
 chrome.tabs.sendMessage(activeTab.id, {
   type: "PLAY",
   value: bookmarkTime,
 });
};

// Function to delete a bookmark
const onDelete = async e => {
 // Getting active tab
 const activeTab = await getActiveTabURL();
 // Getting bookmark time
 const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
 // Getting bookmark element to delete
 const bookmarkElementToDelete = document.getElementById(
   "bookmark-" + bookmarkTime
 );

 // Removing bookmark element
 bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

 // Sending a message to the active tab
 chrome.tabs.sendMessage(activeTab.id, {
   type: "DELETE",
   value: bookmarkTime,
 }, viewBookmarks);
};

// Function to set bookmark attributes
const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
 // Creating a new control element
 const controlElement = document.createElement("img");

 // Setting src, title, and event listener for controlElement
 controlElement.src = "assets/" + src + ".png";
 controlElement.title = src;
 controlElement.addEventListener("click", eventListener);

 // Appending controlElement to controlParentElement
 controlParentElement.appendChild(controlElement);
};

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", async () => {
 // Getting active tab
 const activeTab = await getActiveTabURL();
 // Getting query parameters from active tab URL
 const queryParameters = activeTab.url.split("?")[1];
 const urlParameters = new URLSearchParams(queryParameters);

 // Getting current video from query parameters
 const currentVideo = urlParameters.get("v");

 // Checking if active tab URL includes "youtube.com/watch" and currentVideo is not null
 if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
   // Getting current video bookmarks from chrome storage
   chrome.storage.sync.get([currentVideo], (data) => {
     const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];

     // Viewing bookmarks
     viewBookmarks(currentVideoBookmarks);
   });
 } else {
   // If active tab URL does not include "youtube.com/watch" or currentVideo is null, display a message
   const container = document.getElementsByClassName("container")[0];
   container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
 }
});
