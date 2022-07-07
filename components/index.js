

let container, stats;
let camera, scene, raycasterPrev, raycasterEdit, renderer
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

var structuresVisible = true
var gizmosVisible = true


const pointer = new THREE.Vector3();
const radius = 100;

init();
animate();


function init() {

    SaveInitialValues()
    InitButtons()

    document.body.appendChild(container);

    document.addEventListener('mousemove', onPointerMove);
    window.addEventListener('resize', OnResize)
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
    pointer.y = (centerY - fixedMovementMouseY) * fixSizeHeight  + 1.6 
    pointer.z = (centerZ - fixedMovementMouseZForX - fixedMovementMouseZForY) * fixSizeWidth

    cursorPrev.setAttribute("rotation", camera.getAttribute("rotation").x + " " + camera.getAttribute("rotation").y + + " " + camera.getAttribute("rotation").z)

}

function SaveInitialValues() {

    container = document.createElement('scene');
    raycasterPrev = document.querySelector("#cursor-prev-raycast")
    raycasterEdit = document.querySelector("#cursor-edit")
    cursorPrev = document.querySelector("#cursor-prev")
    camera = document.querySelector("#camera")
    collides = document.querySelectorAll(".collidable")
    line = document.querySelector("#line")
    cameraRotation = camera.getAttribute("rotation");

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
    raycasterPrev.setAttribute("position", pointer)
    raycasterPrev.setAttribute("raycaster", "direction", pointer.x + " " + (pointer.y - 1.6) + " " + pointer.z)

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
        raycasterPrev.setAttribute("raycaster", "objects", ".collidable")

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
            structure.setAttribute("visible", "false")
        });
        return
    }
    if(show && structuresVisible) {
        queue.forEach(structure => {
            structure.setAttribute("visible", "true")
        });
        return
    }

    if(text.data == "Mostrar estructuras") {
        text.data = "Ocultar estructuras"
        queue.forEach(structure => {
            structure.setAttribute("visible", "true")
        });
        structuresVisible = true
    } 
    else {
        text.data = "Mostrar estructuras"
        queue.forEach(structure => {
            structure.setAttribute("visible", "false")
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