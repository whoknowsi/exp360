import { StartInfoSpotCreation, LineCreated, SetInfoPointDialog } from "./InfoSpotCreation.js"

let cursor = document.querySelector("#raycaster-mouse-edit")
let camera = document.querySelector("#camera")
let cameraRotation = camera.getAttribute("rotation")
let startCamRotationX, startCamRotationY
const delta = 6;

export function StartListeningToCreateInfoSpot() {
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
        let target = raycaster.intersectedEls[0]
        if(target == null) { return }

        let intersection = raycaster.getIntersection(target)

        if(intersection == null) { return }

        if(!LineCreated()) {
            StartInfoSpotCreation(intersection)
            return
        }
            
        SetInfoPointDialog()

        cursor.removeEventListener("mousedown", OnMouseDown)
        cursor.removeEventListener("mouseup", OnMouseUp)
    }
}

function CheckIfUserClick() {
    const diffX = Math.abs(cameraRotation.x - startCamRotationX);
    const diffY = Math.abs(cameraRotation.y - startCamRotationY);
    return (diffX < delta && diffY < delta)
}