// js/main.js
import { EngineController } from './controllers/engineController.js';
import { DragDropController } from './controllers/dragDropController.js';
import { MinigameController } from './controllers/minigameController.js';
import { BoardView } from './views/boardView.js';
import { ShopView } from './views/shopView.js';
import { UIView } from './views/uiView.js';
import { TOWERS_DB } from './database/towersData.js';

document.addEventListener('DOMContentLoaded', () => {
    MinigameController.init();
    
    EngineController.init();
    
    EngineController.init();

    ShopView.renderShop(TOWERS_DB, 'hand-container');

    DragDropController.init();
    
    const btnNext = document.getElementById('btn-next-wave');
    if(btnNext) {
        btnNext.addEventListener('click', () => {
            EngineController.startNextWave();
        });
    }

    const btnToggle2P = document.getElementById('btn-toggle-2p');
    if (btnToggle2P) {
        btnToggle2P.addEventListener('click', () => {
            if (EngineController.gameMode === '1P') {
                EngineController.setGameMode('2P');
                btnToggle2P.textContent = 'Modo 1 Jugador';
                btnToggle2P.style.borderColor = 'var(--color-neon-pink)';
                btnToggle2P.style.color = 'var(--color-neon-pink)';
            } else {
                EngineController.setGameMode('1P');
                btnToggle2P.textContent = 'Modo 2 Jugadores';
                btnToggle2P.style.borderColor = 'var(--color-neon-cyan)';
                btnToggle2P.style.color = 'var(--color-neon-cyan)';
            }
        });
    }

    document.addEventListener('unlockTower', (e) => {
        const towerId = e.detail;
        const tower = TOWERS_DB.find(t => t.id === towerId);
        
        if (tower && !tower.unlocked) {
            const player = EngineController.players[EngineController.currentPlayerIndex];
            if (player.gold >= tower.unlockCost) {
                player.gold -= tower.unlockCost;
                tower.unlocked = true;
                UIView.updatePlayerStats(player);
                ShopView.renderShop(TOWERS_DB, 'hand-container');
                UIView.showToast(`¡${tower.name} desbloqueado!`);
            } else {
                UIView.showToast(`Oro insuficiente (${tower.unlockCost}G necesarios)`);
            }
        }
    });

    document.addEventListener('sellTower', (e) => {
        const uid = e.detail;
        const board = EngineController.boards[EngineController.currentPlayerIndex];
        const player = EngineController.players[EngineController.currentPlayerIndex];
        
        const tower = board.towers.find(t => t.uid === uid);
        if (tower) {
            const refund = Math.floor(tower.dbRef.cost * 0.75);
            player.gold += refund;
            board.towers = board.towers.filter(t => t.uid !== uid);
            UIView.updatePlayerStats(player);
            UIView.showToast(`Torre vendida por +${refund}G`);
        }
    });
});
