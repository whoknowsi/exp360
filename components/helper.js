var currentTarget;

export function CurrentTarget(target) {
    if(target != null)
        currentTarget = target;
    else
        currentTarget = null;
}

export function GetCurrentTarget() {
    return currentTarget
}

export function MapInterval(val, srcMin, srcMax, dstMin, dstMax)
{
    if (val >= srcMax) return dstMax;
    if (val <= srcMin) return dstMin;
    return dstMin + (val - srcMin) / (srcMax - srcMin) * (dstMax - dstMin);
}

export function CreateFloor(point1, point2, point1Degree, point2Degree) {

    let dragginLine = document.querySelector("#dragginLine")
    dragginLine.remove()
    let startLine1 = document.querySelector("#startLine1")
    startLine1.removeAttribute("id")
    let startLine2 = document.querySelector("#startLine2")
    startLine2.removeAttribute("id")
    let endLine1 = document.querySelector("#endLine1")
    endLine1.removeAttribute("id")
    let endLine2 = document.querySelector("#endLine2")
    endLine2.removeAttribute("id")
    let dragginSphere = document.querySelector("#dragginSphere")
    dragginSphere.remove()


    let angleBetweenDotsFromCamera = Math.abs(point2Degree - point1Degree);

    let shorterSide = point2
    let longerSide = point1

    if(point2 >= point1) {
        shorterSide = point1
        longerSide = point2
    }

    let op = Math.sin(angleBetweenDotsFromCamera) * shorterSide
    let ad = Math.cos(angleBetweenDotsFromCamera) * shorterSide
    let ad2 = longerSide - ad
    let diagonal = Math.sqrt(ad2*ad2 + op*op)
    let delta = Math.asin(op/diagonal)
    let halfDiagonal = diagonal/2
    let distanceToCenter = Math.sqrt(longerSide*longerSide + halfDiagonal*halfDiagonal - 2 * longerSide * halfDiagonal * Math.cos(delta))

    let angle = Math.asin((Math.sin(delta)*halfDiagonal)/distanceToCenter)
    angle = MoveFigureToCorrectAngle(angle, point1, point2, point1Degree, point2Degree)

    let x = -distanceToCenter * Math.sin(angle)
    let z = -distanceToCenter * Math.cos(angle)

    let xfirst = -point1 * Math.sin(point1Degree)
    let zfirst = -point1 * Math.cos(point1Degree)

    let xlast = -point2 * Math.sin(point2Degree)
    let zlast = -point2 * Math.cos(point2Degree)

    let vectorDirection = { x: xlast - xfirst, z: zlast - zfirst}


    let newFloor = document.createElement("a-box")
    newFloor.setAttribute("width",  Math.abs(vectorDirection.x))
    newFloor.setAttribute("height", .1)
    newFloor.setAttribute("depth", Math.abs(vectorDirection.z))

    // Guizmos, sirven para ver los puntos de interés de la figura
    // la diagonal, punto inicial, punto final, linea de trazo, etc
    // descomentar si se ve necesario

    //CreateGuizmos(x, z, xfirst, zfirst, xlast, zlast)

    newFloor.setAttribute("position", x + " " + 0.01 + " " + z) 
    newFloor.setAttribute("opacity", ".3")
    newFloor.setAttribute("class", "collidable structure")
    newFloor.setAttribute("raycaster-listener", "")

    document.querySelector("#scene").appendChild(newFloor)
}

function CreateGuizmos(x, z, xfirst, zfirst, xlast, zlast) {
    let point1Sphere = document.createElement("a-sphere")
    point1Sphere.setAttribute("radius", ".05")
    point1Sphere.setAttribute("color", "red")
    point1Sphere.setAttribute("position", x + " " + 0.01 + " " + z) 
    point1Sphere.setAttribute("class", "guizmos")

    let point2Sphere = document.createElement("a-sphere")
    point2Sphere.setAttribute("radius", ".05")
    point2Sphere.setAttribute("color", "black")
    point2Sphere.setAttribute("position", xlast + " " + 0.01 + " " + zlast) 
    point2Sphere.setAttribute("class", "guizmos")

    let middlePointSphere = document.createElement("a-sphere")
    middlePointSphere.setAttribute("radius", ".05")
    middlePointSphere.setAttribute("color", "green")
    middlePointSphere.setAttribute("position", xfirst + " " + 0.01 + " " + zfirst)
    middlePointSphere.setAttribute("class", "guizmos") 

    let diagonalLine = document.createElement("a-entity")
    diagonalLine.setAttribute("line", "start", point2Sphere.object3D.position)
    diagonalLine.setAttribute("line", "end", middlePointSphere.object3D.position)
    diagonalLine.setAttribute("line", "color", "blue")
    diagonalLine.setAttribute("class", "guizmos")

    let scene = document.querySelector("#scene")
    scene.appendChild(point1Sphere)
    scene.appendChild(middlePointSphere)
    scene.appendChild(point2Sphere)
    scene.appendChild(diagonalLine)
}

function MoveFigureToCorrectAngle(angle, firstPoint, lastPoint, firstPointDegree, lastPointDegree) {
    if(lastPoint >= firstPoint) {
        if(lastPointDegree >= firstPointDegree) {
            angle = lastPointDegree - angle
        }
        else {
            angle = lastPointDegree + angle
        }
    }
    else if(firstPoint > lastPoint) {
        if(firstPointDegree >= lastPointDegree) {
            angle = firstPointDegree - angle
        }
        else {
            angle = firstPointDegree + angle            
        }
    }

    return angle
}

export function CreateFirstPoint(lastEventTarget) {

    let x = lastEventTarget.detail.intersection.point.x
    let z = lastEventTarget.detail.intersection.point.z
    let sphere = document.createElement("a-sphere")
    sphere.setAttribute("id", "dragginSphere")
    sphere.setAttribute("radius", ".05")
    sphere.setAttribute("color", "green")
    sphere.setAttribute("position", x + " " + 0.01 + " " + z) 

    let line = document.createElement("a-entity")
    line.setAttribute("id", "dragginLine")
    line.setAttribute("line", "start", sphere.object3D.position)
    line.setAttribute("line", "end", "")
    line.setAttribute("line", "color", "blue")

    let camera = document.querySelector("#camera")
    let originDegree = NormalizeAngleInRadians(camera.getAttribute("rotation").y)
    let cameraRotationVertical = NormalizeAngleInRadians(camera.getAttribute("rotation").x)
    let origin = Math.abs(lastEventTarget.detail.intersection.distance * Math.sin((Math.PI / 2) - cameraRotationVertical))

    line.setAttribute("line-draggin", 
                        "targetClass: " + lastEventTarget.target.getAttribute("class") + 
                        "; originDegree: " + originDegree + 
                        "; origin: " + origin)
    // lastEventTarget.target.addEventListener("mouseup", StopMovingLine)

    document.querySelector("#scene").appendChild(sphere)
    document.querySelector("#scene").appendChild(line)
}


AFRAME.registerComponent('line-draggin', {
    schema: {        
        targetClass: {
            type: "string"
        },
        originDegree: {
            type: "float"
        },
        origin: {
            type: "float"
        }
    },
    tick: function () {
        let target = document.querySelector("." + this.data.targetClass)
        let raycaster = document.querySelector("#cursor-edit").components.raycaster
        let intersection = raycaster.getIntersection(target)
        this.el.setAttribute("line", "end", intersection.point)
        let originPoint = this.el.getAttribute("line").start


        let camera = document.querySelector("#camera")

        let cameraRotationHorizontal = NormalizeAngleInRadians(camera.getAttribute("rotation").y)
        let cameraRotationVertical = NormalizeAngleInRadians(camera.getAttribute("rotation").x)

        let point1 = this.data.origin
        let point2 = Math.abs(intersection.distance * Math.sin((Math.PI / 2) - cameraRotationVertical))
        let point1Degree = this.data.originDegree

        let xfirst = -point1 * Math.sin(point1Degree)
        let zfirst = -point1 * Math.cos(point1Degree)


    
        let xlast = -point2 * Math.sin(cameraRotationHorizontal)
        let zlast = -point2 * Math.cos(cameraRotationHorizontal)
    
        let vectorDirection = { x: xlast - xfirst, z: zlast - zfirst}
    
        let startLine1 = document.querySelector("#startLine1")
        if(!startLine1) {
            let line = document.createElement("a-entity")
            line.setAttribute("id", "startLine1")
            line.setAttribute("line", "start", originPoint)
            line.setAttribute("line", "color", "green")
            line.setAttribute("class", "guizmos")
            document.querySelector("#scene").appendChild(line)
        } else {
            startLine1.setAttribute("line", "end", (originPoint.x + vectorDirection.x) + " " + 0.01 + " " + originPoint.z)
        }

        let startLine2 = document.querySelector("#startLine2")
        if(!startLine2) {
            let line = document.createElement("a-entity")
            line.setAttribute("id", "startLine2")
            line.setAttribute("line", "start", originPoint)
            line.setAttribute("line", "color", "green")
            line.setAttribute("class", "guizmos")
            document.querySelector("#scene").appendChild(line)
        } else {
            startLine2.setAttribute("line", "end", originPoint.x + " " + 0.01 + " " + (vectorDirection.z + originPoint.z))
        }

        let endLine1 = document.querySelector("#endLine1")
        if(!endLine1) {
            let line = document.createElement("a-entity")
            line.setAttribute("id", "endLine1")
            line.setAttribute("line", "start", intersection.point)
            line.setAttribute("line", "color", "green")
            line.setAttribute("class", "guizmos")
            document.querySelector("#scene").appendChild(line)
        } else {
            endLine1.setAttribute("line", "start", intersection.point)
            endLine1.setAttribute("line", "end", originPoint.x + " " + 0.01 + " " + (vectorDirection.z + originPoint.z))
        }

        let endLine2 = document.querySelector("#endLine2")
        if(!endLine2) {
            let line = document.createElement("a-entity")
            line.setAttribute("id", "endLine2")
            line.setAttribute("line", "start", intersection.point)
            line.setAttribute("line", "color", "green")
            line.setAttribute("class", "guizmos")
            document.querySelector("#scene").appendChild(line)
        } else {
            endLine2.setAttribute("line", "start", intersection.point)
            endLine2.setAttribute("line", "end", (originPoint.x + vectorDirection.x) + " " + 0.01 + " " + originPoint.z)
        }
        
    }
});

export function NormalizeAngleInRadians(cameraRotation) {
    let pi = Math.PI
    if(cameraRotation < 0) {
        while(cameraRotation < 0) {
            cameraRotation += 360
        }
    }

    if(cameraRotation > 360) {
        while(cameraRotation > 360) {
            cameraRotation -= 360;
        }
    }

    cameraRotation = (cameraRotation/180) * pi
    return cameraRotation
}

