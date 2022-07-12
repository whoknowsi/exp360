AFRAME.registerComponent('change-sky', {
    schema: {
        target: {
            type: 'string'
        },
        rotation: {
            type: 'string'
        }
    },
    init: function () {
        let data = this.data;
        let el = this.el;
        let sky1 = document.querySelector("#sky")
        let sky2 = document.querySelector("#sky2")
        let radiusSkyProportion = sky1.getAttribute("radius")/8
        el.addEventListener('click', evt => {
            if(evt.detail.cursorEl.getAttribute("id") == "cursor-prev-raycast")
                ChangeSky(data, el, sky1, sky2, radiusSkyProportion)
        })
    },
})

function ChangeSky(data, el, sky1, sky2, radiusSkyProportion) {
    let structureContainer = document.querySelector("#structure-container")
    let structureContainerPosition = structureContainer.getAttribute("position")
    let currentPoint = document.querySelector(".current")
    let startPoint = new THREE.Vector3(structureContainerPosition.x, structureContainerPosition.y, structureContainerPosition.z)
    let targetPoint = el.object3D.position
    let heightTarget = el.getAttribute("height")
    let positionTargetY = el.object3D.position.y - heightTarget/2
    let position = new THREE.Vector3(startPoint.x + targetPoint.x, startPoint.y + targetPoint.y, startPoint.z + targetPoint.z)

    if(sky1.getAttribute("src") == data.target || sky2.getAttribute("src") == data.target) { return }

    currentPoint.classList.remove("current")
    el.classList.add("current")

    sky2.setAttribute("src", data.target)


    let targetSkyPosition = new THREE.Vector3(position.x*radiusSkyProportion, position.y*radiusSkyProportion, position.z*radiusSkyProportion)
    let endPoint = new THREE.Vector3(startPoint.x - position.x, startPoint.y + heightTarget/2 - positionTargetY - position.y, startPoint.z - position.z)
    

    structureContainer.components.animation__moveout.data.to = endPoint.x + " " + endPoint.y + " " + endPoint.z 
    structureContainer.components.animation__moveout.data.from = startPoint.x + " " + startPoint.y + " " + startPoint.z

    structureContainer.emit("moveout")
    MakeTransitionBetweenSkies(data, targetSkyPosition)
    
}


function MakeTransitionBetweenSkies(data, targetSkyPosition) {
    let sky1 = document.querySelector("#sky")
    let sky2 = document.querySelector("#sky2")

    sky2.components.animation__movein.data.from = targetSkyPosition
    sky2.emit("movein")
    sky1.emit("fadeout")

    if(data.rotation != "") {
        sky2.setAttribute("rotation", data.rotation)
    } else {
        sky2.setAttribute("rotation", "0 0 0")
    }

    setTimeout(() => {
        setTimeout(() => {
            if(data.rotation != "") {
                sky1.setAttribute("rotation", data.rotation)
            } else {
                sky1.setAttribute("rotation", "0 0 0")
            }

            sky1.setAttribute("src", data.target)
            sky1.setAttribute("position", "0 0 0")
            sky1.emit("fadein")
        }, 450)
    }, 150);
}
/// PRECARGA DE IMÁGENES DEL SKY

// let skyImages
// if(skyImages == null) {
//     skyImages = document.querySelectorAll(".skyImage")
//     let scene = document.querySelector("#scene")
//     let createdSky = []
//     skyImages.forEach(image => {
//         let temporalSky = document.createElement("a-sky")
//         temporalSky.setAttribute("src", "#" + image.getAttribute("id"))
//         scene.appendChild(temporalSky)
//         createdSky.push(temporalSky)
//     })
    
    
// }
