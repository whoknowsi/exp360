import { Height } from "./GlobalConfig.js"

let container, stats;
let camera, raycasterPrev, raycasterEdit, renderer
let scene = document.querySelector("#scene")
let structureContainer = document.querySelector("#structure-container")
let cursorPrev;
let collides;
let line;

let cameraRotation;

// Maths
let piRad
let innerWidth
let innerHeight
let magicNumber
let magicNumberX
let magicNumberY
let cosTheta
let senTheta
let cosAlpha
let senAlpha
let previousRotation
let cameraHeight = Height()

var structuresVisible = true
var gizmosVisible = true


const pointer = new THREE.Vector3();
const radius = 100;

init();
animate();


function init() {
    let heig
    SaveInitialValues()
    InitButtons()

    fetch("components/data/data.json")
        .then(results => results.json())
        .then(data => CreateSavedElements(data))

    document.body.appendChild(container);

    document.addEventListener('mousemove', onPointerMove);
    window.addEventListener('resize', OnResize)
}

function CreateSavedElements(data) {
    let skySpots = data.skySpots
    let structures = data.structures

    skySpots.forEach(spot => {
        structureContainer.appendChild(CreateSkySpot(spot))
    });

    structures.forEach(structure => {
        structureContainer.appendChild(CreateStructureBox(structure))
    });


}

function CreateSkySpot(spot) {
    let spotEl = document.createElement("a-box")
    spotEl.setAttribute("id", spot.id)
    spotEl.classList.add("skyChanger")
    spot.current && spotEl.classList.add("current")
    spotEl.setAttribute("position", spot.position.x + " " + spot.position.y + " " + spot.position.z)
    spotEl.setAttribute("width", 1)
    spotEl.setAttribute("height", .2)
    spotEl.setAttribute("depth", 1)
    spotEl.setAttribute("color", "#7BC8A4")
    spotEl.setAttribute("change-sky", "target: " + spot.target + "; rotation: " + spot.rotation)
    spotEl.setAttribute("material", "opacity: 0.5; alphaTest: .5")
    return spotEl
}

function CreateStructureBox(structure) {
    let structureContainer = document.createElement("a-entity")
    structureContainer.setAttribute("id", "container-" +  structure.id)
    structureContainer.setAttribute("position", structure.position.x + " " + structure.position.y + " " + structure.position.z)


    let structureEl = document.createElement("a-" + structure.primitive)
    structureEl.setAttribute("id", structure.id)
    structureEl.setAttribute("class", "collidable structure")
    structureEl.setAttribute("width", structure.width)
    structureEl.setAttribute("height", structure.height)
    structureEl.setAttribute("depth", structure.depth)
    structureEl.setAttribute("radius", structure.radius)
    structureEl.setAttribute("color", "#7BC8A4")
    structureEl.setAttribute("opacity", ".3")
    structureEl.setAttribute("rotate-corner", "all")
    structureEl.setAttribute("raycaster-listener", "")
    structureContainer.appendChild(structureEl)
    return structureContainer
}

function onPointerMove(event) {
    magicNumber = innerHeight + (95*innerHeight/500)

    let rotationCameraYRad = cameraRotation.y / 180
    let rotationCameraXRad = cameraRotation.x / 180

    magicNumberX = innerWidth / magicNumber
    magicNumberY = innerHeight / magicNumber

    cosTheta = (Math.cos(rotationCameraXRad * piRad))
    senTheta = (Math.sin(rotationCameraXRad * piRad))
    cosAlpha = (Math.cos(rotationCameraYRad * piRad))
    senAlpha = (Math.sin(rotationCameraYRad * piRad))
    previousRotation = cameraRotation

    let widthRangeFromMinusOneToOne = ((event.clientX / innerWidth) * 2 - 1)
    let heightRangeFromMinusOneToOne = ((event.clientY / innerHeight) * 2 - 1)

    let centerX = - (senAlpha) * cosTheta
    let centerY = senTheta
    let centerZ = -1 * cosAlpha * cosTheta

    let fixedMovementMouseX = (widthRangeFromMinusOneToOne * magicNumberX) * cosAlpha
    let fixedMovementMouseXForY = (heightRangeFromMinusOneToOne * magicNumberY) * senTheta * -senAlpha
    let fixedMovementMouseY = (heightRangeFromMinusOneToOne * magicNumberY) * cosTheta
    let fixedMovementMouseZForX = (widthRangeFromMinusOneToOne * magicNumberX) * senAlpha
    let fixedMovementMouseZForY = (heightRangeFromMinusOneToOne * magicNumberY) * senTheta * cosAlpha
    
    // Se necesita para compensar el tamaño del cursor
    let fixSizeWidth = 1
    let fixSizeHeight = 1


    pointer.x = (centerX + fixedMovementMouseX + fixedMovementMouseXForY) * fixSizeWidth
    pointer.y = (centerY - fixedMovementMouseY) * fixSizeHeight  + cameraHeight
    pointer.z = (centerZ - fixedMovementMouseZForX - fixedMovementMouseZForY) * fixSizeWidth

    cursorPrev.setAttribute("rotation", camera.getAttribute("rotation").x + " " + camera.getAttribute("rotation").y + + " " + camera.getAttribute("rotation").z)

}

function SaveInitialValues() {
    let position = 0 + " " + cameraHeight + " " + 0

    container = document.createElement('scene');
    raycasterPrev = document.querySelector("#cursor-prev-raycast")
    raycasterEdit = document.querySelector("#cursor-edit")
    cursorPrev = document.querySelector("#cursor-prev")
    camera = document.querySelector("#camera")
    collides = document.querySelectorAll(".collidable")
    line = document.querySelector("#line")
    cameraRotation = camera.getAttribute("rotation")

    cursorPrev.setAttribute("position", position)
    raycasterPrev.setAttribute("position", position)
    camera.setAttribute("position", position)
    
    OnResize()

    // número que me saqué de la galera para que ande bien cuando
    // hay resize de altura
    magicNumber = innerHeight + (95*innerHeight/500)

    piRad = Math.PI
}

function OnResize() {
    innerWidth = window.innerWidth
    innerHeight = window.innerHeight
}

function animate() {

    requestAnimationFrame(animate);
    render();
}

function render() {
    cursorPrev.setAttribute("position", pointer.x + " " + pointer.y + " " + pointer.z)
    raycasterPrev.setAttribute("raycaster", "direction", pointer.x + " " + (pointer.y - cameraHeight) + " " + pointer.z)
}


function InitButtons() {

    let buttonToggleEditor = document.querySelector(".toggleEditor")
    let buttonToggleStructures = document.querySelector(".toggleStructure")
    let buttonToggleGizmos = document.querySelector(".toggleGizmos")

    buttonToggleEditor.addEventListener("click", ToggleEditor)
    buttonToggleStructures.addEventListener("click", ToggleStructure)
    buttonToggleGizmos.addEventListener("click", ToggleGizmos)
}

function ToggleEditor(evt) {
    
    let raycasterPrevObjects = raycasterPrev.getAttribute("raycaster").objects
    let text = evt.target.firstChild;
    let raycasterPrevObjectsIsNull = (raycasterPrevObjects === 'none')
    if(raycasterPrevObjectsIsNull) {
        cursorPrev.setAttribute("visible", "true")
        raycasterPrev.setAttribute("raycaster", "objects", ".collidable, .skyChanger, .infoSpot")

        raycasterEdit.setAttribute("visible", "false")
        raycasterEdit.setAttribute("raycaster", "objects", "none")
        text.data = "Editar"
        SetEditorButtons(false)
        HideAllEditorsTools()
    } else {
        cursorPrev.setAttribute("visible", "false")
        raycasterPrev.setAttribute("raycaster", "objects", "none")

        raycasterEdit.setAttribute("visible", "true")
        raycasterEdit.setAttribute("raycaster", "objects", ".structureTarget")

        text.data = "Previsualizar"
        SetEditorButtons(true)
        ShowAllEditorActiveTools()
    }
}

function SetEditorButtons(setVisible) {
    let buttons = document.querySelectorAll(".editorButton")
    if(setVisible) {
        buttons.forEach(button => {
            button.style.visibility='visible'
        });
    } else {
        buttons.forEach(button => {
            button.style.visibility='hidden'
        });
    }
    
}

function ToggleStructure(evt, hide = false, show = false) {
    let button = document.querySelector(".toggleStructure")
    let text = button.firstChild
    
    let queue = document.querySelectorAll(".structure")
    
    if(hide) {
        queue.forEach(structure => {
            structure.setAttribute("opacity", "0")
        });
        return
    }
    if(show && structuresVisible) {
        queue.forEach(structure => {
            structure.setAttribute("opacity", ".3")
        });
        return
    }

    if(text.data == "Mostrar estructuras") {
        text.data = "Ocultar estructuras"
        queue.forEach(structure => {
            structure.setAttribute("opacity", ".3")
        });
        structuresVisible = true
    } 
    else {
        text.data = "Mostrar estructuras"
        queue.forEach(structure => {
            structure.setAttribute("opacity", "0")
        });
        structuresVisible = false
    }
}

function ToggleGizmos(evt, hide = false, show = false) {
    let button = document.querySelector(".toggleGizmos")

    let text = button.firstChild
    let queue = document.querySelectorAll(".gizmo")

    if(hide) {
        queue.forEach(structure => {
            structure.setAttribute("visible", "false")
        });
        return
    }
    if(show && gizmosVisible) {
        queue.forEach(structure => {
            structure.setAttribute("visible", "true")
        });
        return
    }

    if(text.data == "Mostrar gizmos") {
        text.data = "Ocultar gizmos"
        queue.forEach(structure => {
            structure.setAttribute("visible", "true")
        });
        gizmosVisible = true
    } 
    else 
    {
        text.data = "Mostrar gizmos"
        queue.forEach(structure => {
            structure.setAttribute("visible", "false")
        });
        gizmosVisible = false
    }
}

function HideAllEditorsTools() {
    ToggleGizmos(null, true, false)
    ToggleStructure(null, true, false)
}
function ShowAllEditorActiveTools() {
    if(gizmosVisible)
        ToggleGizmos(null, false, true)
    if(structuresVisible)
        ToggleStructure(null, false, true)
}