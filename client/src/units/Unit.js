export default class Unit {
    constructor(type, color, name, id) {
        this.type = 'temp'
        this.moved = false
        this.attacked = false
        this.name = ''
        this.id = id
        this.color = color
        this.x = 0
        this.y = 0

        switch(this.type) {
            default:
                this.hp = 10
                this.firepower = 5
                this.armor = 0
        }
    }
    setCoords(x, y) {
        this.x = x
        this.y = y
    }
    render(ctx) {
        // for now there is only a single generic unit
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(
            this.x + 16, // circles drawn from center
            this.y + 16, // circles are drawn from center
            16, //assuming a 32x32 px sprite is used
            0,
            2 * Math.PI
        )
        ctx.fill()
    }
}