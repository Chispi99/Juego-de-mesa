// js/types/enemy.js
export class Enemy {
    constructor(uid, dbRef, path, waveMultiplier = 1.0) {
        this.uid = uid;
        this.dbRef = dbRef;
        
        // Multiplicadores dinámicos por avance de oleada
        this.maxHp = dbRef.hp * waveMultiplier;
        this.currentHp = this.maxHp;
        
        this.speed = dbRef.speed * (1 + ((waveMultiplier - 1) * 0.4)); // La velocidad escala menos drásticamente que el HP
        this.baseSpeed = this.speed; // Guardamos velocidad real escalada para efectos
        this.slowTimer = 0;
        
        this.armor = Math.floor(dbRef.armor * waveMultiplier);
        this.reward = Math.floor(dbRef.reward * waveMultiplier);
        
        this.path = path;
        this.currentWaypoint = 0;
        
        // Atributos Ofensivos contra Torres
        this.attackDamage = Math.floor((dbRef.damage || 5) * waveMultiplier);
        this.attackCooldown = 1.0;
        this.attackTimer = 0;
        
        // Empezamos en el principio del path
        this.x = path[0].x;
        this.y = path[0].y;
    }

    takeDamage(amount, towerType) {
        if (towerType === 'freeze') {
            this.slowTimer = 1.5; // Congelado 1.5s
            amount = Math.max(1, amount); // Ignora armadura pero pega plano
        } else if (towerType === 'pierce') {
            const effectiveArmor = Math.floor(this.armor / 2);
            amount = Math.max(1, amount - effectiveArmor);
        } else if (towerType === 'aoe') {
            amount = Math.max(1, amount); // Fuego ignora armadura
        } else {
            amount = Math.max(1, amount - this.armor); // Fast
        }
        
        this.currentHp -= amount;
        return this.currentHp <= 0;
    }

    update(deltaTime) {
        if (this.attackTimer > 0) {
            this.attackTimer -= deltaTime;
        }

        if (this.currentWaypoint >= this.path.length - 1) return true; // Llegó al final (resta vida al jugador)

        const target = this.path[this.currentWaypoint + 1];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        let currentRealSpeed = this.baseSpeed;
        if (this.slowTimer > 0) {
            this.slowTimer -= deltaTime;
            currentRealSpeed = this.baseSpeed * 0.4; // 60% Freeze Slowdown!
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
        
        return false; // Sigue moviéndose
    }
}
