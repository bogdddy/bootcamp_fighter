//Allows drop
function allowDrop(ev) {
    ev.preventDefault();
}

//Allows drag
function drag(ev) {
    ev.dataTransfer.setData("character", ev.target.id);
}

//Executes drop and saves data to localstorage
function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("character");
    let target = $(`#${ev.target.id}`)
    console.log(target.id)
    target.attr("src", $(`#${data}`).attr("src"))
    target.attr("class", $(`#${data}`).attr("class"))

    localStorage.setItem(ev.target.id, data)
}

$("#fight").on("click", function () { window.location.href = "pages/game.html" })