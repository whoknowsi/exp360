let saveButton = document.querySelector("#saveButton")
saveButton.addEventListener("click", () => {
    let saveName = "data"
    let data = {
        "structures": [],
        "skySpots": []
    }

    let structures = document.querySelectorAll(".structure")
    let spotTargets = document.querySelectorAll(".skyChanger")

    structures.forEach(structure => {
        data.structures.push({ 
            "id": structure.getAttribute("id"),
            "primitive": structure.components.geometry.attrValue.primitive,
            "depth": structure.components.geometry.attrValue.depth,
            "height": structure.components.geometry.attrValue.height,
            "width": structure.components.geometry.attrValue.width,
            "position": {
                "x": structure.parentElement.getAttribute("position").x,
                "y": structure.parentElement.getAttribute("position").y,
                "z": structure.parentElement.getAttribute("position").z
            }
        })
    })

    spotTargets.forEach(spotTarget => {
        data.skySpots.push({ 
            "id": spotTarget.getAttribute("id"),
            "rotation": spotTarget.getAttribute("change-sky").rotation,
            "target": spotTarget.getAttribute("change-sky").target,
            "position": {
                "x": spotTarget.getAttribute("position").x,
                "y": spotTarget.getAttribute("position").y,
                "z": spotTarget.getAttribute("position").z
            },
            "current": spotTarget.classList.contains("current")
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