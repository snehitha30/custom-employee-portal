const axios = require("axios");

let accessToken = null;
let tokenExpiresAt = 0;

async function getZohoAccessToken() {
    if (accessToken && Date.now() < tokenExpiresAt) {
        return accessToken;
    }

    if (!process.env.ZOHO_CLIENT_ID || !process.env.ZOHO_CLIENT_SECRET || !process.env.ZOHO_REFRESH_TOKEN) {
        throw new Error("Zoho OAuth credentials are not configured");
    }

    const response = await axios.post(
        "https://accounts.zoho.in/oauth/v2/token",
        null,
        {
            params: {
                refresh_token: process.env.ZOHO_REFRESH_TOKEN,
                client_id: process.env.ZOHO_CLIENT_ID,
                client_secret: process.env.ZOHO_CLIENT_SECRET,
                grant_type: "refresh_token"
            }
        }
    );

    accessToken = response.data.access_token;

    const expiresIn = response.data.expires_in || 3600;

    tokenExpiresAt = Date.now() + (expiresIn - 60) * 1000;

    return accessToken;
}

async function zohoRequest(url, method = "GET", data = null) {
    const token = await getZohoAccessToken();

    const response = await axios({
        url,
        method,
        data,
        headers: {
            Authorization: `Zoho-oauthtoken ${token}`
        }
    });

    return response.data;
}

module.exports = {
    getZohoAccessToken,
    zohoRequest
};