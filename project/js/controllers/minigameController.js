// js/controllers/minigameController.js
import { UIView } from '../views/uiView.js';
import { EngineController } from './engineController.js';

export const MinigameController = {
    rewards: {
        1: 10,
        2: 20,
        3: 30,
        4: 40,
        5: 50,
        6: 100 // Jackpot
    },
    faces: ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'],
    isRolling: false,
    currentReward: 0,
    
    init() {
        const btnRoll = document.getElementById('btn-roll-dice');
        const btnClaim = document.getElementById('btn-claim-reward');
        
        if (btnRoll) {
            btnRoll.addEventListener('click', () => this.rollDice());
        }
        if (btnClaim) {
            btnClaim.addEventListener('click', () => this.claimReward());
        }
    },

    start() {
        const modal = document.getElementById('dice-modal');
        if (!modal) return;
        
        modal.classList.remove('hidden');
        document.getElementById('btn-roll-dice').style.display = 'block';
        document.getElementById('btn-claim-reward').style.display = 'none';
        
        const resultText = document.getElementById('dice-result-text');
        resultText.textContent = 'Tu destino te aguarda...';
        resultText.style.color = 'var(--color-neon-gold)';
        
        document.getElementById('dice-face').textContent = '🎲';
    },

    rollDice() {
        if (this.isRolling) return;
        this.isRolling = true;
        
        const diceEl = document.getElementById('dice-container');
        const faceEl = document.getElementById('dice-face');
        const resultText = document.getElementById('dice-result-text');
        const btnRoll = document.getElementById('btn-roll-dice');
        const btnClaim = document.getElementById('btn-claim-reward');
        
        diceEl.classList.add('rolling');
        btnRoll.style.display = 'none';
        resultText.textContent = 'Lanzando...';
        resultText.style.color = '#fff';
        
        let rolls = 0;
        const interval = setInterval(() => {
            // Efecto visual rápido de caras aleatorias
            faceEl.textContent = this.faces[Math.floor(Math.random() * 6)];
            rolls++;
            if (rolls > 15) {
                clearInterval(interval);
                diceEl.classList.remove('rolling');
                this.finishRoll(faceEl, resultText, btnClaim);
            }
        }, 100);
    },

    finishRoll(faceEl, resultText, btnClaim) {
        const result = Math.floor(Math.random() * 6) + 1;
        this.currentReward = this.rewards[result];
        
        faceEl.textContent = this.faces[result - 1]; // Arrays indexados de 0 a 5
        
        if (result === 6) {
            resultText.textContent = `¡JACKPOT ANIME! +${this.currentReward} 💰`;
            resultText.style.color = 'var(--color-neon-pink)';
            resultText.style.textShadow = '0 0 10px var(--color-neon-pink)';
        } else if (result === 1) {
            resultText.textContent = `Mala suerte... +${this.currentReward} 💰`;
            resultText.style.color = '#888';
            resultText.style.textShadow = 'none';
        } else {
            resultText.textContent = `¡Buen botín! +${this.currentReward} 💰`;
            resultText.style.color = 'var(--color-neon-cyan)';
            resultText.style.textShadow = '0 0 10px var(--color-neon-cyan)';
        }
        
        btnClaim.style.display = 'block';
        this.isRolling = false;
    },

    claimReward() {
        // Otorgar oro
        EngineController.player.gold += this.currentReward;
        UIView.updatePlayerStats(EngineController.player);
        
        // Cerrar modal
        const modal = document.getElementById('dice-modal');
        modal.classList.add('hidden');
    }
};
