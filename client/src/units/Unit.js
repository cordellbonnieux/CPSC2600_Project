export default class Unit {
    constructor(owner, index, id, x, y) {
        this.owner = owner
        this.type = 'temp'
        this.moved = false
        this.attacked = false
        this.name = ''
        this.id = id
        this.x = x
        this.y = y
        this.eventListenerAttached = false
        this.selected = false
        this.selectable = true

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

    render(ctx, userControl = false) {
        // for now there is only a single generic unit
        ctx.beginPath()
        ctx.fillStyle = userControl ? 'blue': 'green'
        ctx.arc(
            this.x + 16, // circles drawn from center
            this.y + 16, // circles are drawn from center
            16, //assuming a 32x32 px sprite is used
            0,
            2 * Math.PI
        )
        ctx.fill()
    }

    renderSelected(ctx) {
        ctx.beginPath()
        ctx.lineWidth = '2px'
        ctx.strokeStyle = 'red'
        ctx.rect(this.x, this.y, 32, 32)
        ctx.stroke()
    }
}