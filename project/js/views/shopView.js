export const ShopView = {
    renderShop(towersList, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        towersList.forEach(tower => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.dataset.id = tower.id;
            cardEl.dataset.cost = tower.cost;
            
            cardEl.innerHTML = `
                <div class="card-cost" style="${tower.unlocked ? '' : 'background:gray; color:white; border-color:white;'}">${tower.unlocked ? tower.cost : tower.unlockCost + 'G'}</div>
                <img src="${tower.sprite}" class="card-img" style="${tower.unlocked ? '' : 'filter: grayscale(100%) brightness(30%); border-color:gray;'}" draggable="false">
                <div class="card-title" style="${tower.unlocked ? '' : 'color:gray;'}">${tower.unlocked ? tower.name : 'BLOQUEADO'}</div>
                <div class="card-stats" style="${tower.unlocked ? '' : 'display:none;'}">
                    <span>ATK: ${tower.damage}</span>
                    <span>R: ${tower.range}</span>
                </div>
                ${!tower.unlocked ? '<div style="text-align:center; color:var(--color-neon-green); font-size:1.1rem; margin-top:5px; font-weight:900; text-shadow: 2px 2px 0px black;">COMPRAR</div>' : ''}
            `;
            
            if (tower.unlocked) {
                cardEl.draggable = true;
            } else {
                cardEl.draggable = false;
                cardEl.style.cursor = 'pointer';
                cardEl.addEventListener('click', () => {
                    document.dispatchEvent(new CustomEvent('unlockTower', { detail: tower.id }));
                });
            }
            container.appendChild(cardEl);
        });
    }
};
