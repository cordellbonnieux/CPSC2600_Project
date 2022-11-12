/*
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
*/

import { useEffect, useState } from "react"
import '../css/tiles.css'

export default function Tile(props) {
    const { tilesetnumber, tileset, tilenumber, count, vacant} = props

    return <span
            className={`tileset${tilesetnumber} tile${tilenumber}`}
    ></span>
}