let saveButton = document.querySelector("#saveButton")
saveButton.addEventListener("click", () => {
    let saveName = "data"
    let data = {
        "structures": [],
        "skySpots": [],
        "infoSpots": []
    }

    let structures = document.querySelectorAll(".structure")
    let spotTargets = document.querySelectorAll(".skyChanger")
    let infoSpots = document.querySelectorAll(".infoSpot")

    structures.forEach(structure => {
        let x = structure.parentElement.getAttribute("position").x
        let y = structure.parentElement.getAttribute("position").y
        let z = structure.parentElement.getAttribute("position").z

        if(isNaN(x) || isNaN(y) || isNaN(z) || x == null || y == null || z == null) { return }

        if(x < 0.000001 && x > -0.000001) x = 0
        if(y < 0.000001 && y > -0.000001) y = 0
        if(z < 0.000001 && z > -0.000001) z = 0
        
        data.structures.push({ 
            "id": structure.getAttribute("id"),
            "primitive": structure.components.geometry.attrValue.primitive,
            "depth": structure.components.geometry.attrValue.depth,
            "height": structure.components.geometry.attrValue.height,
            "width": structure.components.geometry.attrValue.width,
            "radius": structure.components.geometry.attrValue.radius,
            "position": {
                "x": x,
                "y": y,
                "z": z
            }
        })
    })

    spotTargets.forEach(spotTarget => {
        let x = spotTarget.getAttribute("position").x
        let y = spotTarget.getAttribute("position").y
        let z = spotTarget.getAttribute("position").z

        if(isNaN(x) || isNaN(y) || isNaN(z) || x == null || y == null || z == null) { return }

        if(x < 0.000001 && x > -0.000001) x = 0
        if(y < 0.000001 && y > -0.000001) y = 0
        if(z < 0.000001 && z > -0.000001) z = 0
        data.skySpots.push({ 
            "id": spotTarget.getAttribute("id"),
            "rotation": spotTarget.getAttribute("change-sky").rotation,
            "target": spotTarget.getAttribute("change-sky").target,
            "position": {
                "x": x,
                "y": y,
                "z": z
            },
            "current": spotTarget.classList.contains("current")
        })
    })
    
    infoSpots.forEach(infoSpot => {
        let x = infoSpot.getAttribute("position").x
        let y = infoSpot.getAttribute("position").y
        let z = infoSpot.getAttribute("position").z

        let startPosition
        let prevSibling = infoSpot.previousElementSibling;
        let nextSibling = infoSpot.nextSibling;
        prevSibling != null && (startPosition = prevSibling.getAttribute("line").start)
        nextSibling != null && (startPosition = nextSibling.getAttribute("line").start)

        if(isNaN(x) || isNaN(y) || isNaN(z) || x == null || y == null || z == null) { return }
        if(isNaN(startPosition.x) || isNaN(startPosition.y) || isNaN(startPosition.z)) { return }

        if(x < 0.000001 && x > -0.000001) x = 0
        if(y < 0.000001 && y > -0.000001) y = 0
        if(z < 0.000001 && z > -0.000001) z = 0

        if(startPosition.x < 0.000001 && startPosition.x > -0.000001) startPosition.x = 0
        if(startPosition.y < 0.000001 && startPosition.y > -0.000001) startPosition.y = 0
        if(startPosition.z < 0.000001 && startPosition.z > -0.000001) startPosition.z = 0

        data.infoSpots.push({ 
            "id": infoSpot.getAttribute("id"),
            "info-spot": {
                "title":  infoSpot.getAttribute("info-spot").title,
                "description": infoSpot.getAttribute("info-spot").description,
                "image": infoSpot.getAttribute("info-spot").image
            },
            "position": {
                "x": x,
                "y": y,
                "z": z
            },
            "startPosition": {
                "x": startPosition.x,
                "y": startPosition.y,
                "z": startPosition.z
            }
        })
    })

    fetch("http://localhost:3000/api/data/" + saveName, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log('Success:', response)
            downloadObjectAsJson(data, saveName)
        })
})

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}