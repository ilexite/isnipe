// Matches for:
//   discord.gift/   or   discord.com/gifts/   or   discordapp.com/gifts/
//                              +
//   16-char code   or   24-char code

module.exports =
	/discord(?:\.gift|\.com\/gifts|app\.com\/gifts)\/(?<code>[a-z0-9]{24}|[a-z0-9]{16})(?:\s|$)/gim;
