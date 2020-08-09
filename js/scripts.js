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

function findVertice(id){
    return vertices[id];
}

function drawAllNodes(item, index){

    /*
    block = new PIXI.Sprite.from("../images/block-01.png");
    console.log("CAOOOOOO");
    console.log(item.id);
    block.x = item.position.x;
    block.y = item.position.y;
    block.height = 100;
    block.width = 75;
    block.anchor.set(0.5);
    block.tint = item.color;
    //block.convertTo3d();
    */

    block = new PIXI.projection.Sprite2d.from("../images/block-01.png");
    block.anchor.set(0.5, 0.5);
    block.convertTo3d();
    block.proj.affine = PIXI.projection.AFFINE.AXIS_X;
    block.position.set(item.position.x, item.position.y);
    block.height = 100;
    block.width = 75;
    block.tint = item.color;
    // interaction
    block.interactive = true;
    block.on('pointerover', (event) => onPointerOver(block, item.id));
    block.on('pointerout', (event) => onPointerOut(block, item.id));

    /*
    let step = 0;
    app.ticker.add((delta) => {
        step += delta;
        block.rotation = step * 0.03;
    });
    */

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
    //interaction
    arrowhead.interactive = true;
    arrowhead.on('pointerover', (event) => onPointerOver(arrowhead, item.id));
    arrowhead.on('pointerout', (event) => onPointerOut(arrowhead, item.id));
    
    //app.stage.addChild(arrowhead);
    item.arrowhead = arrowhead;
    vertices[item.id] = item;

}

function onPointerOver(object, text) {
    textId.text = "ID : " + text;
}

function onPointerOut(object, text) {
    textId.text = "-";
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
                
                cleanStage();

                result.nodes.forEach(drawAllNodes);
                result.vertices.forEach(drawAllVertices);

                for (var key in vertices){
                    app.stage.addChild(vertices[key].graphics);
                }

                for (var key in vertices){
                    app.stage.addChild(vertices[key].arrowhead);
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
    }
}

// task 2
function highlight_element_submit(){
    let nodeId = document.getElementById('highlightElementId').value;
    if (nodeId == ""){
        showMessage("You need to fill the Id textbox first!","warning");
    }else{
        let node = findNode(nodeId);
        if (node){
            //node.graphics.tint = 0xFFFFFF;
            node.graphics.filters = [new PIXI.filters.GlowFilter(15, 2, 1, 0xff9999, 0.5)];
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
                //node.graphics.tint = node.color;
                node.graphics.filters = [];
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

// task 4
function time_highlighting_element_submit(){
    let nodeId = document.getElementById('timeHighlightingElementId').value;
    let time = document.getElementById('highlightingElementTime').value;
    if (nodeId == "" || time == ""){
        showMessage("You need to fill both textbox!","warning");
    } else if(time <= 0 || time > 20) {
        showMessage("Time must be in a range 1s to 20s!", "warning");
    } else{
        let node = findNode(nodeId);
        if (!node.highlighted){
            node.graphics.filters = [new PIXI.filters.GlowFilter(15, 2, 1, 0xff9999, 0.5)];
            node.highlighted = true;
            nodes[nodeId] = node;
            showMessage("Successfully highlighted the element","success");
        }
        setTimeout(function(){
            node.graphics.filters = [];
            node.highlighted = false;
            nodes[nodeId] = node;
            showMessage("Successfully unhighlighted the element","success");
        }, time * 1000);
    }
}

//task 5
function show_name_submit(){
    let nodeId = document.getElementById('showNameId').value;
    if (nodeId == ""){
        showMessage("You need to fill the Id textbox first!","warning");
    }else{
        let node = findNode(nodeId);
        if (node){
            if (!node.nameShowed){
                nodeName = new PIXI.Text(node.name, {fontFamily : 'Arial', fontSize: 16, fill: "black"});
                nodeName.x = node.position.x;
                nodeName.y = node.position.y - node.graphics.height * 0.27;
                nodeName.anchor.set(0.5);
                nodeName.filters = [new PIXI.filters.GlowFilter(15, 2, 1, 0xff9999, 0.5)];
                node.nodeName = nodeName;
                app.stage.addChild(nodeName);
                node.nameShowed = true;
                nodes[nodeId] = node;
                showMessage("Successfully showed the name of the element","success");
            } else {
                showMessage("Name for the given element has been already showned!","info");
            }
        }else{
            showMessage("There is no such element!","error");
        }
    }
}

function hide_name_submit(){
    showMessage("Funkcija 6 pozvana","success");
}

function time_showing_name_submit(){
    showMessage("Funkcija 7 pozvana","success");
}

// task 8
function send_a_message_submit(){
    let paths = document.getElementById('sendMessagePath').value;
    let time = document.getElementById('sendMessageTime').value;

    if (paths == "" || time == ""){
        showMessage("You need to fill both textbox!","warning");
    } else if(time <= 0 || time > 30) {
        showMessage("Time must be in a range 1s to 30s!", "warning");
    } else{

        let allValid = true;
        var path = paths.split(" ");
        console.log(path.length);
        for (var id in path){
            if (!findVertice(path[id])){
                showMessage("There is no such vertice with an id " + path[id],"warning");
                allValid = false;
                break;
            }
        }
        if (allValid){

            let vertice0 = findVertice(path[0]);
            let node0 = findNode(vertice0.from);
            message.x = node0.position.x;
            message.y = node0.position.y;
            app.stage.addChild(message);    

            for (var i = 0; i < path.length; i++){
                let vertice = findVertice(path[i]);
                let node1 = findNode(vertice.from);
                let node2 = findNode(vertice.to);

                let k = function() {
                    message.x += (node2.position.x - node1.position.x)/(time * 1000 / path.length) * app.ticker.elapsedMS;
                    message.y += (node2.position.y - node1.position.y)/(time * 1000 / path.length) * app.ticker.elapsedMS;
                }

                setTimeout(function(){ app.ticker.add(k);}, i * (time * 1000 / path.length));
                setTimeout(function(){ app.ticker.remove(k);}, (i + 1) * (time * 1000 / path.length));

            }

            setTimeout(function(){
                showMessage("Succesfully sent a message!!", "success");
                app.stage.removeChild(message); 
            }, time * 1000);   
        }
    }
}


// ==== PIXIIIII ======
let nodes = {};
let vertices = {};
// for task 8 purposes
let message = new PIXI.Sprite.from("../images/message.png");
message.x = 0;
message.y = 0;
message.height = 30;
message.width = 20;
message.anchor.set(0.5);
message.tint = 0x000000;

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

function drawLine(graphics, x1, y1, x2, y2, color){
    graphics.lineStyle(3, color, 1);
    graphics.moveTo(x1, y1);
    graphics.lineTo(x2, y2);
    //graphics.quadraticCurveTo(x1, y2, x2, y2);
    return graphics;
}

function drawBackgroundGrid(){
    graphics = new PIXI.Graphics();
    graphics2 = new PIXI.Graphics();
    graphics.lineStyle(0.7
                       , "0x343535", 1);
    graphics2.lineStyle(0.7
                        , "0x343535", 1);
    graphics.rotation = Math.PI * 0.29;
    graphics2.rotation = Math.PI * 0.21;

    for (let i = -2 * app.view.height; i <= 3 * app.view.height; i += 50) {
        graphics2.moveTo(-2 * app.view.width, i);
        graphics2.lineTo(3 * app.view.width, i);
    }

    for (let i = -2 * app.view.width; i <= 3 * app.view.width; i += 50) {
        graphics.moveTo(i, 3 * app.view.height);
        graphics.lineTo(i, -2 * app.view.height);
    }

    app.stage.addChild(graphics);
    app.stage.addChild(graphics2);

    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xFFFFFF);
    rectangle.drawRect(7/8 * app.view.width, 13/14 * app.view.height, 1/8 * app.view.width, 1/14 * app.view.height);
    rectangle.endFill();
    app.stage.addChild(rectangle);
    app.stage.addChild(textId);
}

function cleanStage(){
    for (var i = app.stage.children.length - 1; i >= 0; i--) {	
        app.stage.removeChild(app.stage.children[i]);
    }
    nodes = {};
    vertices = {};
    drawBackgroundGrid();
}

const app = new PIXI.Application({ antialias: true, transparent: true });
const displayDiv = document.getElementById('main');

app.view.style.position = "absolute";
app.view.style.width = (window.innerWidth * 0.75 - 10) + "px";
app.view.style.height = (window.innerHeight * 0.85 - 10) + "px";
app.view.style.display = "block";

displayDiv.appendChild(app.view);

// for id of sprites
let textId = new PIXI.Text("-", {fontFamily : 'Arial', fontSize: 16, fill: "black"});
textId.x = 15/16 * app.view.width;
textId.y = 27/28 * app.view.height;
textId.anchor.set(0.5);

drawBackgroundGrid();