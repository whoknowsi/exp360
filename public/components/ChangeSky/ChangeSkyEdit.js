import { NormalizeAngleInRadians } from "../helper.js"

let camera = document.querySelector("#camera")
let x, y, z
let cursor = document.querySelector("#raycaster-mouse-edit")
let startPoint
let currentPoint
let innerWidth, innerHeight
let currentOrigin
let target
let arrowContainer
let distance
let origin
let structureContainer = document.querySelector("#structure-container")
let structureContainerRawPosition = structureContainer.getAttribute("position")
let structureContainerPosition
let newPositionTarget
let newPositionArrow

export function EditSky(id) {
    let scene = document.querySelector("#scene")
    target = document.querySelector("#" + id)
    structureContainerPosition = new THREE.Vector3(structureContainerRawPosition.x, structureContainerRawPosition.y, structureContainerRawPosition.z)
    origin = new THREE.Vector3(target.object3D.position.x, target.object3D.position.y, target.object3D.position.z)
    let currentOrigin = new THREE.Vector3(origin.x + structureContainerPosition.x, origin.y + structureContainerPosition.y, origin.z + structureContainerPosition.z)
    let arrowDirectionX = new THREE.Vector3(90,0,0)
    let arrowDirectionY = new THREE.Vector3(0,90,0)
    let arrowDirectionZ = new THREE.Vector3(0,0,90)

    arrowContainer = document.createElement("a-entity")
    arrowContainer.setAttribute("id", "arrow-container")
    arrowContainer.setAttribute("position", currentOrigin)

    let vector0 = new THREE.Vector3(0,0,0)

    x = CreateMovementArrow("red", vector0, arrowDirectionX)
    y = CreateMovementArrow("green", vector0, arrowDirectionY)
    z = CreateMovementArrow("blue", vector0, arrowDirectionZ)

    cursor.addEventListener("mousedown", OnMouseDown)
    cursor.addEventListener("mouseup", OnMouseUp)

    arrowContainer.appendChild(x)
    arrowContainer.appendChild(y)
    arrowContainer.appendChild(z)
    scene.appendChild(arrowContainer)
}

export function FinishEdit() {
    let arrowContainer = document.querySelector("#arrow-container")
    arrowContainer.remove()
}

function CreateMovementArrow(color, origin, direction) {
    let arrow = document.createElement("a-entity")
    arrow.setAttribute("geometry", "primitive", "cylinder")
    arrow.setAttribute("material", "color", color)
    arrow.setAttribute("geometry", "radius", .01)
    arrow.setAttribute("geometry", "height", .5)
    arrow.setAttribute("rotation", direction)
    arrow.setAttribute("position", (origin.x + .25 * Math.sin(direction.z)) + " " + (origin.y + .25 * Math.sin(direction.y) ) + " " + (origin.z + .25 * Math.sin(direction.x)))
    // arrow.setAttribute("line", "color", color)
    // arrow.setAttribute("line", "start", origin)
    // arrow.setAttribute("line", "end", direction)
    arrow.setAttribute("class", "positionModifierArrow")
    return arrow
}

var OnMouseDown = function(evt) {

    cursor = document.querySelector("#raycaster-mouse-edit")
    let raycaster = cursor.components.raycaster
    let intersection = raycaster.getIntersection(x)
    if(intersection == null) { intersection = raycaster.getIntersection(y) }
    if(intersection == null) { intersection = raycaster.getIntersection(z) }
    if(intersection == null) { return }
    distance = intersection.distance
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    camera.setAttribute("look-controls", "enabled", false)
    intersection.object.el.setAttribute("material", "color", "#" + randomColor)
    intersection.object.el.setAttribute("draggin-element", "")
    document.addEventListener("mousemove", OnMouseMove)
    document.addEventListener("resize", OnResize)
}

var OnMouseUp = function() {
    camera.setAttribute("look-controls", "enabled", "true")
    startPoint = null
    currentOrigin = null
    cursor.removeEventListener("onmousedown", OnMouseDown)
    cursor.removeEventListener("onmouseup", OnMouseUp)
    document.removeEventListener("mousemove", OnMouseMove)
    document.removeEventListener("resize", OnResize)
    x.removeAttribute("draggin-element")
    y.removeAttribute("draggin-element")
    z.removeAttribute("draggin-element")

    // let targetHeight = target.getAttribute("height")
    // target.setAttribute("position", finalPositionTarget)
    // structureContainer.setAttribute("position", (-finalPositionTarget.x) + " " + (-finalPositionTarget.y + targetHeight/2) + " " + (-finalPositionTarget.z))
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


AFRAME.registerComponent('draggin-element', {
    tick: function () {
        let rotation = this.el.getAttribute("rotation") 
        let cameraRotation =  camera.getAttribute("rotation")
        if(startPoint == null) { return }
        if(currentOrigin == null) {
            origin = new THREE.Vector3(target.object3D.position.x, target.object3D.position.y, target.object3D.position.z)
            currentOrigin = new THREE.Vector3(origin.x + structureContainerPosition.x, origin.y + structureContainerPosition.y, origin.z + structureContainerPosition.z)
        }

        let mouseDragginDiff = {
            x: -((currentPoint.x - startPoint.x) / innerWidth) * distance * 2,
            y: +((currentPoint.y - startPoint.y) / innerHeight) * distance * 2
        }

        

        let sign = (cameraRotation.x / Math.abs(cameraRotation.x))

        newPositionArrow = {
            x: -(currentOrigin.x + (mouseDragginDiff.x * Math.cos(NormalizeAngleInRadians(cameraRotation.y)) + sign * mouseDragginDiff.y * Math.sin(NormalizeAngleInRadians(cameraRotation.y))) * Math.sin(NormalizeAngleInRadians(rotation.z))),
            y: -(currentOrigin.y + (mouseDragginDiff.y * Math.sin(NormalizeAngleInRadians(rotation.y)))),
            z: -(currentOrigin.z + (mouseDragginDiff.y * Math.cos(NormalizeAngleInRadians(cameraRotation.y)) * sign - mouseDragginDiff.x * Math.sin(NormalizeAngleInRadians(cameraRotation.y))) * Math.sin(NormalizeAngleInRadians(rotation.x)))  
        }

        let targetHeight = target.getAttribute("height")
        newPositionTarget = {
            x: -newPositionArrow.x - structureContainerPosition.x,
            y: -newPositionArrow.y - structureContainerPosition.y ,
            z: -newPositionArrow.z - structureContainerPosition.z
        }

        structureContainer.setAttribute("position", (-newPositionTarget.x) + " " + (-newPositionTarget.y + targetHeight/2) + " " + (-newPositionTarget.z))
        target.setAttribute("position", newPositionTarget)
        arrowContainer.setAttribute("position", newPositionArrow)
    }
});