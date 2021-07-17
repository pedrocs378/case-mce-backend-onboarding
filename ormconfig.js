module.exports = {
	"type": "mongodb",
	"url": process.env.MONGODB_URL ?? "",
	"entities": [
		"./src/database/schemas/*.ts"
	]
}