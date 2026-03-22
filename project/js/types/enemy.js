export class Enemy {
    constructor(uid, dbRef, path, waveMultiplier = 1.0) {
        this.uid = uid;
        this.dbRef = dbRef;
        
        this.maxHp = dbRef.hp * waveMultiplier;
        this.currentHp = this.maxHp;
        
        this.speed = dbRef.speed * (1 + ((waveMultiplier - 1) * 0.4)); 
        this.baseSpeed = this.speed; 
        this.slowTimer = 0;
        
        this.armor = Math.floor(dbRef.armor * waveMultiplier);
        this.reward = Math.floor(dbRef.reward * waveMultiplier);
        
        this.path = path;
        this.currentWaypoint = 0;
        
        this.attackDamage = Math.floor((dbRef.damage || 5) * waveMultiplier);
        this.attackCooldown = 1.0;
        this.attackTimer = 0;
        
        this.x = path[0].x;
        this.y = path[0].y;
    }

    takeDamage(amount, towerType) {
        if (towerType === 'freeze') {
            this.slowTimer = 1.5; 
            amount = Math.max(1, amount); 
        } else if (towerType === 'pierce') {
            const effectiveArmor = Math.floor(this.armor / 2);
            amount = Math.max(1, amount - effectiveArmor);
        } else if (towerType === 'aoe') {
            amount = Math.max(1, amount); 
        } else {
            amount = Math.max(1, amount - this.armor); 
        }
        
        this.currentHp -= amount;
        return this.currentHp <= 0;
    }

    update(deltaTime) {
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
        }

        if (this.currentWaypoint >= this.path.length - 1) return true; 
        const target = this.path[this.currentWaypoint + 1];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        let currentRealSpeed = this.baseSpeed;
        if (this.slowTimer > 0) {
            this.slowTimer -= deltaTime;
            currentRealSpeed = this.baseSpeed * 0.4; 
        }
        
        const moveStep = currentRealSpeed * deltaTime;

        if (dist <= moveStep) {
            this.x = target.x;
            this.y = target.y;
            this.currentWaypoint++;
        } else {
            this.x += (dx / dist) * moveStep;
            this.y += (dy / dist) * moveStep;
        }
        
        return false; 
    }
}
