// Import lib
const axios = require('axios')
// Import Models
const Pokemon = require('./Pokemon')
const Stat = require('./Stat')
const Type = require('./Type')
const Encounter = require('./Encounter')
const API_URI = 'https://pokeapi.co/api/v2/pokemon/'
class Server {
    constructor(stores, cache) {
        this.stores = stores;
        this.cache = cache
    }
    async findPokemon(query) {
        let pokemon = this.stores.find(query)
        if (pokemon) {
            console.log('> From cached')
            return pokemon;
        }
        pokemon = await this.fromAPI(query)
        if (pokemon) {
            this.stores.save(pokemon.getName(), pokemon.getId(), pokemon)
            // TODO: Save to file for caching
            this.cache.store(JSON.stringify(pokemon))
            return pokemon
        }
        return false;
    }

    async fromAPI(query) {
        try {
            const resp = await axios({
                method: 'get',
                url: API_URI + query,
                responseType: 'json'
            })
            if (resp.status !== 200) {
                return false
            }
            const responseData = resp.data
            const name = responseData.name
            const id = responseData.id
            const xstats = responseData.stats
            const xtypes = responseData.types

            const pokemon = new Pokemon(id, name)
            for (const item of xstats) {
                pokemon.addStat(new Stat(item.stat.name, item.base_stat, item.stat.url))
            }

            for (const item of xtypes) {
                pokemon.addType(new Type(item.type.name, item.type.url))
            }

            // Fetch encounters
            const encountersRawResp = await await axios({
                method: 'get',
                url: responseData.location_area_encounters,
                responseType: 'json'
            })
            const encounterData = encountersRawResp.data.filter((e) => e.location_area.name.includes('kanto'))
            for (const encounter of encounterData) {
                const location_area = encounter.location_area
                const versionDetails = encounter.version_details
                for (const element of versionDetails) {
                    const encounterDetails = element.encounter_details
                    const enc = new Encounter(location_area.name, element.version.name)
                    for (const it of encounterDetails) {
                        enc.addMethod(it.method.name)
                    }
                    pokemon.addEncounter(enc)
                }
            }                     
            // console.log(pokemon) 
            return pokemon;
        } catch (error) {
            return false;
        }
    }
}

module.exports = Server