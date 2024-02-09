class Bets {
    constructor(chips) {
        this.chips = chips;
        this.raiseAmount = 0;
    }

    raise(){

        this.raiseAmount = parseInt(document.getElementById("raiseInput").value, 10);

        if (!isNaN(this.raiseAmount) && this.raiseAmount > 0 && this.raiseAmount <= this.chips) {
            this.chips -= this.raiseAmount;
            
            console.log(this.chips);
        } else {
            alert("Invalid input for raise amount.");
        }

        return this.raiseAmount;
    }

}

const bets = new Bets()
module.exports = Bets;
