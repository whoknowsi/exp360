import { NormalizeAngleInRadians, SetBase, SetVolume, CreateCube, SetOffset } from "./helper.js"
import { ChangeTargetEditRaycaster } from "./raycaster-listener.js"

const delta = 6;
let startCamRotationX, startCamRotationY;
let raycaster
let pi = Math.PI
let buttonCube = document.querySelector(".cube")
let buttonOffset = document.querySelector(".offset")
let distance1, distance2, distance3, degree1, degree2
let offset = true
let camera = document.querySelector("#camera")
let cameraRotation = camera.getAttribute("rotation")

buttonCube.addEventListener("click", () => {
    ChangeTargetEditRaycaster(".structureTarget")
    let query = document.querySelectorAll(".structureTarget")
    for (let i = 0; i < query.length; i++) {
        const item = query[i];
        item.addEventListener('mousedown', OnMouseDown)
        item.addEventListener('mouseup', OnMouseUpCube)
    }
})

buttonOffset.addEventListener("click", () => {
    ChangeTargetEditRaycaster(".structureTarget")
    let query = document.querySelectorAll(".structureTarget")
    for (let i = 0; i < query.length; i++) {
        const item = query[i];
        item.addEventListener('mousedown', OnMouseDown)
        item.addEventListener('mouseup', OnMouseUpOffset)
    }
})

var OnMouseDown = function()  {
    camera = document.querySelector("#camera")
    cameraRotation = camera.getAttribute("rotation")

    startCamRotationX = cameraRotation.x
    startCamRotationY = cameraRotation.y
}

var OnMouseUpCube = function(event) {
    let userClick = CheckIfUserClick()
    if(userClick) {
        SetParamsCubeWhenClick(event)
    }
}

var OnMouseUpOffset = function(event) {
    let userClick = CheckIfUserClick()
    if(userClick) {
        SetParamsOffsetCubeWhenClick(event)
    }
}

function CheckIfUserClick() {
    camera = document.querySelector("#camera")
    cameraRotation = camera.getAttribute("rotation")

    const diffX = Math.abs(cameraRotation.x - startCamRotationX);
    const diffY = Math.abs(cameraRotation.y - startCamRotationY);

    let raycasterEdit = document.querySelector("#cursor-edit")
    raycaster = raycasterEdit.components.raycaster
    return (diffX < delta && diffY < delta)
}

function UnsuscribeFromEvents() {
    let query = document.querySelectorAll(".structureTarget")
    for (let i = 0; i < query.length; i++) {
        const item = query[i];

        item.removeEventListener('mousedown', OnMouseDown)
        item.removeEventListener('mouseup', OnMouseUpCube)
        item.removeEventListener('mouseup', OnMouseUpOffset)
    }
}

function CleanVariables() {
    distance1 = undefined
    distance2 = undefined
    distance3 = undefined
    offset = true
}

function SetParamsCubeWhenClick(event) {

    let distance = raycaster.getIntersection(event.target).distance
    let originPoint = raycaster.getIntersection(event.target).point
    let cameraRotationHorizontal = NormalizeAngleInRadians(cameraRotation.y)
    let cameraRotationVertical = NormalizeAngleInRadians(cameraRotation.x)
    let distancesOriginFloorToPoint = Math.abs(distance * Math.sin((pi / 2) - cameraRotationVertical))

    if (distance1 == undefined) {
        distance1 = distancesOriginFloorToPoint
        degree1 = {
            horizontal: cameraRotationHorizontal,
            vertical: cameraRotationVertical
        }

        SetBase(originPoint, distance1, degree1)
    }
    else if (distance2 == undefined) {
        distance2 = distancesOriginFloorToPoint
        degree2 = {
            horizontal: cameraRotationHorizontal,
            vertical: cameraRotationVertical
        }
        SetVolume(distance2, degree2)
    }
    else if(distance3 == undefined) {
        distance3 = distancesOriginFloorToPoint

        CreateCube()
        UnsuscribeFromEvents()
        CleanVariables()
    }
}


function SetParamsOffsetCubeWhenClick(event) {

    let distance = raycaster.getIntersection(event.target).distance
    let originPoint = raycaster.getIntersection(event.target).point
    let cameraRotationHorizontal = NormalizeAngleInRadians(cameraRotation.y)
    let cameraRotationVertical = NormalizeAngleInRadians(cameraRotation.x)
    let distancesOriginFloorToPoint = Math.abs(distance * Math.sin((pi / 2) - cameraRotationVertical))

    if (distance1 == undefined) {
        distance1 = distancesOriginFloorToPoint
        degree1 = {
            horizontal: cameraRotationHorizontal,
            vertical: cameraRotationVertical
        }

        SetBase(originPoint, distance1, degree1)
    }
    else if (distance2 == undefined) {
        distance2 = distancesOriginFloorToPoint
        degree2 = {
            horizontal: cameraRotationHorizontal,
            vertical: cameraRotationVertical
        }
        SetOffset(distance2, degree2)
    }
    else if (offset) {
        offset = false
        SetVolume(null, null)
    }
    else if(distance3 == undefined) {

        CreateCube()
        UnsuscribeFromEvents()
        CleanVariables()
    }
}
