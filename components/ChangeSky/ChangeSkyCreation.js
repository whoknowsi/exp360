import { PositionToCenterInWorld, ResizeDependingOnPositionRadius, DistanceToCenterInWorld } from "../positionHelper.js"

let scene = document.querySelector("#scene")
let maxDistance = 20
let minRadius = .1
let radius = .01
let height = .2
let rescale = 10
let originStructureContainer
let sky1, sky2
var position

export function CreateSky() {
    DisplaySkies()
}

function DisplaySkies() {
    let existContainer = document.querySelector(".skyButtonContainer") != null
    if (existContainer) { return }

    let skyImages = document.querySelectorAll(".skyImage")

    let skyContainer = document.createElement("div")
    skyContainer.classList.add("skyButtonContainer")
    skyImages.forEach(skyImage => {
        let newButton = document.createElement("button")
        let id = skyImage.getAttribute("id")
        newButton.innerText = id
        newButton.addEventListener("click", () => {
            ShowButtonRotateSky()
            CreatePositionButtons()
            CrateFinishButton(id)
            SelecSkyPosition(id)
            skyContainer.remove()
        })
        skyContainer.appendChild(newButton)
    });

    let cancelButton = document.createElement("button")
    cancelButton.innerText = "Cancelar"
    cancelButton.addEventListener("click", () => {
        skyContainer.remove()
    })
    skyContainer.appendChild(cancelButton)

    document.body.appendChild(skyContainer)
}

function SelecSkyPosition(id) {
    CreatePointer(id)
    console.log(id)
}
function CreatePointer(id) {
    let pointer = document.createElement("a-cylinder")
    pointer.setAttribute("id", "pointerSkyCreation")
    pointer.setAttribute("sky-position-pointer", "id: " + id)
    pointer.setAttribute("radius", radius)
    pointer.setAttribute("height", height)
    scene.appendChild(pointer)
}

function ShowButtonRotateSky() {
    let buttonContainer = document.createElement("div")
    buttonContainer.classList.add("buttonContainerSkyOptions")
    let button = document.createElement("button")
    button.innerText = "rotar sky"
    button.addEventListener("click", () => {
        let sky = scene.querySelector("#sky2")
        let skyrotation = sky.getAttribute("rotation")
        console.log(skyrotation.y + 90)
        if(skyrotation.y + 90 >= 360)
            sky.setAttribute("rotation", skyrotation.x + " " + (skyrotation.y + 90 - 360) + " " + skyrotation.z)
        else
            sky.setAttribute("rotation", skyrotation.x + " " + (skyrotation.y + 90) + " " + skyrotation.z)
        
    })

    buttonContainer.appendChild(button)
    document.body.appendChild(buttonContainer)
}

function CreatePositionButtons() {
    let buttonLeftX = document.createElement("button")
    buttonLeftX.innerText = " - "
    buttonLeftX.addEventListener("click", () => {
        position.x -= .1
    })
    let labelX = document.createElement("p")
    labelX.innerHTML = " X "
    let buttonRightX = document.createElement("button")
    buttonRightX.innerText = " + "
    buttonRightX.addEventListener("click", () => {
        position.x += .1
    })

    let buttonLeftZ = document.createElement("button")
    buttonLeftZ.innerText = " - "
    buttonLeftZ.addEventListener("click", () => {
        position.z -= .1
    })
    let labelZ = document.createElement("p")
    labelZ.innerHTML = " Z "
    let buttonRightZ = document.createElement("button")
    buttonRightZ.innerText = " + "
    buttonRightZ.addEventListener("click", () => {
        position.z += .1
    })

    let container = document.querySelector(".buttonContainerSkyOptions")
    container.appendChild(buttonLeftX)
    container.appendChild(labelX)
    container.appendChild(buttonRightX)
    container.appendChild(buttonLeftZ)
    container.appendChild(labelZ)
    container.appendChild(buttonRightZ)


}


AFRAME.registerComponent('sky-position-pointer', {
    schema: {
        id: {type: "string"}
    },
    init: function() {
        let container = scene.querySelector("#structure-container")
        let originPosition = container.getAttribute("position")
        
        originStructureContainer = new THREE.Vector3(originPosition.x, originPosition.y, originPosition.z)
        sky1 = document.querySelector("#sky")
        sky2 = document.querySelector("#sky2")
        sky1.setAttribute("opacity", 0)
        sky2.setAttribute("src", "#" + this.data.id)
        position = new THREE.Vector3(originPosition.x, originPosition.y, originPosition.z)
        console.log(position)

    },
    tick: function () {
        let element = this.el
        element.setAttribute("position", position)
        let structures = scene.querySelector("#structure-container")
        structures.setAttribute("position", (position.x) + " " + structures.getAttribute("position").y + " " + (position.z))
    }
});

function CrateFinishButton(id) {
    let buttonContainer = document.querySelector(".buttonContainerSkyOptions")
    let button = document.createElement("button")
    button.innerText = "listo"
    button.addEventListener("click", () => {
        let pointerSkyCreation = document.querySelector("#pointerSkyCreation")
        pointerSkyCreation.remove()
        let structureContainer = scene.querySelector("#structure-container")
        structureContainer.setAttribute("position", originStructureContainer)

        let box = document.createElement("a-box")
        box.setAttribute("class", "skyChanger")
        box.setAttribute("position", -position.x + " .1 " + -position.z)
        box.setAttribute("width", "1")
        box.setAttribute("height", ".2")
        box.setAttribute("depth", "1")
        box.setAttribute("color", "#7BC8A4")
        let sky2Rotation = sky2.getAttribute("rotation")
        let sky1Rotation = sky1.getAttribute("rotation")
        let currentRotation = (sky2Rotation.x + " " + sky2Rotation.y + " " + sky2Rotation.z)
        console.log("test")
        box.setAttribute("material", "opacity: 0.5; alphaTest: .5")
        box.setAttribute("change-sky", "target: #" + id + "; rotation: " + currentRotation)
        structureContainer.appendChild(box)
        let imageContainer = document.createElement("div")
        imageContainer.remove()
        buttonContainer.remove()
        sky1.setAttribute("opacity", 1)
        sky2.setAttribute("rotation", sky1.getAttribute("rotation"))
        sky2.setAttribute("src", sky1.getAttribute("src"))
        
    
    })

    buttonContainer.appendChild(button)
    
}

export function EditSky() {
    let currentSkyChanger = document.querySelector(".current")
    let id = currentSkyChanger.getAttribute("change-sky").target
    console.log(id)
}
