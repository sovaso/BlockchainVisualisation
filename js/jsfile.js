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
    //let graphics = new PIXI.Graphics();
    //graphics = drawBlock(graphics, item.position.x, item.position.y, item.color);
    //app.stage.addChild(graphics);
    
    block = new PIXI.Sprite.from("../images/block-01.png");
    console.log("CAOOOOOO");
    console.log(item.id);
    block.x = item.position.x;
    block.y = item.position.y;
    block.height = 100;
    block.width = 75;
    block.anchor.set(0.5);
    block.tint = item.color;
    
    item.graphics = block;
    nodes[item.id] = item;
}

function drawAllVertices(item, index){
    let graphics = new PIXI.Graphics();
    let node1 = findNode(item.from);
    let node2 = findNode(item.to);
    graphics = drawLine(graphics, node1.position.x, node1.position.y, node2.position.x, node2.position.y, item.color);
    //app.stage.addChild(graphics);
    item.graphics = graphics;
    vertices[item.id] = item;

    /* */
    arrowhead = new PIXI.Sprite.from("../images/arrowhead3-01.png");
    console.log("CAOOOOOO");
    console.log(item.id);
    arrowhead.x = node1.position.x + (node2.position.x - node1.position.x) * 0.67;
    arrowhead.y = node1.position.y + (node2.position.y - node1.position.y) * 0.67;
    arrowhead.height = 20;
    arrowhead.width = 20;
    arrowhead.anchor.set(0.5);
    //arrowhead.tint = 0xadd8e6;
    if (node2.position.y == node1.position.y){
        if (node2.position.x < node1.position.x){
            arrowhead.rotation = Math.PI;
        }
    } else if (node2.position.x == node1.position.x){
        if (node2.position.y > node1.position.y){
            arrowhead.rotation = 0.5 * Math.PI;
        } else {
            arrowhead.rotation = 1.5 * Math.PI;
        }
    } else {
        if (node2.position.x > node1.position.x && node2.position.y > node1.position.y){
            arrowhead.rotation = Math.atan((node2.position.y - node1.position.y)/(node2.position.x - node1.position.x));
        }else if (node2.position.x > node1.position.x && node2.position.y < node1.position.y){
            arrowhead.rotation = Math.atan((node2.position.y - node1.position.y)/(node2.position.x - node1.position.x));
        }else{
            arrowhead.rotation = Math.PI + Math.atan((node2.position.y - node1.position.y)/(node2.position.x - node1.position.x));
        }
    }
    console.log(arrowhead);
    app.stage.addChild(arrowhead);

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
            node.graphics.tint = 0xFFFFFF;
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
                node.graphics.tint = node.color;
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
    let node1 = findNode(101);
    let node2 = findNode(102);
    let circle = new PIXI.Graphics();
    circle.beginFill(0x000000);
    circle.lineStyle(4, 0x006600, 1);
    circle.drawCircle(node1.position.x + 36, node1.position.y + 50, 20);
    circle.endFill();
    app.stage.addChild(circle);
    var x = node1.position.x + 36;
    var y = node1.position.y + 50;
    for (var i = 0; i < 100; i++){
        setTimeout(function(){
            console.log(x);
            console.log(y);
            circle.clear();
            //circle.x += (node2.position.x - node1.position.x) / 100;
            //circle.y += (node2.position.y - node1.position.y) / 100;
            circle.beginFill(0x000000);
            circle.lineStyle(4, 0x006600, 1);
            x += (node2.position.x - node1.position.x) / 100;
            y += (node2.position.y - node1.position.y) / 100;
            circle.drawCircle(x, y, 20);
            circle.endFill();

        }, 20);
    }
    circle.clear();
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

/*
arrowhead = new PIXI.Sprite.from("../images/logo-01.png");
console.log("CAOOOOOO222");
arrowhead.x = 250;
arrowhead.y = 250;
arrowhead.height = 100;
arrowhead.width = 100;
arrowhead.anchor.set(0.5);
//arrowhead.rotation = Math.PI * 2 - Math.atan((node2.position.y - node1.position.y)/(node2.position.x - node1.position.x));
app.stage.addChild(arrowhead);
console.log(arrowhead);
*/

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