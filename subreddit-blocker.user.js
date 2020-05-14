// ==UserScript==
// @name           Subreddit blocker
// @description    Hide selected subreddits from r/all
// @author         Jonatino
// @include        *reddit.com/*
// @version        1.0
// @run-at document-start
// ==/UserScript==

const blocked = [
    "sandersforpresident",
    "politics",
    "worldpolitics",
    "TrumpCriticizesTrump",
    "coronavirus",
    "The_Mueller",
    "ourpresident",
    "ABoringDystopia",
    "politicalhumor",
    "blackpeopletwitter",
    "whitepeopletwitter",
].map((value) => value.toLowerCase());

const blockElements = (parentElement) => {
    for (const subredditElement of parentElement.querySelectorAll('a[data-click-id="body"]')) {
        const subreddit = subredditElement.href.replace("https://www.reddit.com/r/", "").split("/")[0].toLowerCase();
        if (blocked.indexOf(subreddit) > -1) {
            subredditElement.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
            console.log("[Subreddit Blocker] Hiding r/", subreddit);
        }
    }
}

// Check if we're at /r/all already to start blocking elements
const isAll = (url) => url.includes("/r/all");

let lastUrl = window.location.href;
let all = isAll(lastUrl);

// Block elements that are already rendered
if (all) {
    blockElements(document.documentElement);
}

// Block future elements that are not yet rendered
new MutationObserver((mutations) => {
    const currentUrl = window.location.href;

    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        all = isAll(lastUrl);
    }

    if (all) {
        mutations.forEach((mutation) => {
            for (const newElement of mutation.addedNodes) {
                if (newElement.querySelectorAll) {
                    blockElements(newElement);
                }
            }
        });
    }
}).observe(document.documentElement, {
    childList: true,
    subtree: true
});
