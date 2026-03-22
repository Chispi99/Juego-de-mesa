// js/controllers/gameController.js
import { Board } from '../types/board.js';
import { Player } from '../types/player.js';
import { CARDS_DB } from '../database/cardsData.js';

export const GameController = {
    board: null,
    player1: null,
    player2: null,

    init() {
        this.board = new Board(8, 8);
        this.player1 = new Player('p1', 'Player 1');
        this.player2 = new Player('p2', 'Player 2');
        
        this.player1.initDeck(CARDS_DB);
        this.player2.initDeck(CARDS_DB);
        
        // Robo inicial de 3 cartas por jugador
        for(let i = 0; i < 3; i++) {
            this.player1.drawCard();
            this.player2.drawCard();
        }
    },
    
    getPlayer(id) {
        return id === 'p1' ? this.player1 : this.player2;
    }
};
