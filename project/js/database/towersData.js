// js/database/towersData.js

export const TOWERS_DB = [
    {
        id: "t_mg",
        name: "Death the Kid",
        type: "fast",
        cost: 20,
        hp: 100,
        damage: 4, // Buff (antes 2)
        cooldown: 0.2,
        range: 3.0, // Nerf alcance (antes 3.5)
        description: "Bajo daño pero dispara rapidísimo.",
        sprite: "assets/sprites/dt_kid.png",
        unlocked: true,
        unlockCost: 0
    },
    {
        id: "t_fire",
        name: "Roy Mustang",
        type: "aoe",
        cost: 35,
        hp: 150,
        damage: 20, // Buff considerable (antes 8)
        cooldown: 1.5,
        range: 3.0,
        splash: 1.5,
        description: "Daño en área brutal (AOE).",
        sprite: "assets/sprites/roy_mustang.png",
        unlocked: true,
        unlockCost: 0
    },
    {
        id: "t_sniper",
        name: "God Usopp",
        type: "pierce",
        cost: 50,
        hp: 200,
        damage: 60, // Francotirador letal (antes 40)
        cooldown: 3.0,
        range: 6.5, // Rango máximo
        description: "Lento, pero aniquila armaduras pesadas.",
        sprite: "assets/sprites/usopp.png",
        unlocked: false,
        unlockCost: 150
    },
    {
        id: "t_ice",
        name: "Rukia Kuchiki",
        type: "freeze",
        cost: 45,
        hp: 250,
        damage: 15, // Buff leve (antes 10)
        cooldown: 2.0,
        range: 3.5,
        description: "Bajo daño, pero congela y ralentiza.",
        sprite: "assets/sprites/rukia.png",
        unlocked: false,
        unlockCost: 200
    },
    {
        id: "t_plasma",
        name: "Genos",
        type: "aoe",
        cost: 80,
        hp: 500,
        damage: 120, // Super arma nuke (antes 25)
        cooldown: 4.0,
        range: 4.0,
        splash: 3.0, // Más salpicadura
        description: "AOE Masivo Destructor.",
        sprite: "assets/sprites/genos.png",
        unlocked: false,
        unlockCost: 300
    }
];
