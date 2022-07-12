var _targetsInPool = [];

export function AddTarget(target) {
    _targetsInPool.push(target)
}

export function RemoveTarget(target) {
    var filtered = _targetsInPool.filter( _target => _target != target);
    _targetsInPool = filtered
}

export function GetCurrentTarget() {
    let raycasterEl = document.querySelector("#cursor-prev-raycast")
    let raycaster = raycasterEl.components.raycaster
    let intersection
    let previousDistance = 100000000
    let closestTarget

    _targetsInPool.forEach(target => {
        intersection = raycaster.getIntersection(target);
        if(intersection == null) return 
        if(intersection.distance < previousDistance) {
            previousDistance = intersection.distance
            closestTarget = target
        }
    });
    

    return closestTarget
}

export function MapInterval(val, srcMin, srcMax, dstMin, dstMax)
{
    if (val >= srcMax) return dstMax;
    if (val <= srcMin) return dstMin;
    return dstMin + (val - srcMin) / (srcMax - srcMin) * (dstMax - dstMin);
}


////////////////////////// PASAR A OTRO HELPER BUILD ////////////////////////////////

var _originPoint, _distance1, _distance2, _degree1, _degree2
var _camera = document.querySelector("#camera")
var _cameraRotation = _camera.getAttribute("rotation")
var _scene = document.querySelector("#scene")

export function CreateCube() {

    let cameraRotationVertical = NormalizeAngleInRadians(_cameraRotation.x)
    let diffFirstVerticalAngleAndCurrent = cameraRotationVertical - _degree2.vertical
    let height = Math.tan(diffFirstVerticalAngleAndCurrent) * _distance2
    let middlePoint = CalculateMiddlePointOfDiagonal(_distance1, _distance2, _degree1.horizontal, _degree2.horizontal)
    let size = CalculateSize(_distance1, _distance2, _degree1.horizontal, _degree2.horizontal)

    let structureContainer = _scene.querySelector("#structure-container")
    let containerPosition = structureContainer.getAttribute("position")


    let container = document.createElement("a-entity")
    let id = Date.now()
    container.setAttribute("id", "container-structure-" + id)
    container.setAttribute("position", (middlePoint.x - containerPosition.x) + " " + (height/2+_originPoint.y - containerPosition.y) + " " + (middlePoint.z - containerPosition.z)) 
    let gizmosContainer = document.createElement("a-entity")

    let newCube = document.createElement("a-box")
    newCube.setAttribute("width",  Math.abs(size.x))
    newCube.setAttribute("depth", Math.abs(size.z))
    if(height > 0)
        newCube.setAttribute("height", height)
    else
        newCube.setAttribute("height", -height)
    newCube.setAttribute("opacity", ".3")
    newCube.setAttribute("id", "structure-" + id)
    newCube.setAttribute("class", "collidable structure")
    newCube.setAttribute("raycaster-listener", "")
    newCube.setAttribute("rotate-corner", "all")

    let gizmos = CreatePermanentGizmos(Math.abs(size.x)/2, height/2, Math.abs(size.z)/2)
    gizmosContainer.append(gizmos)
    container.appendChild(newCube)
    container.appendChild(gizmosContainer)
    structureContainer.appendChild(container)

    RemoveGuideLinesCube()

}

function CreatePermanentGizmos(width, height, depth) {
    let gizmoContainer = document.createElement("a-entity")
    let bottomLeftFront = new THREE.Vector3(-width, -height, -depth)
    let upLeftFront = new THREE.Vector3(-width, height, -depth)
    let bottomRightFront = new THREE.Vector3(width, -height, -depth)
    let upRightFront = new THREE.Vector3(width, height, -depth)
    let bottomLeftBack = new THREE.Vector3(-width, -height, depth)
    let upLeftBack = new THREE.Vector3(-width, height, depth)
    let bottomRightBack = new THREE.Vector3(width, -height, depth)
    let upRightBack = new THREE.Vector3(width, height, depth)
    
    let line = CreateGizmoLine(bottomLeftFront, upLeftFront)
    let line2 = CreateGizmoLine(bottomLeftFront, bottomRightFront)
    let line3 = CreateGizmoLine(upRightFront, upLeftFront)
    let line4 = CreateGizmoLine(upRightFront, bottomRightFront)

    let line5 = CreateGizmoLine(bottomLeftBack, upLeftBack)
    let line6 = CreateGizmoLine(bottomLeftBack, bottomRightBack)
    let line7 = CreateGizmoLine(upRightBack, upLeftBack)
    let line8 = CreateGizmoLine(upRightBack, bottomRightBack)

    let line9 = CreateGizmoLine(bottomLeftFront, bottomLeftBack)
    let line10 = CreateGizmoLine(bottomRightFront, bottomRightBack)
    let line11 = CreateGizmoLine(upRightFront, upRightBack)
    let line12 = CreateGizmoLine(upLeftFront, upLeftBack)

    gizmoContainer.appendChild(line)
    gizmoContainer.appendChild(line2)
    gizmoContainer.appendChild(line3)
    gizmoContainer.appendChild(line4)
    gizmoContainer.appendChild(line5)
    gizmoContainer.appendChild(line6)
    gizmoContainer.appendChild(line7)
    gizmoContainer.appendChild(line8)
    gizmoContainer.appendChild(line9)
    gizmoContainer.appendChild(line10)
    gizmoContainer.appendChild(line11)
    gizmoContainer.appendChild(line12)

    return gizmoContainer
}

function CreateGizmoLine(start, end) {
    let line = document.createElement("a-entity")
    line.setAttribute("line", "start", start)
    line.setAttribute("line", "end", end)
    line.setAttribute("line", "color", "red")
    return line
}

function RemoveGuideLinesCube() {
    let dragginLine = document.querySelector("#dragginLine")
    dragginLine.remove()

    let temporalGizmos = document.querySelectorAll(".temporalGizmo")
    temporalGizmos.forEach(temporalGizmo => {
        temporalGizmo.remove()
        // temporalGizmo.removeAttribute("class", "temporalGizmo")
        // temporalGizmo.setAttribute("class", "gizmo")
    })
}

function CalculateMiddlePointOfDiagonal(distance1, distance2, degree1, degree2) {
    let angleBetweenDotsFromCamera = Math.abs(degree2 - degree1);

    let shorterSide = distance2
    let longerSide = distance1

    if(distance2 >= distance1) {
        shorterSide = distance1
        longerSide = distance2
    }

    let op = Math.sin(angleBetweenDotsFromCamera) * shorterSide
    let ad = Math.cos(angleBetweenDotsFromCamera) * shorterSide
    let ad2 = longerSide - ad
    let diagonal = Math.sqrt(ad2*ad2 + op*op)
    let delta = Math.asin(op/diagonal)
    let halfDiagonal = diagonal/2
    let distanceToCenter = Math.sqrt(longerSide*longerSide + halfDiagonal*halfDiagonal - 2 * longerSide * halfDiagonal * Math.cos(delta))

    let angle = Math.asin((Math.sin(delta)*halfDiagonal)/distanceToCenter)
    angle = MoveFigureToCorrectAngle(angle, distance1, distance2, degree1, degree2)

    return { 
        x: -distanceToCenter * Math.sin(angle),
        z: -distanceToCenter * Math.cos(angle)
    }
}

function CalculateSize(distance1, distance2, degree1, degree2) {
    let xfirst = -distance1 * Math.sin(degree1)
    let zfirst = -distance1 * Math.cos(degree1)

    let xlast = -distance2 * Math.sin(degree2)
    let zlast = -distance2 * Math.cos(degree2)
    return { 
        x: xlast - xfirst, 
        z: zlast - zfirst
    }
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

export function SetBase(originPoint, distance1, degree1) {

    _originPoint = originPoint
    _distance1 = distance1
    _degree1 = degree1

    let sphere = document.createElement("a-sphere")
    sphere.setAttribute("id", "dragginSphere")
    sphere.setAttribute("radius", ".05")
    sphere.setAttribute("color", "green")
    sphere.setAttribute("position", _originPoint.x + " " + _originPoint.y + " " + _originPoint.z) 

    let line = document.createElement("a-entity")
    line.setAttribute("id", "dragginLine")
    line.setAttribute("line", "start", sphere.object3D.position)
    line.setAttribute("line", "end", "")
    line.setAttribute("line", "color", "blue")
    line.setAttribute("line-draggin-floor", "")

    _scene.appendChild(sphere)
    _scene.appendChild(line)
}

AFRAME.registerComponent('line-draggin-floor', {
    tick: function () {
        let targets = document.querySelectorAll(".structureTarget")
        let raycaster = document.querySelector("#cursor-edit").components.raycaster
        let intersection
        let _target
        targets.forEach(target => {
            if(intersection == null) {
                intersection = raycaster.getIntersection(target) 
                _target = target
            }
        });
    
        this.el.setAttribute("line", "start",  _originPoint)
        this.el.setAttribute("line", "end", intersection.point)
        let cameraRotationHorizontal = NormalizeAngleInRadians(_cameraRotation.y)
        let cameraRotationVertical = NormalizeAngleInRadians(_cameraRotation.x)
        let distance2 = Math.abs(intersection.distance * Math.sin((Math.PI / 2) - cameraRotationVertical))

        let size = CalculateSize(_distance1, distance2, _degree1.horizontal, cameraRotationHorizontal)

        CreateOrModifyBaseGuideLine(_originPoint, (_originPoint.x + size.x), "startLineX", "x")
        CreateOrModifyBaseGuideLine(_originPoint, (_originPoint.z + size.z), "startLineZ", "z")
        CreateOrModifyBaseGuideLine(intersection.point, _originPoint.x, "endLineX", "x")
        CreateOrModifyBaseGuideLine(intersection.point, _originPoint.z, "endLineZ", "z")
        
    }
});

export function SetCylinderBase(originPoint, distance1, degree1) {

    _originPoint = originPoint
    _distance1 = distance1
    _degree1 = degree1

    let sphere = document.createElement("a-sphere")
    sphere.setAttribute("id", "dragginSphere")
    sphere.setAttribute("radius", ".05")
    sphere.setAttribute("color", "green")
    sphere.setAttribute("position", _originPoint.x + " " + _originPoint.y + " " + _originPoint.z) 

    let line = document.createElement("a-entity")
    line.setAttribute("id", "dragginLine")
    line.setAttribute("line", "start", sphere.object3D.position)
    line.setAttribute("line", "end", "")
    line.setAttribute("line", "color", "blue")
    line.setAttribute("line-draggin-cylinder-base", "")

    _scene.appendChild(sphere)
    _scene.appendChild(line)
}

AFRAME.registerComponent('line-draggin-cylinder-base', {
    tick: function () {
        let targets = document.querySelectorAll(".structureTarget")
        let raycaster = document.querySelector("#cursor-edit").components.raycaster
        let intersection
        let _target
        targets.forEach(target => {
            if(intersection == null) {
                intersection = raycaster.getIntersection(target) 
                _target = target
            }
        });
    
        this.el.setAttribute("line", "start",  _originPoint)
        this.el.setAttribute("line", "end", intersection.point)
        let cameraRotationHorizontal = NormalizeAngleInRadians(_cameraRotation.y)
        let cameraRotationVertical = NormalizeAngleInRadians(_cameraRotation.x)
        let distance2 = Math.abs(intersection.distance * Math.sin((Math.PI / 2) - cameraRotationVertical))

        let size = CalculateSize(_distance1, distance2, _degree1.horizontal, cameraRotationHorizontal)

        CreateOrModifyBaseGuideLine(_originPoint, (_originPoint.x + size.x), "startLineX", "x")       
    }
});


export function SetVolume(distance2, degree2) {
    
    distance2 != null && (_distance2 = distance2)
    degree2 !=  null && (_degree2 = degree2)

    let dragginLine = document.querySelector("#dragginLine")
    dragginLine != null && dragginLine.remove()
    let dragginSphere = document.querySelector("#dragginSphere")
    dragginSphere != null && dragginSphere.remove()
    
    let line = document.createElement("a-entity")
    line.setAttribute("id", "dragginLine")
    line.setAttribute("line", "start", _originPoint.x + " " + _originPoint.y + " " + _originPoint.z)
    line.setAttribute("line", "end", "")
    line.setAttribute("line", "color", "blue")
    line.setAttribute("line-draggin-cube", "")

    _scene.appendChild(line)
}

AFRAME.registerComponent('line-draggin-cube', {
    tick: function () {
        let cameraRotationVertical = NormalizeAngleInRadians(_cameraRotation.x)
        let diffFirstVerticalAngleAndCurrent = cameraRotationVertical - _degree2.vertical

        let height = Math.tan(diffFirstVerticalAngleAndCurrent) * _distance2
        let targetPoint = new THREE.Vector3(_originPoint.x, _originPoint.y + height, _originPoint.z)
        this.el.setAttribute("line", "end", targetPoint)

        let baseLine1
        let baseLine2

        let lines = document.querySelectorAll(".temporalGizmo")
        lines.forEach(line => {
            if(line.getAttribute("id") == "startLineX") 
                baseLine1 = line.getAttribute("line")
            else if(line.getAttribute("id") == "endLineX")
                baseLine2 = line.getAttribute("line")
        })
    
        if(baseLine1 != null && baseLine2) {
            let newOriginStart = new THREE.Vector3(baseLine1.start.x, baseLine1.start.y + height, baseLine1.start.z)
            let newOriginEnd = new THREE.Vector3(baseLine2.start.x, baseLine2.start.y + height, baseLine2.start.z)
    
            CreateOrModifyCubeGuideLine(newOriginStart, baseLine2.end, "startLineUpX")
            CreateOrModifyCubeGuideLine(newOriginStart, baseLine1.end, "startLineUpZ")
            CreateOrModifyCubeGuideLine(newOriginEnd, baseLine1.end, "endLineUpZ")
            CreateOrModifyCubeGuideLine(newOriginEnd, baseLine2.end, "endLineUpX")
        }
        }
    });


export function SetOffset(distance2, degree2) {
    
    _distance2 = distance2
    _degree2 = degree2

    let dragginLine = document.querySelector("#dragginLine")
    dragginLine != null && dragginLine.remove()
    let dragginSphere = document.querySelector("#dragginSphere")
    dragginSphere != null && dragginSphere.remove()

    let line = document.createElement("a-entity")
    line.setAttribute("id", "dragginLine")
    line.setAttribute("line", "start", _originPoint.x + " " + _originPoint.y + " " + _originPoint.z)
    line.setAttribute("line", "end", "")
    line.setAttribute("line", "color", "blue")
    line.setAttribute("line-draggin-offset", "")

    _scene.appendChild(line)

}

AFRAME.registerComponent('line-draggin-offset', {
    tick: function () {
        let cameraRotationVertical = NormalizeAngleInRadians(_cameraRotation.x)
        let diffFirstVerticalAngleAndCurrent = cameraRotationVertical - _degree1.vertical

        let height = Math.tan(diffFirstVerticalAngleAndCurrent) * _distance1
        let targetPoint = new THREE.Vector3(_originPoint.x, height, _originPoint.z)
        this.el.setAttribute("line", "end", targetPoint)

        _originPoint = targetPoint

        let lines = document.querySelectorAll(".temporalGizmo")

        lines.forEach(lineEl => {
            let line =  lineEl.getAttribute("line")
            let newStartPostion = new THREE.Vector3(line.start.x, height, line.start.z)
            let newEndPosition = new THREE.Vector3(line.end.x, height, line.end.z)
            
            lineEl.setAttribute("line", "start", newStartPostion)
            lineEl.setAttribute("line", "end", newEndPosition)
        })
        
        
        
    }
});


function CreateOrModifyCubeGuideLine(targetPoint, previousLine, id) {
    let currentLine = null
    let lines = document.querySelectorAll(".temporalGizmo")
    lines.forEach(line => {
        if(currentLine == null && line.getAttribute("id") == id)
            currentLine = line
    })
    if(!currentLine) {
        let line = document.createElement("a-entity")
        line.setAttribute("id", id)
        line.setAttribute("class", "temporalGizmo gizmos")
        line.setAttribute("line", "start", targetPoint)
        line.setAttribute("line", "color", "green")
        _scene.appendChild(line)
    } else {
        currentLine.setAttribute("line", "start", targetPoint)
        currentLine.setAttribute("line", "end", previousLine.x + " " + targetPoint.y + " " + previousLine.z )
    }
}


function CreateOrModifyBaseGuideLine(originPoint, endPoint, id, orientation) {
    let currentLine = null
    let lines = document.querySelectorAll(".temporalGizmo")
    lines.forEach(line => {
        if(currentLine == null && line.getAttribute("id") == id)
            currentLine = line
    })
    if(!currentLine) {
        let line = document.createElement("a-entity")
        line.setAttribute("id", id)
        line.setAttribute("line", "start", originPoint)
        line.setAttribute("line", "color", "green")
        line.setAttribute("class", "temporalGizmo gizmos")
        _scene.appendChild(line)
    } else {
        currentLine.setAttribute("line", "start", originPoint)

        if(orientation == "x")
            currentLine.setAttribute("line", "end", endPoint + " " + originPoint.y + " " + originPoint.z)
        else if(orientation == "z")
            currentLine.setAttribute("line", "end", originPoint.x + " " + originPoint.y + " " + endPoint)
    }
}

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

