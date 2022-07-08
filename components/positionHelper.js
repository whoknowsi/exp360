import { MapInterval } from "./helper.js"

let _targets = document.querySelectorAll(".structureTarget")
let _target
let raycaster
let minRadius = .1

export function PositionToCenterInWorld() {
    raycaster = document.querySelector("#cursor-edit").components.raycaster
    let intersection
    _targets.forEach(target => {
        if(intersection == null) {
            intersection = raycaster.getIntersection(target) 
            _target = target
        }
    });

    return intersection.point
}


export function DistanceToCenterInWorld() {
    raycaster = document.querySelector("#cursor-edit").components.raycaster
    let intersection
    _targets.forEach(target => {
        if(intersection == null) {
            intersection = raycaster.getIntersection(target) 
            _target = target
        }
    });

    return intersection.distance
}

export function ResizeDependingOnPositionRadius(distance, minRadius, maxRadius, maxDistance) {
    let radius = MapInterval(distance, 0, maxDistance, maxRadius, minRadius)
    return radius
}