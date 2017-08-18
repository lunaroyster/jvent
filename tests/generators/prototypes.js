var objectPrototype = class generatorPrototype {
    constructor() {
        
    }
    static convertToBase36String(number) {
        return (Math.abs(number)).toString(36);
    }
};

module.exports = {
    objectPrototype: objectPrototype
};