// js/views/handView.js

export const HandView = {
    // Renderiza las cartas en la mano del jugador
    renderHand(handArray, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        handArray.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.draggable = true; // Permite el drag and drop nativo
            cardEl.dataset.id = card.id;
            cardEl.dataset.cost = card.cost;
            
            cardEl.innerHTML = `
                <div class="card-cost">${card.cost}</div>
                <img src="${card.sprite}" class="card-img" draggable="false">
                <div class="card-title">${card.name}</div>
                <div class="card-stats">
                    <span>ATK: ${card.attack}</span>
                    <span>HP: ${card.hp}</span>
                </div>
            `;
            container.appendChild(cardEl);
        });
    }
};
