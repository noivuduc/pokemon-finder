class Pokemon {
    constructor(id, name, createdAt) {
        this.id = id
        this.name = name
        this.types = []
        this.stats = []
        this.encounters = [];
        this.createdAt = createdAt ? createdAt : new Date()
    }

    addStat(stat) {
        this.stats.push(stat)
    }
    addType(type) {
        this.types.push(type)
    }
    addEncounter(encounter) {
        this.encounters.push(encounter)
    }

    getId() {
        return this.id
    }

    getName() {
        return this.name
    }

    getTypes() {
        let output = ''
        for (const type of this.types) {
            output += type.name + ', '
        }
        return output;
    }

    getStats() {
        let output = ''
        for (const stat of this.stats) {
            output += `${stat.name}(${stat.value}), `
        }
        return output
    }

    getEncounters() {
        if (this.encounters.length === 0) return '-'
        let output = ''
        for (const encounter of this.encounters) {
            output += encounter.show()
        }
        return output
    }

    getLocation_area_encounters() {
        return this.location_area_encounters
    }
}

module.exports = Pokemon