// ================= TOASTR FOR ALERTS ====================

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


// =================== DROPDOWN ==========================

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


// ====================== PIXI =============================

function findNode(id){
    return nodes[id];
}

function drawAllNodes(item, index){
    let graphics = new PIXI.Graphics();
    graphics = drawBlock(graphics, item.position.x, item.position.y, item.color);
    //app.stage.addChild(graphics);
    item.graphics = graphics;
    nodes[item.id] = item;
}

function drawAllVertices(item, index){
    let graphics = new PIXI.Graphics();
    let node1 = findNode(item.from);
    let node2 = findNode(item.to);
    graphics = drawLine(graphics, node1.position.x + 36, node1.position.y + 50, node2.position.x + 36, node2.position.y + 50, item.color);
    //app.stage.addChild(graphics);
    item.graphics = graphics;
    vertices[item.id] = item;

    /*
    const arrowhead = new PIXI.Sprite(PIXI.Texture.from("https://img.favpng.com/7/3/7/arrow-computer-icons-sprite-png-favpng-2Et73kBc6NLSRVSGA4md6xBZp.jpg"));
    arrowhead.crossOrigin = "";
    arrowhead.anchor = 0.5;
    arrowhead.x = 200;
    arrowhead.y = 200;
    arrowhead.rotation = Math.PI * 2 - Math.atan((node2.position.y - node1.position.y)/(node2.position.x - node1.position.x));
    container.addChild(arrowhead);
    */

}

// task 1
function import_json_submit(){
    var files = document.getElementById('selectFiles').files;
    console.log(files);
    if (files.length <= 0) {
        showMessage("You need to import JSON file first!","warning");
    }else{

        var fr = new FileReader();

        fr.onload = function(e) { 
            try{
                console.log(e);
                var result = JSON.parse(e.target.result);

                result.nodes.forEach(drawAllNodes);
                result.vertices.forEach(drawAllVertices);

                for (var key in vertices){
                    app.stage.addChild(vertices[key].graphics);
                }
                for (var key in nodes){
                    app.stage.addChild(nodes[key].graphics);
                }

                showMessage("Successfully imported JSON file","success");
            }catch(err){
                console.log(err.message);
                showMessage("Wrong format of data!","error");
            }
        }

        fr.readAsText(files.item(0));
        //showMessage("Funkcija 1 pozvana","success");
    }
}

function proba(){
    //setTimeout(function(){proba()}, 5000);
    graphics.clear();
    graphics = drawBlock(graphics, 150, 250, "0xFFFFFF");
    graphics3.clear();
    graphics3 = drawLine(graphics3, 186, 300, 486, 300, "0x747474")
    showMessage("PROBAAAA","success");
}

// task 2
function highlight_element_submit(){
    let nodeId = document.getElementById('highlightElementId').value;
    if (nodeId == ""){
        showMessage("You need to fill the Id textbox first!","warning");
    }else{
        let node = findNode(nodeId);
        if (node){
            node.graphics.clear();
            node.graphics = drawBlock(node.graphics, node.position.x, node.position.y, "0xFFFFFF");
            node.highlighted = true;
            nodes[nodeId] = node;
            showMessage("Successfully highlighted the element","success");
        }else{
            showMessage("There is no such element!","error");
        }
    }
}

//task 3
function unhighlight_element_submit(){
    let nodeId = document.getElementById('unhighlightElementId').value;
    if (nodeId == ""){
        showMessage("You need to fill the Id textbox first!","warning");
    }else{
        let node = findNode(nodeId);
        if (node){
            if (node.highlighted){
                node.graphics.clear();
                node.graphics = drawBlock(node.graphics, node.position.x, node.position.y, node.color);
                node.highlighted = false;
                nodes[nodeId] = node;
                showMessage("Successfully unhighlighted the element","success");
            }else{
                showMessage("Given element has not been highlighted!","info");
            }
        }else{
            showMessage("There is no such element!","error");
        }
    }
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
let nodes = {};
let vertices = {};

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
    //graphics.quadraticCurveTo(x1, y2, x2, y2);
    return graphics;
}

const app = new PIXI.Application({ antialias: true, transparent: true });
const displayDiv = document.getElementById('main');

app.view.style.position = "absolute";
app.view.style.width = (window.innerWidth * 0.75 - 10) + "px";
app.view.style.height = (window.innerHeight * 0.85 - 10) + "px";
app.view.style.display = "block";

displayDiv.appendChild(app.view);

const container = new PIXI.Container();
app.stage.addChild(container);

/*
let graphics = new PIXI.Graphics();
graphics = drawBlock(graphics, 150, 250, "0xFFFFFF");

let graphics2 = new PIXI.Graphics();
graphics2 = drawBlock(graphics2, 450, 250, "0xFF0000");

let graphics3 = new PIXI.Graphics();
graphics3 = drawLine(graphics3, 186, 300, 486, 300, "0x747474");

app.stage.addChild(graphics3);
app.stage.addChild(graphics);
app.stage.addChild(graphics2);
*/