import { StartDragginElement, LoseFocus, HasTarget, GetTargetId, IsDraggin } from "./ElementMovement.js"

let cursor = document.querySelector("#raycaster-mouse-edit")
let camera = document.querySelector("#camera")
let cameraRotation = camera.getAttribute("rotation")
let startCamRotationX, startCamRotationY
const delta = 6;

export function StartRaycastingStructures() {
    cursor.addEventListener("mousedown", OnMouseDown)
    cursor.addEventListener("mouseup", OnMouseUp)
}

var OnMouseDown = function() {
    startCamRotationX = cameraRotation.x
    startCamRotationY = cameraRotation.y
}

var OnMouseUp = function() {
    let userClick = CheckIfUserClick()
    if(userClick) { 
        let raycaster = cursor.components.raycaster
        let intersection = raycaster.intersectedEls[0]

        if(IsDraggin()) { return }

        if(intersection == undefined && HasTarget()) { 
            LoseFocus()
            return
        } else if (intersection == undefined) {
            return
        }
        

        let id = intersection.getAttribute("id")
        if(GetTargetId() == id) { return }
        if(HasTarget()) { LoseFocus() }

        StartDragginElement(id)

        // cursor.removeEventListener("mousedown", OnMouseDown)
        // cursor.removeEventListener("mouseup", OnMouseUp)
    }
}


function CheckIfUserClick() {
    const diffX = Math.abs(cameraRotation.x - startCamRotationX);
    const diffY = Math.abs(cameraRotation.y - startCamRotationY);
    return (diffX < delta && diffY < delta)
}


var OnMouseMove = function(evt) {
    if(startPoint == null) {
        startPoint = {
            x: evt.clientX,
            y: evt.clientY
        }
        innerWidth = window.innerWidth
        innerHeight = window.innerHeight
    }
    currentPoint = {
        x: evt.clientX,
        y: evt.clientY
    }
}

function CreateMovementArrow(color, origin, direction) {
    let arrow = document.createElement("a-entity")
    arrow.setAttribute("geometry", "primitive", "cylinder")
    arrow.setAttribute("material", "color", color)
    arrow.setAttribute("geometry", "radius", .01)
    arrow.setAttribute("geometry", "height", .5)
    arrow.setAttribute("rotation", direction)
    arrow.setAttribute("position", (origin.x + .25 * Math.sin(direction.z)) + " " + (origin.y + .25 * Math.sin(direction.y) ) + " " + (origin.z + .25 * Math.sin(direction.x)))
    arrow.setAttribute("class", "positionModifierArrow")
    return arrow
}
