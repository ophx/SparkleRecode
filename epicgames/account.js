import { FORTNITE_PUBLIC_URL, ACCOUNT_PUBLIC_URL, ACCOUNT_PUBLIC_03_URL, GLOBAL_PROFILE_URL, FRIENDS_PUBLIC_URL } from "./globals.js";
import { sessionFetch } from "./session.js";

export async function getCurrentSkin(user) {
    const res = await sessionFetch(`${FORTNITE_PUBLIC_URL}/fortnite/api/game/v2/profile/${user.accountId}/client/QueryProfile?profileId=athena`, {
        method: "POST",
        headers: {
            "Authorization": `bearer ${user.accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    });
  
    if (!res.ok) {
        return null;
    }

    const data = await res.json();

    const profile = data?.profileChanges?.[0]?.profile;
    const loadoutIds = profile?.stats?.attributes?.loadouts;
    if (profile?.items && loadoutIds) {
        const results = loadoutIds.map((id) => profile.items[id]).filter(Boolean);
        const id = results[0]?.attributes?.locker_slots_data?.slots?.Character?.items[0].split(":")[1];
        if (id) {
            const urls = [
                `https://fortnite-api.com/images/cosmetics/br/${id}/icon.png`,
                `https://fortnite-api.com/images/cosmetics/br/${id}/smallicon.png`
            ];
            for (let u of urls) {
                const r = await sessionFetch(u);
                if (r.ok) {
                    return u;
                }
            }
        }
    }

    return null;
};

export async function getProfile(user) {
    const res = await sessionFetch(`${FORTNITE_PUBLIC_URL}/fortnite/api/game/v2/profile/${user.accountId}/client/QueryProfile?profileId=athena`, {
        method: "POST",
        headers: {
            "Authorization": `bearer ${user.accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    });
  
    if (!res.ok) {
        return `Error sessionFetching profile (${res.status})`;
    }
  
    return await res.json();
};

export async function getAccountInfo(user) {
    const res = await sessionFetch(`${ACCOUNT_PUBLIC_URL}/account/api/public/account/${user.accountId}`, {
        headers: {
            "Authorization": `bearer ${user.accessToken}`
        }
    });
  
    if (!res.ok) {
        return { error: `Error sessionFetching account info (${res.status})` };
    }
  
    const data = await res.json();
    const lastChange = data.lastDisplayNameChange || "...";
  
    if (lastChange !== "...") {
        const date = new Date(lastChange);
        data.lastDisplayNameChange = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }
  
    return data;
};

export async function getProfileInfo(user) {
    const res = await sessionFetch(`${FORTNITE_PUBLIC_URL}/fortnite/api/game/v2/profile/${user.accountId}/client/QueryProfile?profileId=common_core`, {
        method: "POST",
        headers: {
            "Authorization": `bearer ${user.accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    });
  
    if (!res.ok) {
        return { error: `Error sessionFetching profile info (${res.status})` };
    }
  
    const data = await res.json();

    const creationRaw = data?.profileChanges?.[0]?.profile?.created || "...";
    const creationDate = creationRaw !== "..." ? new Date(creationRaw).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "...";
  
    data.creationDate = creationDate;

    return data;
};

export async function getBRInventory(user) {
    const res = await sessionFetch(`${FORTNITE_PUBLIC_URL}/fortnite/api/game/v2/br-inventory/account/${user.accountId}`, {
        headers: {
            "Authorization": `bearer ${user.accessToken}`
        }
    });
  
    if (!res.ok) {
        return { error: `Error sessionFetching br inventory info (${res.status})` };
    }
  
    return await res.json();
};

export async function getProfileStats(user) {
    const res = await sessionFetch(`${FORTNITE_PUBLIC_URL}/fortnite/api/game/v2/profile/${user.accountId}/client/QueryProfile?profileId=athena`, {
        method: "POST",
        headers: {
            "Authorization": `bearer ${user.accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    });
  
    if (!res.ok) {
        return `Error sessionFetching profile stats (${res.status})`;
    }

    const data = await res.json();
  
    const attributes = data?.profileChanges?.[0]?.profile?.stats?.attributes || {};
    const lastMatch = attributes.last_match_end_datetime || null;

    let lastPlayedInfo = "N/A";
    if (lastMatch) {
        lastPlayedInfo = new Date(lastMatch).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }

    return {
        accountLevel: attributes.accountLevel || 0,
        level: attributes.level || 0,
        lastPlayedInfo: lastPlayedInfo,
    };
};

export async function getBattlePassInfo(user) {
    const res = await sessionFetch(`${GLOBAL_PROFILE_URL}/profiles`, {
        method: "PUT",
        headers: {
            "Authorization": `bearer ${user.accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            namespace: "Fortnite",
            accountIds: [user.accountId]
        })
    });
  
    if (!res.ok) {
        return { error: `Error sessionFetching battle pass info (${res.status})` };
    }
  
    const data = await res.json();
    const profile = data?.profiles?.[0] || {};
  
    return {
        hasBattlepass: profile.hasBattlePass || false,
        hasCrewMembership: profile.hasCrewMembership || false
    };
};

export async function getSTWInfo(user) {
    const res = await sessionFetch(`${FORTNITE_PUBLIC_URL}/fortnite/api/game/v2/profile/${user.accountId}/public/QueryPublicProfile?profileId=campaign`, {
        method: "POST",
        headers: {
            "Authorization": `bearer ${user.accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    });

    const data = await res.json();

    return {
        hasStw: String(data).includes("tutorial")
    };
};

export async function getExternalAuths(user) {
    const res = await sessionFetch(`${ACCOUNT_PUBLIC_03_URL}/account/api/public/account/${user.accountId}/externalAuths`, {
        headers: {
            "Authorization": `bearer ${user.accessToken}`
        }
    });
  
    if (!res.ok) {
        return [];
    }
  
    return await res.json();
};

export async function getPaymentInfo(user) {
    const res = await sessionFetch(`${FORTNITE_PUBLIC_URL}/fortnite/api/game/v2/profile/${user.accountId}/client/QueryProfile?profileId=common_core`, {
        method: "POST",
        headers: {
            "Authorization": `bearer ${user.accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    });
  
    if (!res.ok) {
        return { error: `Error sessionFetching payment info (${res.status})` };
    }
  
    const data = await res.json();
    const profile = data?.profileChanges?.[0]?.profile || {};
    const items = profile.items || {};
    const attributes = profile.stats?.attributes || {};
    const mtxHistory = attributes.mtx_purchase_history || {};
    const giftHistory = attributes.gift_history || {};
  
    let totalVbucks = 0;
    let totalSpent = 0;
  
    for (let id in items) {
        if (["Currency:MtxPurchased", "Currency:MtxEarned", "Currency:MtxGiveaway", "Currency:MtxPurchaseBonus"].includes(items[id].templateId)) {
            totalVbucks += items[id].quantity || 0;
        }
    }
  
    for (let purchase of mtxHistory.purchases || []) {
        totalSpent += purchase.totalMtxPaid || 0;
    }
  
    return {
        totalVbucks,
        totalVbucksSpent: totalSpent,
        refundsUsed: mtxHistory.refundsUsed || 0,
        refundsAvailable: mtxHistory.refundCredits || 0,
        giftsSent: giftHistory.num_sent || 0,
        giftsReceived: giftHistory.num_received || 0
    };
};

export async function clearFriendsList(user) {
    const res = await sessionFetch(`${FRIENDS_PUBLIC_URL}/friends/api/public/friends/${user.accountId}`, {
        headers: {
            "Authorization": `bearer ${user.accessToken}`,
        }
    });

    if (!res.ok) {
        return;
    }

    const friends = await res.json();
    for (let friend of friends) {
        const res = await sessionFetch(`${FRIENDS_PUBLIC_URL}/friends/api/public/friends/${user.accountId}/${friend.accountId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `bearer ${user.accessToken}`,
            }
        });

        if (!res.ok) {
            return;
        }
    }
};