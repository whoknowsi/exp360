import { ChangeTargetEditRaycasterMouse } from "../raycaster-listener.js"

let startPoint, currentPoint
let innerWidth, innerHeight
let startCameraRotation, currentCameraRotation
let cameraRotation = document.querySelector("#camera").getAttribute("rotation")
let scene = document.querySelector("#scene")
let structureContainer =  document.querySelector("#structure-container")
let structureContainerPosition = structureContainer.getAttribute("position")
let infoContainer, dialogSpot
var normal

export function StartInfoSpotCreation(intersection) {
    normal = intersection.face.normal
    document.addEventListener("mousemove", OnMouseMove)
    startCameraRotation = {
        horizontal: cameraRotation.y,
        vertical: cameraRotation.x
    }
    CreateLine(intersection)
}

export function LineCreated() {
    let line = document.querySelector("#info-line")
    return line != null
}

export function SetInfoPointDialog() {

    let settingLine = document.querySelector("#info-line")
    let start = settingLine.getAttribute("line").start
    let end = settingLine.getAttribute("line").end

    let relativeStart = new THREE.Vector3(start.x - structureContainerPosition.x, start.y - structureContainerPosition.y, start.z - structureContainerPosition.z)
    let relativeEnd = new THREE.Vector3(end.x - structureContainerPosition.x, end.y - structureContainerPosition.y, end.z - structureContainerPosition.z)

    settingLine.remove()

    infoContainer = document.createElement("a-entity")
    let id = "info-spot-" + Date.now()
    infoContainer.setAttribute("id", id)
    let line = document.createElement("a-entity")
    line.setAttribute("line", "start", relativeStart)
    line.setAttribute("line", "end", relativeEnd)
    line.setAttribute("line", "color", "white")
    line.setAttribute("line", "opacity", ".99")

    document.removeEventListener("mousemove", OnMouseMove)

    infoContainer.appendChild(line)
    structureContainer.appendChild(infoContainer)


    SetDialog(relativeEnd)

}

function SetDialog(point) {
    CreateDialogeSpotPoint(point)
    ShowPanel()
}

function ShowPanel() {
    let dialogBox = document.querySelector(".infoPanelSetting")
    dialogBox.style.visibility = "visible"
}

export function SaveData() {
    let title = document.querySelector("#infoPanelSettingTitle").value
    let description = document.querySelector("#infoPanelSettingDescription").value

    dialogSpot.setAttribute("info-spot", "title: " + title + "; description: " + description)
    ClosePanel()
}

export function CancelCreation() {
    ClosePanel()
    infoContainer.remove()
}

function ClosePanel() {
    let dialogBox = document.querySelector(".infoPanelSetting")
    dialogBox.style.visibility = "hidden"
    ChangeTargetEditRaycasterMouse(".positionModifierArrow")
}

function CreateDialogeSpotPoint(point) {
    dialogSpot = document.createElement("a-image")
    dialogSpot.setAttribute("src", "#infoSpot-img")
    dialogSpot.setAttribute("geometry", "primitive", "circle")
    dialogSpot.setAttribute("geometry", "radius", ".1")
    dialogSpot.setAttribute("position", (point.x + (normal.x * .1)) + " " + (point.y + (normal.y * .1)) + " " + (point.z + (normal.z * .1)))
    dialogSpot.setAttribute("class", "infoSpotPointer")
    dialogSpot.setAttribute("info-spot", "")

    infoContainer.appendChild(dialogSpot)
}

function CreateLine(intersection) {
    let line = document.createElement("a-entity")
    line.setAttribute("id", "info-line")
    line.setAttribute("line", "color", "white")
    line.setAttribute("line", "start", intersection.point)
    line.setAttribute("line", "end", (intersection.point.x + intersection.face.normal.x) + " " + (intersection.point.y + intersection.face.normal.y) + " " + (intersection.point.z + intersection.face.normal.z))
    line.setAttribute("setting-line", "")
    scene.appendChild(line)
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
    currentCameraRotation = {
        horizontal: cameraRotation.y,
        vertical: cameraRotation.x
    }

    // var mouse = new THREE.Vector2();
    // let canvas = document.querySelector(".a-canvas")
    // var rect = canvas.getBoundingClientRect();

    // mouse.x = ( (evt.clientX - rect.left) / rect.width ) * 2 - 1;
    // mouse.y = - ( (evt.clientY - rect.top) / rect.height ) * 2 + 1;

    // DESPUÉS HACER QUE EL FINAL DE LA LINEA SEA IGUAL A LA POSICIÓN DEL PUNTERO
    
}

AFRAME.registerComponent('setting-line', {
    tick: function () {

        if(startPoint == null ) { return }

        let targetPoint = this.el.getAttribute("line").start
        let mouseDragginDiff = {
            x: ((currentPoint.x - startPoint.x) / innerWidth) * 2,
            y: -((currentPoint.y - startPoint.y) / innerHeight) * 2
        }

        let cameraRotationDiff = {
            horizontal: currentCameraRotation.horizontal - startCameraRotation.horizontal,
            vertical: currentCameraRotation.vertical - startCameraRotation.vertical
        }
        
        let end = (targetPoint.x + normal.x * (1 + mouseDragginDiff.x)) + " " + (targetPoint.y + normal.y * (1 + mouseDragginDiff.y)) + " " + (targetPoint.z + normal.z * (1 + mouseDragginDiff.x))
        this.el.setAttribute("line", "end", end)
        
    }
});