/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

importScripts("./cache.js");

this.addEventListener("install", function (event) {
    console.log("[sw] Service Worker Installed.");
});

this.addEventListener("fetch", function (event) {
    console.log(`[sw] fetching ${event.request.url}`);

    // Make sure we only look for our file urls in the cache.
    let url = new URL(event.request.url);
    if (!url.pathname.startsWith("/api/v1/")) {
        console.error(`[sw] not intercepting ${url.pathname}`);
        return;
    }

    if (url.pathname.startsWith("/api/v1/fs")) {
        event.respondWith(Cache.fetch("files", event.request.url));
    } else if (url.pathname.startsWith("/api/v1/metadata")) {
        event.respondWith(Promise.resolve(Cache.fetch_json("metadata", event.request.url, []))
            .then((json) => {
               return new Response(JSON.stringify(json), { headers: {"Content-Type": "application/json"} });
            }));
    }
    
});
