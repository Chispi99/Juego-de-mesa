import { Board } from '../types/board.js';
import { Player } from '../types/player.js';
import { Enemy } from '../types/enemy.js';
import { ENEMIES_DB, WAVES_CONFIG } from '../database/enemiesData.js';
import { TOWERS_DB } from '../database/towersData.js';
import { BoardView } from '../views/boardView.js';
import { UIView } from '../views/uiView.js';

export const EngineController = {
    gameMode: '1P',
    boards: [],
    players: [],
    currentPlayerIndex: 0,
    
    enemies: [],
    projectiles: [],
    
    gameState: 'PREP', 
    currentWaveIndex: 0,
    waveQueue: [],
    spawnTimer: 0,
    
    lastTime: 0,
    animFrameId: null,

    init() {
        this.boards = [new Board(8, 8)];
        this.players = [new Player()];
        this.currentPlayerIndex = 0;
        
        BoardView.renderGrid(this.boards[0], 'grid-container-p1');
        
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    },
    
    setGameMode(mode) {
        this.gameMode = mode;
        this.boards = [new Board(8, 8)];
        this.players = [new Player()];
        
        const wrapper1 = document.getElementById('board-wrapper-p1');
        const wrapper2 = document.getElementById('board-wrapper-p2');
        
        wrapper1.classList.remove('inactive-board');
        BoardView.renderGrid(this.boards[0], 'grid-container-p1');
        
        if (mode === '2P') {
            this.boards.push(new Board(8, 8));
            this.players.push(new Player());
            wrapper2.style.display = 'flex';
            wrapper2.classList.add('inactive-board');
            BoardView.renderGrid(this.boards[1], 'grid-container-p2');
        } else {
            wrapper2.style.display = 'none';
        }
        
        this.currentPlayerIndex = 0;
        this.currentWaveIndex = 0;
        this.gameState = 'PREP';
        this.enemies = [];
        this.projectiles = [];
        this.waveQueue = [];
        
        this.updateUIForCurrentPlayer();
        UIView.updateWaveInfo(this.currentWaveIndex, false);
        UIView.showToast(`Modo ${mode} Activado`);
    },
    
    updateUIForCurrentPlayer() {
        const label = document.getElementById('player-name-label');
        if (label) {
            label.textContent = this.gameMode === '2P' ? `Tu Base (P${this.currentPlayerIndex + 1})` : `Tu Base`;
            label.style.color = this.currentPlayerIndex === 0 ? 'white' : 'var(--color-neon-pink)';
        }
        
        UIView.updatePlayerStats(this.players[this.currentPlayerIndex]);
        
        if (this.gameMode === '2P') {
            const wrapper1 = document.getElementById('board-wrapper-p1');
            const wrapper2 = document.getElementById('board-wrapper-p2');
            
            if (this.currentPlayerIndex === 0) {
                wrapper1.classList.remove('inactive-board');
                wrapper2.classList.add('inactive-board');
            } else {
                wrapper1.classList.add('inactive-board');
                wrapper2.classList.remove('inactive-board');
            }
        }
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
        const playerLabel = this.gameMode === '2P' ? ` (P${this.currentPlayerIndex + 1})` : '';
        UIView.showToast(`¡Oleada ${this.currentWaveIndex + 1} Iniciada${playerLabel}!`);
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
        const board = this.boards[this.currentPlayerIndex];
        const player = this.players[this.currentPlayerIndex];
        
        if (this.waveQueue.length > 0) {
            this.spawnTimer -= deltaTime;
            if (this.spawnTimer <= 0) {
                const enemyKey = this.waveQueue.shift();
                const dbRef = ENEMIES_DB[enemyKey];
                
                const waveMultiplier = 1 + (this.currentWaveIndex * 0.3); 
                const newEnemy = new Enemy(`e_${Date.now()}_${Math.random()}`, dbRef, board.path, waveMultiplier);
                
                this.enemies.push(newEnemy);
                this.spawnTimer = 2.0; 
            }
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const reachedEnd = enemy.update(deltaTime);
            if (reachedEnd) {
                const dmgToHitsBase = enemy.dbRef.baseDamage || 1;
                player.lives -= dmgToHitsBase;
                this.enemies.splice(i, 1);
                UIView.updatePlayerStats(player);
                
                document.body.style.boxShadow = "inset 0 0 150px rgba(255,0,0,0.8)";
                setTimeout(() => document.body.style.boxShadow = "", 200);
                
                if (player.lives <= 0) {
                    this.gameState = 'GAMEOVER';
                    const loser = this.gameMode === '2P' ? `P${this.currentPlayerIndex + 1}` : 'Jugador';
                    alert(`¡${loser} ha perdido la base! GAME OVER.`);
                    location.reload();
                    return;
                }
            }
        }

        board.towers.forEach(tower => {
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
                const targetTower = board.towers.find(t => {
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

        board.towers = board.towers.filter(t => t.currentHp > 0);

        this.enemies = this.enemies.filter(e => {
            if (e.currentHp <= 0) {
                player.gold += e.dbRef.reward;
                UIView.updatePlayerStats(player);
                return false;
            }
            return true;
        });

        if (this.waveQueue.length === 0 && this.enemies.length === 0) {
            this.gameState = 'PREP';
            player.gold += 100; 
            UIView.updatePlayerStats(player);
            
            if (this.gameMode === '2P') {
                if (this.currentPlayerIndex === 0) {
                    this.currentPlayerIndex = 1;
                    UIView.showToast(`¡Turno de P2!`);
                    this.updateUIForCurrentPlayer();
                    UIView.updateWaveInfo(this.currentWaveIndex, false);
                    return; 
                } else {
                    this.currentPlayerIndex = 0;
                    this.updateUIForCurrentPlayer();
                }
            }

            this.currentWaveIndex++;
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
        for (let i = 0; i < this.boards.length; i++) {
            const layerId = `entities-layer-p${i + 1}`;
            if (this.currentPlayerIndex === i) {
                BoardView.renderEntities(this.boards[i], this.enemies, this.projectiles, this.players[i], layerId);
            } else {
                BoardView.renderEntities(this.boards[i], [], [], this.players[i], layerId);
            }
        }
    }
};
