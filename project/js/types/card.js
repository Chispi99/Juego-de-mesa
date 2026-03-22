// js/types/card.js

export class Card {
    constructor(id, name, type, cost, attack, hp, range, sprite) {
        this.id = id;
        this.name = name;
        this.type = type; // "attack", "defense", "special"
        this.cost = cost;
        this.attack = attack;
        this.hp = hp;
        this.range = range; // Rango de ataque (distancia Manhattan en celdas)
        this.sprite = sprite;
    }
}
