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
    
    BoardView.renderGrid(EngineController.board, 'grid-container');

    ShopView.renderShop(TOWERS_DB, 'hand-container');

    DragDropController.init();
    
    const btnNext = document.getElementById('btn-next-wave');
    if(btnNext) {
        btnNext.addEventListener('click', () => {
            EngineController.startNextWave();
        });
    }

    document.addEventListener('unlockTower', (e) => {
        const towerId = e.detail;
        const tower = TOWERS_DB.find(t => t.id === towerId);
        
        if (tower && !tower.unlocked) {
            if (EngineController.player.gold >= tower.unlockCost) {
                EngineController.player.gold -= tower.unlockCost;
                tower.unlocked = true;
                UIView.updatePlayerStats(EngineController.player);
                ShopView.renderShop(TOWERS_DB, 'hand-container');
                UIView.showToast(`¡${tower.name} desbloqueado!`);
            } else {
                UIView.showToast(`Oro insuficiente (${tower.unlockCost}G necesarios)`);
            }
        }
    });

    document.addEventListener('sellTower', (e) => {
        const uid = e.detail;
        const tower = EngineController.board.towers.find(t => t.uid === uid);
        if (tower) {
            const refund = Math.floor(tower.dbRef.cost * 0.75);
            EngineController.player.gold += refund;
            EngineController.board.towers = EngineController.board.towers.filter(t => t.uid !== uid);
            UIView.updatePlayerStats(EngineController.player);
            UIView.showToast(`Torre vendida por +${refund}G`);
        }
    });
});
