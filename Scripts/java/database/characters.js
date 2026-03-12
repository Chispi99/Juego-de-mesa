import { CharacterClass } from "../characterClass.js";

export const CHARACTERS_LIST = [
    new CharacterClass(
        "char_01", 
        "Guerrero Z", 
        3,          // Coste de Ki
        15,         // Ataque
        100,        // Vida
        2,          // Velocidad
        "https://cdn-icons-png.flaticon.com"
    ),
    new CharacterClass(
        "char_02", 
        "Ninja Renegado", 
        2, 
        10, 
        80, 
        4, 
        "https://cdn-icons-png.flaticon.com"
    )
];