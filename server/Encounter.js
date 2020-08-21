class Encounter {
    constructor(area, version) {
        this.area = area
        this.version = version
        this.methods = new Set()
    }

    addMethod(method) {
        this.methods.add(method)
    }

    show() {
        const methods = [...this.methods]
        const out = 
            `
            Area   : ${this.area}
            Version: ${this.version}
            Methods: ${methods.reduce((accumulator, e) => {
                accumulator += e + ', '
                return accumulator;
            }, '')}
            `
        return out;    
    }
}

module.exports = Encounter