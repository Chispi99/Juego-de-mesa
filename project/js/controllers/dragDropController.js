import { EngineController } from './engineController.js';
import { Tower } from '../types/tower.js';
import { TOWERS_DB } from '../database/towersData.js';
import { UIView } from '../views/uiView.js';

export const DragDropController = {
    init() {
        const boardArea = document.getElementById('board-area');
        const shopContainer = document.getElementById('hand-container');

        shopContainer.addEventListener('dragstart', (e) => {
            const cardEl = e.target.closest('.card');
            if (cardEl) {
                e.dataTransfer.setData('text/plain', cardEl.dataset.id);
                setTimeout(() => cardEl.classList.add('dragging'), 0);
            }
        });

        shopContainer.addEventListener('dragend', (e) => {
            const cardEl = e.target.closest('.card');
            if (cardEl) cardEl.classList.remove('dragging');
        });

        boardArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            const cell = e.target.closest('.grid-cell');
            if (cell) {
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
                const board = EngineController.boards[EngineController.currentPlayerIndex];
                if (board.isCellEmpty(x, y)) {
                    cell.classList.add('drag-over');
                } else {
                    cell.style.backgroundColor = 'rgba(255,0,0,0.3)';
                }
            }
        });

        boardArea.addEventListener('dragleave', (e) => {
            const cell = e.target.closest('.grid-cell');
            if (cell) {
                cell.classList.remove('drag-over');
                cell.style.backgroundColor = '';
            }
        });

        boardArea.addEventListener('drop', (e) => {
            e.preventDefault();
            const cell = e.target.closest('.grid-cell');
            if (!cell) return;
            
            cell.classList.remove('drag-over');
            cell.style.backgroundColor = '';
            
            const towerId = e.dataTransfer.getData('text/plain');
            if (!towerId) return;

            const x = parseInt(cell.dataset.x);
            const y = parseInt(cell.dataset.y);

            const towerData = TOWERS_DB.find(t => t.id === towerId);
            if (!towerData) return;

            const board = EngineController.boards[EngineController.currentPlayerIndex];
            const player = EngineController.players[EngineController.currentPlayerIndex];

            if (board.isCellEmpty(x, y)) {
                if (player.gold >= towerData.cost) {
                    player.gold -= towerData.cost;
                    UIView.updatePlayerStats(player);
                    
                    const newTower = new Tower(`t_${Date.now()}`, towerData, x, y);
                    board.towers.push(newTower);
                } else {
                    UIView.showToast("💰 Oro Insuficiente 💰");
                }
            } else {
                UIView.showToast("❌ No puedes plantar en el camino o celdas ocupadas ❌");
            }
        });
    }
};
