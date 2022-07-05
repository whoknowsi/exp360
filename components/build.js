import { NormalizeAngleInRadians, CreateFirstPoint, CreateFloor } from "./helper.js"

const delta = 6;
let startCamRotationX, startCamRotationY;
let raycaster
let pi = Math.PI
let camera, cameraRotation
let buttonFloor = document.querySelector(".floor")
let point1, point2, point1Degree, alpha, point2Degree

buttonFloor.addEventListener("click", () => {
    let query = document.querySelectorAll(".structureTarget")
    for (let i = 0; i < query.length; i++) {

        const item = query[i];
        item.addEventListener('mousedown', OnMouseDown)
        item.addEventListener('mouseup', OnMouseUp)
    }
})

var OnMouseDown = function()  {
    camera = document.querySelector("#camera")
    cameraRotation = camera.getAttribute("rotation")

    startCamRotationX = cameraRotation.x
    startCamRotationY = cameraRotation.y
}

var OnMouseUp = function(event) {
    camera = document.querySelector("#camera")
    cameraRotation = camera.getAttribute("rotation")

    const diffX = Math.abs(cameraRotation.x - startCamRotationX);
    const diffY = Math.abs(cameraRotation.y - startCamRotationY);

    let raycasterEdit = document.querySelector("#cursor-edit")
    raycaster = raycasterEdit.components.raycaster
    let userClick = (diffX < delta && diffY < delta)
    if(userClick) {
        OnMouseClick(event)
    }
}

function OnMouseClick(event) {
    let camera = document.querySelector("#camera")
    let cameraRotation = camera.getAttribute("rotation")

    let distance = raycaster.getIntersection(event.target).distance
    let cameraRotationHorizontal = NormalizeAngleInRadians(cameraRotation.y)
    let cameraRotationVertical = NormalizeAngleInRadians(cameraRotation.x)
    let distancesOriginFloorToPoint = Math.abs(distance * Math.sin((pi / 2) - cameraRotationVertical))

    if (point1 == undefined) {
        point1 = distancesOriginFloorToPoint
        point1Degree = cameraRotationHorizontal

        CreateFirstPoint(event)
    }
    else if (point2 == undefined) {
        point2 = distancesOriginFloorToPoint
        point2Degree = cameraRotationHorizontal

        CreateFloor(point1, point2, point1Degree, point2Degree)

        UnsuscribeFromEvents()
        CleanVariables()
    }
}

function UnsuscribeFromEvents() {
    let query = document.querySelectorAll(".structureTarget")
    for (let i = 0; i < query.length; i++) {
        const item = query[i];

        item.removeEventListener('mousedown', OnMouseDown)
        item.removeEventListener('mouseup', OnMouseUp)
    }
}


function CleanVariables() {
    point1 = undefined
    point2 = undefined
}