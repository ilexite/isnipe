const axios = require("axios");

class REST {
	constructor(token, sniper) {
		this.token = token;
		this.sniper = sniper;

		this.axios = axios.create({
			baseURL: "https://discord.com/api/v9",
			headers: {
				common: {
					Authorization: this.token,
				},

				post: {
					"Content-Type": "application/json",
				},
			},
			validateStatus: () => true,
		});
	}

	async connect() {
		this.attempted = true;

		const res = await this.axios.get("/users/@me");
		this.user = res.data;

		return res.status == 200;
	}

	good() {
		return new Promise(async resolve => {
			if (!this.isGood)
				if (!this.attempted) this.isGood = await this.connect();

			resolve(this.isGood);
		});
	}

	async redeem(code) {
		const res = await this.axios.post(
			`/entitlements/gift-codes/${code}/redeem`,
			{},
		);

		return {
			success: res.status == 200,
			type: await this.nitroType(code, res),
		};
	}

	async nitroType(code, resp) {
		if (resp.status == 200) return resp.data.sku.name;

		if (resp.status == 400) {
			const res = await this.axios.get(
				`/entitlements/gift-codes/${code}`,
			);

			return res.data.store_listing.sku.name;
		}
	}
}

module.exports = REST;
