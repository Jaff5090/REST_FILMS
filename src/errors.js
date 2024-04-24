
class NoResult extends Error {
    constructor() {
        this.message = "No result found when asking database.";
        this.name = "No result";
        
        this.code = 500;
    }
}