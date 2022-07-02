import {CurrentTarget, GetCurrentTarget, MapInterval} from "./helper.js"

AFRAME.registerComponent('raycaster-listener', {
    init: function () {

        let data = this.data;
        let el = this.el;
        this.cornerValue = 0.1

        this.el.addEventListener('raycaster-intersected', evt => {
            this.raycaster = evt.detail.el;
            CurrentTarget(this.el);
        });
        this.el.addEventListener('raycaster-intersected-cleared', evt => {
            this.raycaster = null;
            CurrentTarget(null);
        });

        el.addEventListener("click", (evt) => {
            
            let normal = this.intersection.face.normal;
            cursor.setAttribute("rotation", 90*normal.y + " " + 90*normal.x + " " + 90*normal.z)
            console.log(this.intersection.point)
        })

        

    },
    tick: function () {
        
        if (!this.raycaster) { return }
        
        let target = GetCurrentTarget()
        if(target == null && this.raycaster != null) {
            CurrentTarget(this.el);
            target = this.el
        }
            
        else if(target != null) {
            this.intersection = this.raycaster.components.raycaster.getIntersection(target);
        }
            

        if (!this.intersection) { return }
        let normal = this.intersection.face.normal;
        let distance = this.intersection.distance;

        let edge = RotateOnCorners(target, this.intersection, this.cornerValue)
        
        cursor.setAttribute("rotation", (90*normal.y + edge.y) + " " + (90*normal.x  + edge.x) + " " + (90*normal.z))
        cursor.setAttribute("scale", 3/distance + " " + 3/distance + " " + 3/distance)
    }
});

function RotateOnCorners(target, intersection, cornerValue) {
    let rangeValue = 0.0000001;

    let targetWidth = target.getAttribute("width")
    let targetHeight = target.getAttribute("height")
    let targetDepth = target.getAttribute("depth")

    let localPositionX = intersection.point.x - (target.getAttribute("position").x - target.getAttribute("width")/2)
    let localPositionY = intersection.point.y - (target.getAttribute("position").y - target.getAttribute("height")/2)
    let localPositionZ = intersection.point.z - (target.getAttribute("position").z - target.getAttribute("depth")/2)
    
    let positionRelativeBorderStartX = Math.abs(localPositionX - targetWidth)
    let positionRelativeBorderStartY = Math.abs(localPositionY - targetHeight)
    let positionRelativeBorderStartZ = Math.abs(localPositionZ - targetDepth)
    let positionRelativeBorderEndX = targetWidth - positionRelativeBorderStartX
    let positionRelativeBorderEndY = targetHeight - positionRelativeBorderStartY
    let positionRelativeBorderEndZ = targetDepth - positionRelativeBorderStartZ

    let edge = {
        x: 0,
        y: 0
    }

    if(positionRelativeBorderStartX >= -rangeValue && positionRelativeBorderStartX <= rangeValue) {
        if(positionRelativeBorderStartY < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderStartY), 0, cornerValue, -45, 0);
        }   
        if(positionRelativeBorderStartZ < cornerValue) {
            edge.x = MapInterval(Math.abs(positionRelativeBorderStartZ), 0, cornerValue, -45,0);
        }   

        if(positionRelativeBorderEndY < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderEndY), 0, cornerValue, 45,0);
        }  
        if(positionRelativeBorderEndZ < cornerValue) {
            edge.x = MapInterval(Math.abs(positionRelativeBorderEndZ), 0, cornerValue, 45,0);
        }   
    }
    if(positionRelativeBorderStartY >= -rangeValue && positionRelativeBorderStartY <= rangeValue) {
        if(positionRelativeBorderStartX < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderStartX), 0, cornerValue, 45,0);
            edge.x = 90
        }   
        if(positionRelativeBorderStartZ < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderStartZ), 0, cornerValue, 45,0);
        } 

        if(positionRelativeBorderEndX < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderEndX), 0, cornerValue, -45,0);
            edge.x = 90
        } 
        if(positionRelativeBorderEndZ < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderEndZ), 0, cornerValue, -45,0);
        } 
    }
    if(positionRelativeBorderStartZ >= -rangeValue && positionRelativeBorderStartZ <= rangeValue) {
        if(positionRelativeBorderStartX < cornerValue) {
            edge.x = MapInterval(Math.abs(positionRelativeBorderStartX), 0, cornerValue, 45,0);
        }   
        if(positionRelativeBorderStartY < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderStartY), 0, cornerValue, -45,0);
        }  

        if(positionRelativeBorderEndX < cornerValue) {
            edge.x = MapInterval(Math.abs(positionRelativeBorderEndX), 0, cornerValue, -45,0);
        }  
        if(positionRelativeBorderEndY < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderEndY), 0, cornerValue, 45,0);
        }  
    }

    if(positionRelativeBorderEndX >= -rangeValue && positionRelativeBorderEndX <= rangeValue) {
        if(positionRelativeBorderStartY < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderStartY), 0, cornerValue, -45,0);
        }
        if(positionRelativeBorderStartZ < cornerValue) {
            edge.x = MapInterval(Math.abs(positionRelativeBorderStartZ), 0, cornerValue, 45,0);
        }
        
        if(positionRelativeBorderEndY < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderEndY), 0, cornerValue, 45,0);
        }   
        if(positionRelativeBorderEndZ < cornerValue) {
            edge.x = MapInterval(Math.abs(positionRelativeBorderEndZ), 0, cornerValue, -45,0);
        }
    }
    if(positionRelativeBorderEndY >= -rangeValue && positionRelativeBorderEndY <= rangeValue) {
        if(positionRelativeBorderStartX < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderStartX), 0, cornerValue, -45,0);
            edge.x = 90
        } 
        if(positionRelativeBorderStartZ < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderStartZ), 0, cornerValue, -45,0);
        }   

        if(positionRelativeBorderEndX < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderEndX), 0, cornerValue, 45,0);
            edge.x = 90
        }   
        if(positionRelativeBorderEndZ < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderEndZ), 0, cornerValue, 45,0); 
        }   
    }
    if(positionRelativeBorderEndZ >= -rangeValue && positionRelativeBorderEndZ <= rangeValue) {
        if(positionRelativeBorderStartX < cornerValue) {
            edge.x = MapInterval(Math.abs(positionRelativeBorderStartX), 0, cornerValue, -45,0);
        } 
        if(positionRelativeBorderStartY < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderStartY), 0, cornerValue, 45,0);
        }  
        
        if(positionRelativeBorderEndX < cornerValue) {
            edge.x = MapInterval(Math.abs(positionRelativeBorderEndX), 0, cornerValue, 45,0);
        } 
        if(positionRelativeBorderEndY < cornerValue) {
            edge.y = MapInterval(Math.abs(positionRelativeBorderEndY), 0, cornerValue, -45,0);
        } 
    }

    return edge
}

let query;
if(query == null) {
    query = document.querySelectorAll(".collidable")
    for (let i = 0; i < query.length; i++) {
        
        const item = query[i];
        item.setAttribute('raycaster-listener',''); 
        
    }
}



