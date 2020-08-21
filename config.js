const config = {
    TTL: 7 * 24 * 60 * 60, // Time to live (7 days * 24 hours * 60 minutes * 60 seconds),
    API_URI : 'https://pokeapi.co/api/v2/pokemon/'
}

Object.freeze(config)

module.exports = config