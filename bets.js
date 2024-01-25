class bets {
    constructor(chips) {
        this.chips = chips;
        this.raiseAmount = 0;
        this.bank = 0;
        this.smallBlind = 200;
        this.bigBlind = 400;

        this.handleSubmit = this.handleSubmit.bind(this);

        this.updateChipCount();
        
        document.getElementById("myForm").addEventListener("submit", this.handleSubmit);
    }

    updateChipCount() {
        document.getElementById("chipCount").textContent = this.chips;
    }

    handleSubmit(event) {
        event.preventDefault(); 

        this.raiseAmount = parseInt(document.getElementById("raiseInput").value, 10);

        if (!isNaN(this.raiseAmount) && this.raiseAmount > 0 && this.raiseAmount <= this.chips) {
            this.chips -= this.raiseAmount;
            this.bank += this.raiseAmount;
            this.updateChipCount();
            
            console.log("bank:", this.bank);
            console.log("Submitted value:", this.raiseAmount);
        } else {
            alert("Invalid input for raise amount.");
        }
    }

    call(){
        
    }

}

const myChipGame = new bets(20000);