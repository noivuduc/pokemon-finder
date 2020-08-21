class Encounter {
    constructor(area, version) {
        this.area = area
        this.version = version
        this.methods = []
    }

    addMethod(method) {
        this.methods.push(method)
    }

    show() {
        const methods = [...new Set(this.methods)]
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