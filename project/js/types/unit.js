// js/types/unit.js

export class Unit {
    constructor(uid, owner, cardRef, x, y) {
        this.uid = uid; // Unique ID para el renderizado DOM
        this.owner = owner; // 'p1' o 'p2'
        this.cardRef = cardRef; // Referencia estática a los stats de la carta
        this.x = x;
        this.y = y;
        this.currentHp = cardRef.hp;
        this.maxHp = cardRef.hp;
        this.hasAttackedThisTurn = false;
    }

    takeDamage(amount) {
        this.currentHp -= amount;
        if (this.currentHp < 0) this.currentHp = 0;
        return this.currentHp === 0; // True si muere
    }
}
