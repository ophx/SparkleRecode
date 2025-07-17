import { sessionFetch } from "./session.js";

export async function getServerStatus() {
    const res = await sessionFetch("https://status.epicgames.com/api/v2/summary.json");
  
    if (!res.ok) {
        return `Error sessionFetching epic games status (${res.status})`;
    }
  
    const data = await res.json();

    const pageName = data.page?.name || "N/A";
    const pageUrl = data.page?.url || "N/A";
    const lastUpdatedRaw = data.page?.updated_at || "N/A";
    const lastUpdatedDate = new Date(lastUpdatedRaw);
    const lastUpdatedStr = lastUpdatedDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric"});
    const components = data.components || [{}];

    return {
        name: pageName,
        url: pageUrl,
        lastUpdated: lastUpdatedStr,
        components: components
    };
};