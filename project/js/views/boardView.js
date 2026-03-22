export const BoardView = {
    renderGrid(board, containerId) {
        const container = document.getElementById(containerId);
        
        container.querySelectorAll('.grid-cell').forEach(c => c.remove());
        
        for (let y = 0; y < board.rows; y++) {
            for (let x = 0; x < board.cols; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                if (board.isPathCell(x, y)) {
                    cell.style.backgroundColor = 'var(--color-neon-green)'; 
                    cell.style.backgroundImage = 'repeating-linear-gradient(45deg, #000 0, #000 10px, transparent 10px, transparent 20px)';
                    cell.style.border = '2px solid white';
                }
                cell.dataset.x = x;
                cell.dataset.y = y;
                container.appendChild(cell);
            }
        }
    },
    
    renderEntities(board, enemies, projectiles, player) {
        const layer = document.getElementById('entities-layer');
        if (!layer) return;
        
        const cellW = 100 / 8; 
        const cellH = 100 / 8; 
        
        const currentIds = new Set();
        
        const baseId = 'player-kame-base';
        currentIds.add(baseId);
        let baseEl = document.getElementById(baseId);
        if (!baseEl) {
            baseEl = document.createElement('div');
            baseEl.id = baseId;
            baseEl.className = 'unit-token unit-p1';
            baseEl.style.position = 'absolute';
            baseEl.style.backgroundImage = `url(assets/sprites/kame_house.png)`;
            baseEl.style.borderRadius = '0'; 
            baseEl.style.pointerEvents = 'none';
            baseEl.style.zIndex = '5';
            
            const hpContainer = document.createElement('div');
            hpContainer.className = 'hp-bg';
            
            const hpFill = document.createElement('div');
            hpFill.id = `${baseId}-hp`;
            hpFill.className = 'hp-fill';
            hpContainer.appendChild(hpFill);
            baseEl.appendChild(hpContainer);
            
            layer.appendChild(baseEl);
        }
        
        const endNode = board.path[board.path.length - 1];
        const baseScale = 1.6;
        const baseOffset = (1 - baseScale) / 2;
        
        baseEl.style.left = `${endNode.x * cellW + (cellW * baseOffset)}%`;
        baseEl.style.top = `${endNode.y * cellH + (cellH * baseOffset)}%`;
        baseEl.style.width = `${cellW * baseScale}%`;
        baseEl.style.height = `${cellH * baseScale}%`;
        baseEl.style.zIndex = '15';
        baseEl.style.boxShadow = '12px 12px 0px var(--color-neon-pink)'; 
        baseEl.style.border = '4px solid white';
        
        const baseHpFill = document.getElementById(`${baseId}-hp`);
        if (baseHpFill && player) {
            const hpPct = Math.max(0, (player.lives / 20) * 100);
            baseHpFill.style.width = `${hpPct}%`;
            baseHpFill.style.backgroundColor = hpPct > 50 ? '#00ff66' : hpPct > 20 ? '#ffbe0b' : '#ff0055';
        }

     
        board.towers.forEach(t => {
            currentIds.add(t.uid);
            let el = document.getElementById(t.uid);
            if (!el) {
                el = document.createElement('div');
                el.id = t.uid;
                el.className = 'unit-token unit-p1';
                el.style.position = 'absolute';
                el.style.backgroundImage = `url(${t.dbRef.sprite})`;
                el.style.cursor = 'pointer';

                const hpContainer = document.createElement('div');
                hpContainer.className = 'hp-bg';
                
                const hpFill = document.createElement('div');
                hpFill.id = `${t.uid}-hp`;
                hpFill.className = 'hp-fill';
                hpContainer.appendChild(hpFill);
                
                el.appendChild(hpContainer);
                
       
                el.addEventListener('dblclick', () => {
                    document.dispatchEvent(new CustomEvent('sellTower', { detail: t.uid }));
                });

                layer.appendChild(el);
            }
            el.style.left = `${t.x * cellW}%`;
            el.style.top = `${t.y * cellH}%`;
            el.style.width = `${cellW}%`;
            el.style.height = `${cellH}%`;
            
            const hpFill = document.getElementById(`${t.uid}-hp`);
            if (hpFill) {
                const hpPct = Math.max(0, (t.currentHp / t.maxHp) * 100);
                hpFill.style.width = `${hpPct}%`;
                hpFill.style.backgroundColor = hpPct > 50 ? '#00ff66' : hpPct > 20 ? '#ffbe0b' : '#ff0055';
            }
        });

        enemies.forEach(e => {
            currentIds.add(e.uid);
            let el = document.getElementById(e.uid);
            if (!el) {
                el = document.createElement('div');
                el.id = e.uid;
                el.className = 'unit-token unit-p2 enemy-bob';
                el.style.position = 'absolute';
                el.style.backgroundImage = `url(${e.dbRef.sprite})`;
                
                const hpContainer = document.createElement('div');
                hpContainer.className = 'hp-bg';
                
                const hpFill = document.createElement('div');
                hpFill.id = `${e.uid}-hp`;
                hpFill.className = 'hp-fill';
                hpContainer.appendChild(hpFill);
                
                el.appendChild(hpContainer);
                layer.appendChild(el);
            }
            
            const isBoss = e.dbRef.id === "e_boss";
            const scaleFactor = isBoss ? 1.6 : 0.8; 
            const offset = (1 - scaleFactor) / 2;
            
            el.style.left = `${e.x * cellW + (cellW * offset)}%`;
            el.style.top = `${e.y * cellH + (cellH * offset)}%`;
            el.style.width = `${cellW * scaleFactor}%`;
            el.style.height = `${cellH * scaleFactor}%`;
            el.style.zIndex = isBoss ? '20' : '10';
            
            if (isBoss) {
                el.style.boxShadow = '12px 12px 0px var(--color-neon-green)'; 
            }
            
            const hpFill = document.getElementById(`${e.uid}-hp`);
            if (hpFill) {
                const hpPct = Math.max(0, (e.currentHp / e.maxHp) * 100);
                hpFill.style.width = `${hpPct}%`;
                hpFill.style.backgroundColor = hpPct > 50 ? '#00ff66' : hpPct > 20 ? '#ffbe0b' : '#ff0055';
            }
        });
        
        projectiles.forEach((p) => {
             currentIds.add(p.uid);
             
             let el = document.getElementById(p.uid);
             if (!el) {
                 el = document.createElement('div');
                 el.id = p.uid;
                 el.className = 'projectile';
                 el.style.position = 'absolute';
                 el.style.fontSize = '24px';
                 el.style.fontWeight = '900';
                 el.style.fontFamily = 'Bangers, cursive';
                 el.style.color = '#fffb00'; 
                 el.style.textShadow = '3px 3px 0px #000';
                 el.style.webkitTextStroke = '1px black';
                 el.style.display = 'flex';
                 el.style.justifyContent = 'center';
                 el.style.alignItems = 'center';
                 el.innerText = 'BAM!'; 
                 el.style.transform = 'translate(-50%, -50%) rotate(-15deg)';
                 layer.appendChild(el);
             }
             
             const progress = 1 - (p.life / p.maxLife);
             const currentX = p.sx + (p.tx - p.sx) * progress;
             const currentY = p.sy + (p.ty - p.sy) * progress;
             
             el.style.left = `${currentX * cellW + cellW/2}%`;
             el.style.top = `${currentY * cellH + cellH/2}%`;
        });
        
        Array.from(layer.children).forEach(child => {
            if (!currentIds.has(child.id)) {
                child.remove();
            }
        });
    }
};
