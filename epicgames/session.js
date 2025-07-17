import { Agent, fetch as undiciFetch } from "undici";

const agent = new Agent({
    keepAliveTimeout: 10000,
    keepAliveMaxTimeout: 15000,
});

export function sessionFetch(url, options = {}) {
    options.dispatcher = agent;
    
    return undiciFetch(url, options);
};