// Definición de la clase con naming en inglés y camelCase
export class CharacterClass {
    constructor(id, name, kiCost, attack, hp, speed, sprite) {
        this.id = id;
        this.name = name;
        this.kiCost = kiCost;
        this.attack = attack;
        this.maxHp = hp;
        this.currentHp = hp;
        this.speed = speed;
        this.sprite = sprite;
    }

    // Método para recibir daño (ejemplo de lógica futura)
    takeDamage(amount) {
        this.currentHp -= amount;
        if (this.currentHp < 0) this.currentHp = 0;
    }
}