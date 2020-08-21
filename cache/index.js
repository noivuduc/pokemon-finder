const ReadLine = require('n-readlines')
const Pokemon = require('../server/Pokemon')
const Type = require('../server/Type')
const Stat = require('../server/Stat')
const Encounter = require('../server/Encounter')
const fs = require('fs')
const filePath = __dirname + '/pokemons.txt'
class FileSystemCache {
    constructor(config) {
        this.config = config
    }
    /**
     * Load data from file and store in memory for searching
     * @param {HashMap} memoryStores 
     */
    sync(memoryStores) {
        try {
            // Check if the cache is existed
            fs.statSync(filePath)
            const liner = new ReadLine(filePath)
            let newFile = ''
            let line;
            while(line = liner.next()) {
                const poke = JSON.parse(line.toString('utf8'))
                // TODO: Check the created date
                const createdDate = new Date(poke.createdAt);
                const now = new Date().getTime() / 1000;
                // If the data is too old
                if (now - createdDate.getTime() / 1000 >= this.config.TTL) {
                    continue;
                }
                newFile += line + '\n'
                const pokemon = new Pokemon(poke.id, poke.name, createdDate)
                const types = poke.types
                const stats = poke.stats
                const encounters = poke.encounters
                for (const type of types) {
                    pokemon.addType(new Type(type.name, type.url))
                }

                for (const stat of stats) {
                    pokemon.addStat(new Stat(stat.name, stat.value, stat.url))
                }

                for (const encounter of encounters) {
                    const methods = encounter.methods || []
                    const enc = new Encounter(encounter.area, encounter.version)
                    for (const method of methods) {
                        enc.addMethod(method)
                    }
                    pokemon.addEncounter(enc)
                }
                memoryStores.save(pokemon.id, pokemon.name, pokemon)
            }
            // Save new file with the valid ttl
            fs.writeFileSync(filePath, newFile)
        } catch (error) {
            console.log(error)
            return;
        }
    }

    store(data) {
        fs.appendFileSync(filePath, data + '\n')
    }

    clear() {
        fs.unlinkSync(filePath)
    }
}

module.exports = FileSystemCache