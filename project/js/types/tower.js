export class Tower {
    constructor(uid, dbRef, x, y) {
        this.uid = uid;
        this.dbRef = dbRef; 
        this.x = x;
        this.y = y;
        this.cooldownTimer = 0;
        this.maxHp = dbRef.hp || 100;
        this.currentHp = this.maxHp;
    }

    canShoot() {
        return this.cooldownTimer <= 0;
    }

    takeDamage(amount) {
        this.currentHp -= amount;
        return this.currentHp <= 0;
    }

    resetCooldown() {
        this.cooldownTimer = this.dbRef.cooldown;
    }

    update(deltaTime) {
        if (this.cooldownTimer > 0) {
            this.cooldownTimer -= deltaTime;
        }
    }
}
