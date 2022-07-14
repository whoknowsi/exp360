import { NormalizeAngleInRadians } from "../helper.js"
import { RemoveDeleteButton } from "./ElementDelete.js"

let camera = document.querySelector("#camera")
let x, y, z
let cursor = document.querySelector("#raycaster-mouse-edit")
let startPoint
let currentPoint
let innerWidth, innerHeight
let targetRelativeOrigin
let target
let arrowContainer
let distance
let targetOrigin
let structureContainer = document.querySelector("#structure-container")
let structureContainerRawPosition = structureContainer.getAttribute("position")
let structureContainerPosition
let newPositionTarget
let newPositionArrow
let scene = document.querySelector("#scene")
let _id
let _originalId
let _isDraggin

export function StartDragginElement(id) {
    _originalId = id
    _id = id
    let isABoxOfAStructure = id.includes("structure-")
    if(isABoxOfAStructure) {
        _id = "container-structure-" + id.split("-")[1] 
    }
        
    
    target = document.querySelector("#" + _id)
    let arrowOrigin = GetArrowOrigin()
    CreateAndAddArrows(arrowOrigin)
}

function GetArrowOrigin() {
    structureContainerPosition = new THREE.Vector3(structureContainerRawPosition.x, structureContainerRawPosition.y, structureContainerRawPosition.z)
    targetOrigin = new THREE.Vector3(target.object3D.position.x, target.object3D.position.y, target.object3D.position.z)
    return new THREE.Vector3(targetOrigin.x + structureContainerPosition.x, targetOrigin.y + structureContainerPosition.y, targetOrigin.z + structureContainerPosition.z)
}

function CreateAndAddArrows(origin) {
    let arrowDirectionX = new THREE.Vector3(90,0,0)
    let arrowDirectionY = new THREE.Vector3(0,90,0)
    let arrowDirectionZ = new THREE.Vector3(0,0,90)

    arrowContainer = document.createElement("a-entity")
    arrowContainer.setAttribute("id", "arrow-container")
    arrowContainer.setAttribute("position", origin)

    x = CreateMovementArrow("red", arrowDirectionX)
    y = CreateMovementArrow("green", arrowDirectionY)
    z = CreateMovementArrow("blue", arrowDirectionZ)

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

export function HasTarget() {
    let arrowContainer = document.querySelector("#arrow-container")
    if(arrowContainer != null) { return true }
    return false
}

export function GetTargetId() {
    return _originalId
}

export function IsDraggin() {
    return _isDraggin
}


function CreateMovementArrow(color, direction) {
    let origin = new THREE.Vector3(0,0,0)
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

var OnMouseDown = function(evt) {
    let raycaster = cursor.components.raycaster
    let intersection = raycaster.getIntersection(x)
    if(intersection == null) { intersection = raycaster.getIntersection(y) }
    if(intersection == null) { intersection = raycaster.getIntersection(z) }
    if(intersection == null) { return }
    _isDraggin = true
    distance = intersection.distance
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    camera.setAttribute("look-controls", "enabled", false)
    intersection.object.el.setAttribute("material", "color", "#" + randomColor)
    intersection.object.el.setAttribute("draggin-element-structure", "")
    document.addEventListener("mousemove", OnMouseMove)
    document.addEventListener("resize", OnResize)
}

var OnMouseUp = function() {
    camera.setAttribute("look-controls", "enabled", "true")
    startPoint = null
    targetRelativeOrigin = null
    cursor.removeEventListener("onmousedown", OnMouseDown)
    cursor.removeEventListener("onmouseup", OnMouseUp)
    document.removeEventListener("mousemove", OnMouseMove)
    document.removeEventListener("resize", OnResize)
    x.removeAttribute("draggin-element-structure")
    y.removeAttribute("draggin-element-structure")
    z.removeAttribute("draggin-element-structure")

    setTimeout(() => {
        _isDraggin = false
    }, 100);

}

var OnResize = function() {
    innerHeight = window.innerHeight
    innerWidth = window.innerWidth
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

export function LoseFocus() {
    let arrowContainer = document.querySelector("#arrow-container")
    arrowContainer.remove()
    _originalId = null
    RemoveDeleteButton()
}


AFRAME.registerComponent('draggin-element-structure', {
    tick: function () {
        let rotation = this.el.getAttribute("rotation") 
        let cameraRotation =  camera.getAttribute("rotation")
        if(startPoint == null) { return }
        if(targetRelativeOrigin == null) {
            targetOrigin = new THREE.Vector3(target.object3D.position.x, target.object3D.position.y, target.object3D.position.z)
            targetRelativeOrigin = new THREE.Vector3(targetOrigin.x + structureContainerPosition.x, targetOrigin.y + structureContainerPosition.y, targetOrigin.z + structureContainerPosition.z)
        }

        let mouseDragginDiff = {
            x: ((currentPoint.x - startPoint.x) / innerWidth) * distance * 2,
            y: ((currentPoint.y - startPoint.y) / innerHeight) * distance * 2
        }

        let sign = (cameraRotation.x / Math.abs(cameraRotation.x))

        newPositionArrow = {
            x: targetRelativeOrigin.x + mouseDragginDiff.x * Math.sin(NormalizeAngleInRadians(rotation.z)),
            y: targetRelativeOrigin.y + mouseDragginDiff.y * Math.sin(NormalizeAngleInRadians(rotation.y)),
            z: targetRelativeOrigin.z + mouseDragginDiff.y * Math.sin(NormalizeAngleInRadians(rotation.x))
        }

        let targetHeight = target.getAttribute("height")
        newPositionTarget = {
            x: newPositionArrow.x - structureContainerPosition.x,
            y: newPositionArrow.y - structureContainerPosition.y ,
            z: newPositionArrow.z - structureContainerPosition.z
        }

        target.setAttribute("position", newPositionTarget)
        arrowContainer.setAttribute("position", newPositionArrow)
    }
});