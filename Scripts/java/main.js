import { CHARACTERS_LIST } from './database/characters.js';
import { GameView } from './views/gameView.js';
import { GameController } from './Controllers/gameControllers.js';

const view = new GameView();
const game = new GameController();

const rollBtn = document.getElementById('rollDiceButton');
const turnText = document.getElementById('turnAnnouncer');
const p1KiSpan = document.getElementById('p1KiAmount');
const p2KiSpan = document.getElementById('p2KiAmount');
const battlefield = document.getElementById('battlefieldArea');

// 1. Inicializar
document.addEventListener('DOMContentLoaded', () => {
    view.renderHand(CHARACTERS_LIST);
    updateKiDisplays();
    view.updateHealthBars(game.players.player1.hp, game.players.player2.hp);
    turnText.textContent = `Turno de: ${game.players[game.activePlayer].name}`;
});

// 2. Dado
rollBtn.addEventListener('click', () => {
    const value = game.rollDice();
    if (value) {
        view.updateDice(value);
        updateKiDisplays();
        rollBtn.disabled = true;
        turnText.textContent = `¡Sacaste un ${value}! Invoca una carta.`;
    }
});

// 3. Drag & Drop
battlefield.addEventListener('dragover', (e) => e.preventDefault());

battlefield.addEventListener('drop', (e) => {
    e.preventDefault();
    const charId = e.dataTransfer.getData('text/plain');
    const character = CHARACTERS_LIST.find(c => c.id === charId);
    const currentPlayer = game.activePlayer;

    if (!character) {
        alert('Carta no válida. Arrastra una carta del inventario.');
        return;
    }

    if (game.canAffordSummon(character.kiCost)) {
        game.spendKi(character.kiCost);
        updateKiDisplays();

        view.createUnitInField(character, currentPlayer, (target, damage) => {
            const isGameOver = game.receiveDamage(target, damage);
            view.updateHealthBars(game.players.player1.hp, game.players.player2.hp);

            if (isGameOver) {
                alert(`¡K.O.! Victoria para ${game.players[currentPlayer].name}`);
                location.reload();
            }
        });
        endTurn();
    } else {
        alert("¡No tienes suficiente energía Ki!");
    }
});

function updateKiDisplays() {
    p1KiSpan.textContent = game.players.player1.ki;
    p2KiSpan.textContent = game.players.player2.ki;
}

function endTurn() {
    const nextPlayer = game.switchTurn();
    turnText.textContent = `Turno de: ${game.players[nextPlayer].name}`;
    rollBtn.disabled = false;
    view.updateDice("?");
}