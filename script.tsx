const audio = new Audio("STAY.mp3");
audio.loop = true;
audio.volume = 1.0;
audio.play();
const Play = document.getElementById("Play");
Play?.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});
function render() {
    return <button type="button" id="Play">Play Audio</button>
}