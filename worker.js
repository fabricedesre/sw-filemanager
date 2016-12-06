/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

importScripts("./cache.js");

console.log("[worker] Worker Started");

onmessage = (event) => {
    let file = event.data;
    console.log(`[worker] adding ${file.name} ${file.type} ${file.size}`);
    let name = "/api/v1/fs/" + file.name;
    let url = new URL(name, location);
    let meta_data = { name: file.name, type: file.type, size: file.size, url: url.href };
    // Add the file to the cache. The cache also takes care of maintaining the meta data.
    try {
    Cache.add("files", name, file, meta_data)
        .then(() => {
            // Notify the UI thread that we successfully added a new file.
            self.postMessage(meta_data);
        });
    } catch(e) { console.error(e); }
}