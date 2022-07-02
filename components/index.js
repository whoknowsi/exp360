

let container, stats;
let camera, scene, raycaster, renderer
let cursor;
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


const pointer = new THREE.Vector3();
const radius = 100;

init();
animate();


function init() {

    SaveInitialValues();

    document.body.appendChild(container);

    document.addEventListener('mousemove', onPointerMove);
    window.addEventListener('resize', OnResize)
}

function onPointerMove(event) {

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
    let fixSizeWidth = 1.1
    let fixSizeHeight = 1.1

    pointer.x = (centerX + fixedMovementMouseX + fixedMovementMouseXForY) * fixSizeWidth
    pointer.y = (centerY - fixedMovementMouseY) * fixSizeHeight  + 1.6 
    pointer.z = (centerZ - fixedMovementMouseZForX - fixedMovementMouseZForY) * fixSizeWidth

    cursor.setAttribute("rotation", camera.getAttribute("rotation").x + " " + camera.getAttribute("rotation").y + + " " + camera.getAttribute("rotation").z)

}

function SaveInitialValues() {

    container = document.createElement('scene');
    raycaster = document.querySelector("#pointer")
    cursor = document.querySelector("#cursor")
    camera = document.querySelector("#camera")
    collides = document.querySelectorAll(".collidable")
    line = document.querySelector("#line")
    cameraRotation = camera.getAttribute("rotation");

    OnResize()

    // Número necesario para que ande bien con 0.001 de profundidad
    // se cambia si se cambia la profundidad
    magicNumber = 690
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

    cursor.setAttribute("position", pointer.x + " " + pointer.y + " " + pointer.z)
    raycaster.setAttribute("position", pointer)
    raycaster.setAttribute("raycaster", "direction", pointer.x + " " + (pointer.y - 1.6) + " " + pointer.z)

}

