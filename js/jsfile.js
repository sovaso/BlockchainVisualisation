function showMessage(message, type) {
    if (type != "success" && type != "error" && type != "warning"
        && type != "info") {
        type = "info";
    }
    toastr.options = {
        "closeButton" : true,
        "debug" : false,
        "newestOnTop" : false,
        "progressBar" : false,
        "positionClass" : "toast-top-right",
        "preventDuplicates" : false,
        "showDuration" : "300",
        "hideDuration" : "1000",
        "timeOut" : "5000",
        "extendedTimeOut" : "1000",
        "showEasing" : "swing",
        "hideEasing" : "linear",
        "showMethod" : "fadeIn",
        "hideMethod" : "fadeOut"
    }
    toastr[type](message);
}

document.getElementById('import').onclick = function() {
    var files = document.getElementById('selectFiles').files;
    console.log(files);
    if (files.length <= 0) {
        return false;
    }

    var fr = new FileReader();

    fr.onload = function(e) { 
        console.log(e);
        var result = JSON.parse(e.target.result);
        var formatted = JSON.stringify(result, null, 2);
        document.getElementById('result').value = formatted;
    }

    fr.readAsText(files.item(0));
};

//* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content - This allows the user to have multiple dropdowns without any conflict */
var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "block";
        }
    });
}

function funkcija1(){
    showMessage("Funkcija 1 pozvana","success");
}

function proba(){
    graphics.clear();
    graphics = drawBlock(graphics, 150, 250, "0xFFFFFF");
    graphics3.clear();
    graphics3 = drawLine(graphics3, 186, 300, 486, 300, "0x747474")
    showMessage("PROBAAAA","success");
}

function highlight_element_submit(){
    graphics.clear();
    graphics = drawBlock(graphics, 150, 350, "0x00FF00");
    graphics3.clear();
    graphics3 = drawLine(graphics3, 186, 400, 486, 300, "0x747474")
    showMessage("Funkcija 2 pozvana","success");
    setTimeout(function(){proba()}, 5000);
}

function unhighlight_element_submit(){
    showMessage("Funkcija 3 pozvana","success");
}

function time_highlighting_element_submit(){
    showMessage("Funkcija 4 pozvana","success");
}

function show_name_submit(){
    showMessage("Funkcija 5 pozvana","success");
}

function hide_name_submit(){
    showMessage("Funkcija 6 pozvana","success");
}

function time_showing_name_submit(){
    showMessage("Funkcija 7 pozvana","success");
}

function send_a_message_submit(){
    showMessage("Funkcija 8 pozvana","success");
}

// ==== PIXIIIII ======
window.addEventListener("resize", event => {
    scaleToWindow(app.view);
});

function scaleToWindow(appWin){
    appWin.style.position = "absolute";
    appWin.style.width = (window.innerWidth * 0.75 - 10) + "px";
    appWin.style.height = (window.innerHeight * 0.85 - 10) + "px";
    appWin.style.display = "block";
    return appWin;
}

function drawBlock(graphics, x, y, color){
    graphics.lineStyle(1, 0x000000, 1);
    graphics.beginFill(color);
    graphics.drawRect(x, y, 72, 100);

    graphics.moveTo(x, y);
    graphics.lineTo(x + 25, y - 30);
    graphics.lineTo(x + 97, y - 30);
    graphics.lineTo(x + 72, y);
    graphics.closePath();

    graphics.moveTo(x + 72, y);
    graphics.lineTo(x + 97, y - 30);
    graphics.lineTo(x + 97, y + 70);
    graphics.lineTo(x + 72, y + 100);
    graphics.closePath();

    graphics.endFill();

    return graphics;
}

function drawLine(graphics, x1, y1, x2, y2, color){
    graphics.lineStyle(3, color, 1);
    graphics.moveTo(x1, y1);
    graphics.lineTo(x2, y2);
    return graphics;
}

const app = new PIXI.Application({ antialias: true, transparent: true });
const displayDiv = document.getElementById('main');

app.view.style.position = "absolute";
app.view.style.width = (window.innerWidth * 0.75 - 10) + "px";
app.view.style.height = (window.innerHeight * 0.85 - 10) + "px";
app.view.style.display = "block";

displayDiv.appendChild(app.view);

let graphics = new PIXI.Graphics();
graphics = drawBlock(graphics, 150, 250, "0xFFFFFF");

let graphics2 = new PIXI.Graphics();
graphics2 = drawBlock(graphics2, 450, 250, "0xFF0000");

let graphics3 = new PIXI.Graphics();
graphics3 = drawLine(graphics3, 186, 300, 486, 300, "0x747474")

app.stage.addChild(graphics3);
app.stage.addChild(graphics);
app.stage.addChild(graphics2);