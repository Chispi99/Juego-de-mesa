import { Board } from '../types/board.js';
import { Player } from '../types/player.js';
import { Enemy } from '../types/enemy.js';
import { ENEMIES_DB, WAVES_CONFIG } from '../database/enemiesData.js';
import { TOWERS_DB } from '../database/towersData.js';
import { BoardView } from '../views/boardView.js';
import { UIView } from '../views/uiView.js';

export const EngineController = {
    board: null,
    player: null,
    enemies: [],
    projectiles: [],
    
    gameState: 'PREP', 
    currentWaveIndex: 0,
    waveQueue: [],
    spawnTimer: 0,
    
    lastTime: 0,
    animFrameId: null,

    init() {
        this.board = new Board(8, 8);
        this.player = new Player();
        
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    },

    startNextWave() {
        if (this.gameState === 'PLAYING') return;
        if (this.currentWaveIndex >= WAVES_CONFIG.length) {
            alert("¡Has ganado el juego! Todas las oleadas superadas.");
            return;
        }
        
        this.gameState = 'PLAYING';
        this.waveQueue = [...WAVES_CONFIG[this.currentWaveIndex]];
        this.spawnTimer = 2.0;
        
        UIView.updateWaveInfo(this.currentWaveIndex, true);
        UIView.showToast(`¡Oleada ${this.currentWaveIndex + 1} Iniciada!`);
    },

    loop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        if (this.gameState === 'PLAYING') {
            this.update(deltaTime);
        }
        
        this.render();
        
        this.projectiles = this.projectiles.filter(p => {
            p.life -= deltaTime;
            return p.life > 0;
        });

        this.animFrameId = requestAnimationFrame((time) => this.loop(time));
    },

    update(deltaTime) {
        if (this.waveQueue.length > 0) {
            this.spawnTimer -= deltaTime;
            if (this.spawnTimer <= 0) {
                const enemyKey = this.waveQueue.shift();
                const dbRef = ENEMIES_DB[enemyKey];
                
                const waveMultiplier = 1 + (this.currentWaveIndex * 0.3); 
                const newEnemy = new Enemy(`e_${Date.now()}_${Math.random()}`, dbRef, this.board.path, waveMultiplier);
                
                this.enemies.push(newEnemy);
                this.spawnTimer = 2.0; 
            }
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const reachedEnd = enemy.update(deltaTime);
            if (reachedEnd) {
                const dmgToHitsBase = enemy.dbRef.baseDamage || 1;
                this.player.lives -= dmgToHitsBase;
                this.enemies.splice(i, 1);
                UIView.updatePlayerStats(this.player);
                
                document.body.style.boxShadow = "inset 0 0 150px rgba(255,0,0,0.8)";
                setTimeout(() => document.body.style.boxShadow = "", 200);
                
                if (this.player.lives <= 0) {
                    this.gameState = 'GAMEOVER';
                    alert("¡Te han destruido la base! GAME OVER.");
                    location.reload();
                    return;
                }
            }
        }

        this.board.towers.forEach(tower => {
            tower.update(deltaTime);
            if (tower.canShoot() && this.enemies.length > 0) {
                const target = this.enemies.find(e => {
                    if (e.currentHp <= 0) return false;
                    const dist = Math.hypot(tower.x - e.x, tower.y - e.y);
                    return dist <= tower.dbRef.range;
                });

                if (target) {
                    tower.resetCooldown();
                    this.projectiles.push({ 
                        uid: `proj_${Date.now()}_${Math.random()}`,
                        sx: tower.x, sy: tower.y, 
                        tx: target.x, ty: target.y, 
                        maxLife: 0.2, life: 0.2 
                    }); 
                    
                    target.takeDamage(tower.dbRef.damage, tower.dbRef.type);
                    
                    if (tower.dbRef.type === 'aoe') {
                        this.enemies.forEach(otherEnd => {
                            if (otherEnd.uid !== target.uid && otherEnd.currentHp > 0) {
                                const distToTarget = Math.hypot(otherEnd.x - target.x, otherEnd.y - target.y);
                                if (distToTarget <= tower.dbRef.splash) {
                                    otherEnd.takeDamage(tower.dbRef.damage, tower.dbRef.type);
                                }
                            }
                        });
                    }
                }
            }
        });

        this.enemies.forEach(e => {
            if (e.attackTimer <= 0) {
                const targetTower = this.board.towers.find(t => {
                    if (t.currentHp <= 0) return false;
                    const dist = Math.hypot(t.x - e.x, t.y - e.y);
                    return dist <= 2.0; 
                });

                if (targetTower) {
                    e.attackTimer = e.attackCooldown;
                    targetTower.takeDamage(e.attackDamage);
                }
            }
        });

        this.board.towers = this.board.towers.filter(t => t.currentHp > 0);

        this.enemies = this.enemies.filter(e => {
            if (e.currentHp <= 0) {
                this.player.gold += e.dbRef.reward;
                UIView.updatePlayerStats(this.player);
                return false;
            }
            return true;
        });

        if (this.waveQueue.length === 0 && this.enemies.length === 0) {
            this.gameState = 'PREP';
            this.currentWaveIndex++;
            this.player.gold += 100; 
            UIView.updatePlayerStats(this.player);
            UIView.updateWaveInfo(this.currentWaveIndex, false);
            
            if (this.currentWaveIndex >= WAVES_CONFIG.length) {
                UIView.showToast(`Oleada final superada...`);
                setTimeout(() => alert("¡Victoria Definitiva! Has ganado todas las oleadas de Defensa."), 1500);
            } else {
                UIView.showToast(`Oleada superada. ¡Lanza los dados!`);
                setTimeout(() => {
                    import('./minigameController.js').then(module => {
                        module.MinigameController.start();
                    });
                }, 1000);
            }
        }
    },

    render() {
        BoardView.renderEntities(this.board, this.enemies, this.projectiles, this.player);
    }
};
