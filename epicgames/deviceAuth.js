import os from "os";
import { ACCOUNT_PUBLIC_URL, SWITCH_TOKEN, FORTNITE_TOKEN } from "./globals.js";
import { sessionFetch } from "./session.js";

export class EpicUser {
    constructor(data = {}) {
        this.raw = data;
        this.accessToken = data.access_token || "";
        this.expiresIn = data.expires_in || 0;
        this.expiresAt = data.expires_at || "";
        this.tokenType = data.token_type || "";
        this.refreshToken = data.refresh_token || "";
        this.refreshExpires = data.refresh_expires || "";
        this.refreshExpiresAt = data.refresh_expires_at || "";
        this.accountId = data.account_id || "";
        this.clientId = data.client_id || "";
        this.internalClient = data.internal_client || false;
        this.clientService = data.client_service || "";
        this.displayName = data.displayName || "";
        this.app = data.app || "";
        this.inAppId = data.in_app_id || "";
        this.acr = data.acr || "";
        this.authTime = data.auth_time || "";
    }
};

export class EpicGenerator {
    constructor() {
        this.userAgent = `Sparkle/${os.platform()}/${os.release()}`;
        this.accessToken = "";
    }

    async start() {
        this.accessToken = await this.getAccessToken();
    }

    async getAccessToken() {
        const response = await sessionFetch(`${ACCOUNT_PUBLIC_URL}/account/api/oauth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `basic ${SWITCH_TOKEN}`,
                "User-Agent": this.userAgent
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                token_type: "eg1"
            })
        });

        const data = await response.json();
        
        return data.access_token;
    }

    async createDeviceCode() {
        const response = await sessionFetch(`${ACCOUNT_PUBLIC_URL}/account/api/oauth/deviceAuthorization`, {
            method: "POST",
            headers: {
                "Authorization": `bearer ${this.accessToken}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": this.userAgent
            }
        });

        const data = await response.json();

        return [data.verification_uri_complete, data.device_code];
    }

    async createExchangeCode(user) {
        const response = await sessionFetch(`${ACCOUNT_PUBLIC_URL}/account/api/oauth/exchange`, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${user.access_token}`,
                "User-Agent": this.userAgent
            }
        });

        const data = await response.json();

        return data.code;
    }

    async waitForDeviceCodeCompletion(code) {
        let token;

        while (true) {
            const response = await sessionFetch(`${ACCOUNT_PUBLIC_URL}/account/api/oauth/token`, {
                method: "POST",
                headers: {
                    "Authorization": `basic ${SWITCH_TOKEN}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "User-Agent": this.userAgent
                },
                body: new URLSearchParams({
                    grant_type: "device_code",
                    device_code: code,
                    token_type: "eg1"
                })
            });

            token = await response.json();

            if (response.status === 200) {
                break;
            }

            await new Promise(res => setTimeout(res, 5000));
        }

        const exchangeResp = await sessionFetch(`${ACCOUNT_PUBLIC_URL}/account/api/oauth/exchange`, {
            method: "GET",
            headers: {
                "Authorization": `bearer ${token.access_token}`,
                "User-Agent": this.userAgent
            }
        });

        const exchange = await exchangeResp.json();

        const finalResp = await sessionFetch(`${ACCOUNT_PUBLIC_URL}/account/api/oauth/token`, {
            method: "POST",
            headers: {
                "Authorization": `basic ${FORTNITE_TOKEN}`,
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": this.userAgent
            },
            body: new URLSearchParams({
                grant_type: "exchange_code",
                exchange_code: exchange.code,
                token_type: "eg1"
            })
        });

        const finalData = await finalResp.json();

        return new EpicUser(finalData);
    }
};