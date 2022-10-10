const axios = require("axios");

class REST {
	constructor(token, sniper) {
		this.token = token;
		this.sniper = sniper;

		// Create axios client
		this.axios = axios.create({
			baseURL: "https://discord.com/api/v9",
			headers: {
				common: {
					Authorization: this.token,
				},

				post: {
					// Required by Discord's API
					"Content-Type": "application/json",
				},
			},
			// Don't throw an error when statuscode is not 2xx/3xx
			validateStatus: () => true,
		});
	}

	async connect() {
		this.attempted = true;

		const res = await this.axios.get("/users/@me");
		this.user = res.data;

		return res.status == 200;
	}

	// Check if the token is valid
	good() {
		return new Promise(async resolve => {
			if (!this.isGood)
				if (!this.attempted) this.isGood = await this.connect();

			resolve(this.isGood);
		});
	}

	// Redeem the code
	async redeem(code) {
		const res = await this.axios.post(
			`/entitlements/gift-codes/${code}/redeem`,
			{}, // Empty body; required by Discord's API.
		);

		// Return some info about the code
		return {
			success: res.status == 200,
			type: await this.nitroType(code, res),
		};
	}

	async nitroType(code, resp) {
		// Successfully redeemed; the response contains the type.
		if (resp.status == 200) return resp.data.sku.name;

		// Already used; fetch info from API.
		if (resp.status == 400) {
			const res = await this.axios.get(
				`/entitlements/gift-codes/${code}`,
			);

			return res.data.store_listing.sku.name;
		}
	}
}

module.exports = REST;
