
function displayHands() {
    const display = document.querySelector('.cardContainer');
    const tempImage = document.getElementsByClassName('card');
    const cardSpacing = 2; 
    var currentLeft = 49; 
    var topValue, topFlag = 0;

    if(tempImage.length !== 0){
        for(let i = tempImage.length - 1; i >= 0; i--){ // delete cards which were printed earlier, we loop backwards because of automatically restructuring DOM
            tempImage[i].parentNode.removeChild(tempImage[i]);
        }
    }

    for (const id in players) {
        let i = 0;
        i++;
        const playerInfo = players[id];
        const isCurrentPlayer = playerInfo.id === currentPlayerId;
        const isFolded = playerInfo.folded;

        if (Array.isArray(playerInfo.hand)) {
            topFlag++;

            for (let j = 0; j < playerInfo.hand.length; j++) {
                const card = playerInfo.hand[j];
                const cardImage = document.createElement('img');
                if (isFolded) {
                    cardImage.src = `playCards/Card_back_grey.svg.png`;
                    cardImage.alt = "Fold Card Back";
                } else {
                    cardImage.src = isCurrentPlayer ? `playCards/${card}.svg` : `playCards/Card_back_01.svg.png`;
                    cardImage.alt = isCurrentPlayer ? card : "Card Back";
                }

                if(topFlag <= 1){
                    topValue = '80%';
                    dynamicHand(cardImage, currentLeft, topValue);
                } else {
                    if(i == 1 && j == 0) currentLeft = 49;
                    topValue = '20%';
                    dynamicHand(cardImage, currentLeft, topValue);
                }
                
                display.appendChild(cardImage);
                currentLeft += cardSpacing;
            }
        }
    }
}

 function displayCards(length, arr, HTMLdisplay) {
    const display = document.getElementById(HTMLdisplay);
    display.innerHTML = ' ';

    for(let i = 0; i < length; i++){
        const cardImage = document.createElement('img');
        cardImage.src = `playCards/${arr[i]}.svg`; 
        cardImage.alt = arr[i];
        cardImage.width = 100; 

        display.appendChild(cardImage);
    }
}

function dynamicHand(cardImage, currentLeft, topValue){
    cardImage.className = 'card';
    cardImage.style.left = currentLeft + '%';
    cardImage.style.top = topValue;
    cardImage.style.transform = 'translate(-50%, -50%)';
    
}