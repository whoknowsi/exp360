import { LoseFocus } from "./ElementMovement.js"

export function ShowDeleteButton(id) {
    let _id = id
    let isABoxOfAStructure = id.includes("structure-")
    if(isABoxOfAStructure) {
        _id = "container-structure-" + id.split("-")[1] 
    }
    console.log(id)
    let target = document.querySelector("#" + _id)
    let deleteStructureButton = document.createElement("button")
    deleteStructureButton.setAttribute("id", "deleteStructureButton")
    deleteStructureButton.textContent = "Borrar estructura"
    deleteStructureButton.addEventListener("click", () => {
        deleteStructureButton.remove()
        target.remove()
        LoseFocus()
    })

    let buttonContainer = document.querySelector(".buttonContainer")
    buttonContainer.appendChild(deleteStructureButton)
}

export function RemoveDeleteButton() {
    let button = document.querySelector("#deleteStructureButton")
    button != null && button.remove()
}


