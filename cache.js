/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

console.log("Cache Manager Loaded.");

var Cache = {
    // fetches the resource from the cache, and returns a Response.
    fetch: (cache_name, resource_name, default_json) => {
        return caches.open(cache_name)
            .then((cache) => {
                console.log(`[cache] Looking for ${resource_name} in the ${cache_name} cache...`);
                return cache.match(new Request(resource_name));
            });
    },

    // fetches the resources from the cache, and returns a JSON value or a default if the cache
    // can't provide this entry.
    fetch_json: (cache_name, resource_name, default_json) => {
        console.log(`[cache] fetching_json ${resource_name} from ${cache_name} with default ${JSON.stringify(default_json)}`);
        if (default_json) {
            return caches.open(cache_name)
                .then((cache) => {
                    console.log(`[cache] Looking for ${resource_name} in the ${cache_name} cache...`);
                    return cache.match(new Request(resource_name))
                        .then((result) => {
                            if (result != null) {
                                console.log(`[cache] got result ${result}`);
                                return result.json()
                                    .then((json) => { return json; });
                            }
                            return default_json;
                        });
                });
        }
    },

    // Add a file to the cache, with arbitrary metadata.
    add: (cache_name, resource_name, file, meta_data) => {
        console.log(`[cache] adding ${resource_name} with ${JSON.stringify(meta_data)}`);
        return caches.open(cache_name)
            .then((cache) => {
                let request = new Request(resource_name, {
                    headers: {
                        "Content-Type": file.type
                    }
                });
                return cache.put(request, new Response(file))
                    .then(() => {
                        // Add this file's metadata to the global list.
                        return Cache.update("metadata", "/api/v1/metadata/all", (content) => {
                            if (!content || !Array.isArray(content)) {
                                content = [];
                            }
                            content.push(meta_data);
                            return Promise.resolve(content);
                        });
                    });
            });
    },

    // Updates a JSON cached entry, passing the current value to the closure.
    // The closure is expected to return a promise resolving to the new value.
    update: (cache_name, resource_name, closure) => {
        console.log(`[cache] updating ${resource_name} in ${cache_name}`);
        return caches.open(cache_name)
            .then((cache) => {
                return cache.match(new Request(resource_name))
                    .then((content) => { return content.json(); }).then((json) => {
                        return { cache, content: json };
                    })
                    .catch(() => { return { cache, content: [] }; });
            })
            .then((arg) => {
                return closure(arg.content).then((cres) => {
                    return { cache: arg.cache, new_content: cres };
                });
            })
            .then((arg) => {
                let request = new Request(resource_name);
                let response = new Response(JSON.stringify(arg.new_content), { headers: { "Content-Type": "application/json" } });
                return arg.cache.put(request, response);
            });
    }
}