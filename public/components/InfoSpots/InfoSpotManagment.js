import { Height } from "../GlobalConfig.js"
import { MapInterval, NormalizeAngleInRadians } from "../helper.js"
let innerWidth, innerHeight
let point
let angleBetweenXandZ
let panel
let angleBetweenHorizontalAndY
let fov = {
    horizontal: 2,
    vertical: .8
}
let relativeAngle = 0
let structureContainerPosition = document.querySelector("#structure-container").getAttribute("position")

export function ShowPanelInfo(target, intersection, title, description, image) {

    let existPanel = document.querySelector(".infoPanel")
    if(existPanel != null) existPanel.remove()

    let targetPosition = target.getAttribute("position") 
    point = {
        x: targetPosition.x + structureContainerPosition.x,
        y: targetPosition.y + structureContainerPosition.y,
        z: targetPosition.z + structureContainerPosition.z
    }
    
    let atan = point.z/point.x
    angleBetweenXandZ = Math.atan(atan)

    if(point.z < 0 && point.x > 0) relativeAngle = - angleBetweenXandZ
    if(point.z < 0 && point.x < 0) relativeAngle = Math.PI - angleBetweenXandZ
    if(point.z > 0 && point.x < 0) relativeAngle = Math.PI - angleBetweenXandZ
    if(point.z > 0 && point.x > 0) relativeAngle = (Math.PI*2 - angleBetweenXandZ)


    angleBetweenHorizontalAndY = Math.acos((Math.sqrt(point.z*point.z + point.x*point.x))/intersection.distance)
    if(target.getAttribute("position").y >= Height) angleBetweenHorizontalAndY = -angleBetweenHorizontalAndY

    CreatePanel(title, description, image)

    document.addEventListener("mousemove", MovePanel)
}

function CreatePanel(title, description, image) {
    panel = document.createElement("div")
    panel.setAttribute("class", "infoPanel")
    
    let containsTitle = (title != "")
    if(containsTitle) {
        let titleEl = document.createElement("h2")
        titleEl.textContent = title
        panel.appendChild(titleEl)
    }

    let containsDescription = (description != "")
    if(containsDescription) {
        let descriptionEl = document.createElement("p")
        descriptionEl.textContent = description
        panel.appendChild(descriptionEl)
    }

    let containsImage = (image != "")
    if(containsImage) {
        let imageEl = document.createElement("img")
        imageEl.src = "./img/" + image
        panel.appendChild(imageEl)
    }

    MovePanel()
    document.body.appendChild(panel)
}

var MovePanel = function(){

    fov = {
        horizontal: window.innerWidth/window.innerHeight - .5,
        vertical: .8
    }   

    MoveHorizontal()
    MoveVertical()
    
}

function MoveHorizontal() {
    let positionScreen
    let cameraRotation = NormalizeAngleInRadians(document.querySelector("#camera").getAttribute("rotation").y)
    if(cameraRotation > Math.PI) { cameraRotation = MapInterval(cameraRotation, Math.PI, Math.PI*2, -Math.PI, 0) }
    let sencosRotation = {
        x: Math.cos(relativeAngle - cameraRotation + Math.PI),
        z: Math.sin(relativeAngle - cameraRotation) 
    }

    positionScreen = MapInterval(sencosRotation.x, -fov.horizontal, fov.horizontal, window.innerWidth, 0)
    panel.style.left = (positionScreen - 12) + "px"
}

function MoveVertical() {
    let positionScreen
    let cameraRotation = NormalizeAngleInRadians(document.querySelector("#camera").getAttribute("rotation").x)
    if(cameraRotation > Math.PI) cameraRotation = -(Math.PI - (cameraRotation - Math.PI))

    positionScreen = MapInterval(angleBetweenHorizontalAndY + cameraRotation, -fov.vertical, fov.vertical, window.innerHeight, 0)

    panel.style.bottom = (positionScreen - 12) + "px"
}

export function HidePanelInfo() {
    document.removeEventListener("mousemove", MovePanel)
    panel.remove()
}








