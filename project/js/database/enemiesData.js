
export const ENEMIES_DB = {
    "gnome": {
        id: "e_gnome",
        name: "Zetsus Blancos",
        hp: 15,
        speed: 0.6, 
        armor: 0, 
        damage: 5,
        baseDamage: 1, 
        reward: 5,
        sprite: "assets/sprites/zetsu.png"
    },
    "orc": {
        id: "e_orc",
        name: "Pacifista (PX-0)",
        hp: 100,
        speed: 0.3,
        armor: 5, 
        damage: 15,
        baseDamage: 4, 
        reward: 15,
        sprite: "assets/sprites/pacifista.png"
    },
    "swarm": {
        id: "e_swarm",
        name: "Cuervos de Itachi",
        hp: 5,
        speed: 1.0, 
        armor: 0,
        damage: 2,
        baseDamage: 1, 
        reward: 2,
        sprite: "assets/sprites/itachi_crow.png"
    },
    "boss": {
        id: "e_boss",
        name: "Célula Perfecto",
        hp: 350,
        speed: 0.15,
        armor: 12,
        damage: 50,
        baseDamage: 15, 
        reward: 60,
        sprite: "assets/sprites/perfect_cell.png"
    },
    "ninja": {
        id: "e_ninja",
        name: "Sonic (Veloc. Monstruosa)",
        hp: 12,
        speed: 1.4,
        armor: 0,
        damage: 8,
        baseDamage: 2, 
        reward: 8,
        sprite: "assets/sprites/sonic_ninja.png"
    },
    "ghost": {
        id: "e_ghost",
        name: "Titanes Puros",
        hp: 40,
        speed: 0.5,
        armor: 15,
        damage: 25,
        baseDamage: 8, 
        reward: 20,
        sprite: "assets/sprites/pure_titan.png"
    }
};

export const WAVES_CONFIG = [
    [...Array(10).fill("gnome"), "boss"],
    ["gnome", "ninja", "gnome", "ninja", "ninja", "gnome", "swarm", "swarm", "boss"],
    ["orc", "ninja", "gnome", "orc", "swarm", "swarm", "orc", "ninja", "boss"],
    ["orc", "ninja", "orc", "swarm", "ghost", "ninja", "orc", "orc", "ghost", "boss"],
    ["ghost", "ghost", "ninja", "ninja", "ghost", "swarm", "orc", "ghost", "boss", "boss"]
];
