export class GameView {
    constructor() {
        this.inventoryDock = document.getElementById('inventoryDock');
        this.diceDisplay = document.getElementById('diceDisplay');
    }

    renderHand(characters) {
        this.inventoryDock.innerHTML = ''; 
        characters.forEach(char => {
            const card = document.createElement('div');
            card.className = 'characterCard';
            card.draggable = true;
            card.dataset.id = char.id;
            
            card.innerHTML = `
                <img src="${char.sprite}" class="cardImage">
                <div class="cardInfo">
                    <p class="charName">${char.name}</p>
                    <p class="kiCost">KI: ${char.kiCost}</p>
                </div>
            `;

            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', char.id);
                card.classList.add('dragging');
            });

            card.addEventListener('dragend', () => card.classList.remove('dragging'));
            this.inventoryDock.appendChild(card);
        });
    }

    updateDice(value) {
        this.diceDisplay.textContent = value;
    }

    updateHealthBars(p1Hp, p2Hp) {
        document.getElementById('p1HealthFill').style.width = `${p1Hp}%`;
        document.getElementById('p2HealthFill').style.width = `${p2Hp}%`;
    }

    createUnitInField(character, attackerId, onHitCallback) {
        const entitiesLayer = document.getElementById('entitiesLayer');
        const unitElement = document.createElement('div');
        
        unitElement.className = `unit ${attackerId === 'player1' ? 'p1Unit' : 'p2Unit'}`;
        unitElement.innerHTML = `
            <img src="${character.sprite}" class="unitSprite">
            <div class="unitHealthBar"><div class="unitHealthFill"></div></div>
        `;

        entitiesLayer.appendChild(unitElement);

        // Al terminar la animación de 5 segundos
        setTimeout(() => {
            const defenderId = attackerId === 'player1' ? 'player2' : 'player1';
            
            // Llamamos a la lógica de daño
            onHitCallback(defenderId, character.attack);

            // Efecto de sacudida en la torre
            const towerClass = defenderId === 'player1' ? '.leftFortress' : '.rightFortress';
            const towerEl = document.querySelector(towerClass);
            if(towerEl) {
                towerEl.classList.add('shake');
                setTimeout(() => towerEl.classList.remove('shake'), 500);
            }

            unitElement.remove();
        }, 5000); 
    }
}
