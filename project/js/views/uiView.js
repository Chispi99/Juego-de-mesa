// js/views/uiView.js
export const UIView = {
    updatePlayerStats(player) {
        document.getElementById('p1-hp').textContent = player.lives;
        document.getElementById('p1-gold').textContent = player.gold;
    },
    
    updateWaveInfo(waveIndex, isPlaying) {
        const counterStr = document.getElementById('wave-counter');
        if (counterStr) counterStr.textContent = waveIndex + 1;
        
        const ind = document.getElementById('turn-indicator');
        const header = document.getElementById('turn-header');
        
        if (ind && header) {
            if (isPlaying) {
                ind.textContent = `Defendiendo`;
                header.style.color = "#ffffff"; // Blanco absoluto para contrastar
                header.style.animation = "blinkText 1s infinite";
            } else {
                ind.textContent = `Preparación`;
                header.style.color = "var(--color-text-main)";
                header.style.animation = "none";
            }
        }
    },
    
    showToast(message) {
        const msg = document.createElement('div');
        msg.textContent = message;
        msg.style.position = "absolute";
        msg.style.top = "50%";
        msg.style.left = "50%";
        msg.style.transform = "translate(-50%, -50%)";
        msg.style.padding = "20px 40px";
        msg.style.backgroundColor = "rgba(0,0,0,0.9)";
        msg.style.border = "2px solid var(--color-neon-green)";
        msg.style.color = "#fff";
        msg.style.fontFamily = "var(--font-anime)";
        msg.style.fontSize = "1.5rem";
        msg.style.zIndex = "100";
        msg.style.borderRadius = "8px";
        msg.style.pointerEvents = "none";
        
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 1500);
    }
};
