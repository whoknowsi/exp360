AFRAME.registerComponent('change-sky', {
    schema: {
        target: {
            type: 'string'
        },
        position: {
            type: 'string'
        }
    },
    init: function () {
        console.log("testsss")
        
        let data = this.data;
        let el = this.el;
        let sky1 = document.querySelector("#sky")
        let sky2 = document.querySelector("#sky2")
        let radiusSkyProportion = sky1.getAttribute("radius")/6

        el.addEventListener('click', evt => {

            if(sky1.getAttribute("src") == data.target || sky2.getAttribute("src") == data.target) { return }
            
            sky2.setAttribute("src", data.target)
            
            let structures = document.querySelectorAll(".structure")
            let position = new THREE.Vector3(data.position.split(" ")[0], data.position.split(" ")[1], data.position.split(" ")[2] )
            let targetSkyPosition = new THREE.Vector3(-position.x*radiusSkyProportion, -position.y*radiusSkyProportion, -position.z*radiusSkyProportion)
            
            structures.forEach(structure => {
                let structurePosition = structure.getAttribute("position")
                let start = new THREE.Vector3(structurePosition.x, structurePosition.y, structurePosition.z)

                structure.setAttribute("position", (start.x - position.x) + " " + (start.y - position.y) + " " +  (start.z - position.z))
            })

            sky1.components.animation__moveout.data.to = targetSkyPosition
            sky1.emit("moveout")
            
            setTimeout(() => {
                sky1.emit("fadeout")
                setTimeout(() => {
                    sky1.setAttribute("src", data.target)
                    sky1.setAttribute("position", "0 0 0")
                    sky1.emit("fadein")
                }, 450)
            }, 150);
        });
    },
});