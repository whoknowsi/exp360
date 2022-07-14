import { ShowPanelInfo, HidePanelInfo } from "./InfoSpots/InfoSpotManagment.js"

AFRAME.registerComponent('info-spot', {
    schema: {
        title: {type: 'string'},
        description: {type: 'string'},
        image: {type: 'string'}
    },
    init: function () {
        this.el.addEventListener('raycaster-intersected', evt => {
            this.raycaster = evt.detail.el;
            
            if(this.raycaster.getAttribute("id") == "cursor-prev-raycast") {
                let intersection = this.raycaster.components.raycaster.getIntersection(this.el)
                ShowPanelInfo(this.el, intersection, this.data.title, this.data.description, this.data.image)
            }
        });
        this.el.addEventListener('raycaster-intersected-cleared', evt => {
            this.raycaster = null;
            HidePanelInfo()
        });


    },
    tick: function () {
        let camera = document.querySelector("#camera")
        this.el.object3D.lookAt(camera.object3D.position)
    }
}); 


let infoSpotPointers = document.querySelectorAll(".infoSpot")
infoSpotPointers.forEach(spot => {
    spot.setAttribute("info-spot", "")
});