export default class Tile {
    constructor(startx, starty, armor, move, occupied, range, vision) {
        this.startx = startx
        this.starty = starty
        this.armor = armor
        this.move = move
        this.occupied = occupied
        this.range = range
        this.vision = vision
    }
}