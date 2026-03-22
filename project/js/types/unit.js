
export class Unit {
    constructor(uid, owner, cardRef, x, y) {
        this.uid = uid; 
        this.owner = owner; 
        this.cardRef = cardRef; 
        this.x = x;
        this.y = y;
        this.currentHp = cardRef.hp;
        this.maxHp = cardRef.hp;
        this.hasAttackedThisTurn = false;
    }

    takeDamage(amount) {
        this.currentHp -= amount;
        if (this.currentHp < 0) this.currentHp = 0;
        return this.currentHp === 0; 
    }
}
