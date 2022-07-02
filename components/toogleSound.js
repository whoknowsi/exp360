window.onload = initialize;

function initialize() {
    
    document.querySelector('#soundButton').addEventListener('click', toogleSound);

    document.querySelector('#soundButton').addEventListener('sound-ended', function() {
        let playingMusic = imag360.getAttribute("class", "playing-music")
        if (playingMusic) {
            imag360.components.sound.playSound()
        }
    })

    function toogleSound() {
        
        let imag360 = document.querySelector('#imag360')
        let soundImg = document.querySelector('#soundImg')
        
        let playingMusic = imag360.getAttribute("class", "playing-music")

        if (playingMusic) {
            soundImg.src = "../img/volumenOff.png"
            imag360.components.sound.stopSound()
        } else {
            soundImg.src = "../img/volumenGif.gif"
            imag360.components.sound.playSound()
        }

        imag360.classList.toggle("playing-music")
    }


}