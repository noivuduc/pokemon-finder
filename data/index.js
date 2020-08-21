class InMemoryData {
    constructor(config) {
        this.pokemons = new Map()
        this.config = config
    }

    save(name, id, data) {
        this.pokemons.set(name, data)
        this.pokemons.set(id, data)
    }

    find(key) {
        const pokemon = this.pokemons.get(key);
        if (!pokemon) {
            return null;
        }
        const createdDate = new Date(pokemon.createdAt).getTime() / 1000
        const now = new Date().getTime() / 1000;
        if (now - createdDate >= this.config.TTL) {// Over 1 week old
            this.pokemons.delete(pokemon.getId())
            this.pokemons.delete(pokemon.getName())
            return null;
        }
        return pokemon;
    }

    clear() {
        this.pokemons = new Map()
    }
}

module.exports = InMemoryData