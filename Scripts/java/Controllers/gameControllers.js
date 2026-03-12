// Scripts/java/Controllers/gameControllers.js
export class GameController {
    constructor() {
        // Estado inicial de los jugadores
        this.players = {
            player1: { name: "Clan Shinobi", ki: 0, hp: 100 },
            player2: { name: "Imperio Saiyan", ki: 0, hp: 100 }
        };
        
        this.activePlayer = "player1";
        this.isDiceRolled = false; // Para que solo tiren una vez por turno
    }

    // Lógica del Dado: Genera 1-6 y lo suma al Ki del jugador actual
    rollDice() {
        if (this.isDiceRolled) return null; // No permite tirar dos veces

        const diceValue = Math.floor(Math.random() * 6) + 1;
        this.players[this.activePlayer].ki += diceValue;
        this.isDiceRolled = true;
        
        return diceValue;
    }

    // Verifica si el jugador tiene suficiente Ki para invocar
    canAffordSummon(cost) {
        return this.players[this.activePlayer].ki >= cost;
    }

    // Resta el Ki tras una invocación exitosa
    spendKi(amount) {
        this.players[this.activePlayer].ki -= amount;
        return this.players[this.activePlayer].ki;
    }

    // Cambia de turno y resetea el dado
    switchTurn() {
        this.activePlayer = this.activePlayer === "player1" ? "player2" : "player1";
        this.isDiceRolled = false;
        return this.activePlayer;
    }

    // Scripts/java/Controllers/gameControllers.js (Añadir al final de la clase)
receiveDamage(targetPlayer, amount) {
    const player = this.players[targetPlayer];
    player.hp -= amount;
    if (player.hp < 0) player.hp = 0;
    
    // Retorna true si el jugador ha perdido (hp = 0)
    return player.hp === 0;
}
}