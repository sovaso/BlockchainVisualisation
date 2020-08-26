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


// ====================== PIXI.JS UTILITY FUNCTIONS =============================

// function to find a node based on id
function findNode(id){
    return nodes[id];
}


// function to find a vertice based on id
function findVertice(id){
    return vertices[id];
}


// whenever some event like rotate, drag... happen, we need to update positions of nodes and text attached to it
function updateNodes(){
    for (var key in nodes){
        if (nodes[key].graphics.position.x < nodes[key].graphics.width / 2){
            nodes[key].graphics.position.x = nodes[key].graphics.width / 2;
        } else if (nodes[key].graphics.position.x > app.view.width - nodes[key].graphics.width / 2){
            nodes[key].graphics.position.x = app.view.width - nodes[key].graphics.width / 2;
        }

        if (nodes[key].graphics.position.y < nodes[key].graphics.height / 2){
            nodes[key].graphics.position.y = nodes[key].graphics.height / 2;
        } else if (nodes[key].graphics.position.y > app.view.height - nodes[key].graphics.height / 2){
            nodes[key].graphics.position.y = app.view.height - nodes[key].graphics.height / 2;
        }

        nodes[key].position.x = nodes[key].graphics.position.x;
        nodes[key].position.y = nodes[key].graphics.position.y;

        if (nodes[key].textShowed){
            nodes[key].nodeText.x = nodes[key].graphics.position.x;
            nodes[key].nodeText.y = nodes[key].graphics.position.y - nodes[key].graphics.height * 0.9;
        }
    }
}


// checking if each of nodes have defined their position
function checkPosition(result){
    for (var key in result){
        if (!result[key].position.x || !result[key].position.y){
            return false;
        }
    }
    return true;
}


// in case there is a node without a position, we need to generate new positions for nodes
function generateNewPosition(result){
    let angle = 2 * Math.PI / result.length;
    x1 = app.view.width / 4;
    y1 = app.view.height * 2/3;
    for (var key in result){
        result[key].position = {};
        result[key].position.x = Math.cos(angle) * (x1 - app.view.width / 2) - Math.sin(angle) * (y1 -app.view.height / 2) + app.view.width/2;
        console.log(result[key].position.x);
        result[key].position.y = Math.sin(angle) * (x1 - app.view.width / 2) + Math.cos(angle) * (y1 -app.view.height / 2) + app.view.height/2;
        x1 = result[key].position.x;
        y1 = result[key].position.y;
    }
    return result;
}


// event that defines what happens on start of the dragging block
function onDragStart(event) {
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}


// event that defines what happens on end of the dragging block
function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;

    updateNodes();

    for (var key in vertices){
        app.stage.removeChild(vertices[key].arrowhead);
        app.stage.removeChild(vertices[key].graphics);
        drawAllVertices(vertices[key], key);
    }

    for (var key in vertices){
        app.stage.addChild(vertices[key].graphics);
    }

    for (var key in vertices){
        app.stage.addChild(vertices[key].arrowhead);
    }
}


// event that defines what happens while dragging a block
function onDragMove() {
    if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}


// function that put all nodes on PIXI.js window so we can play with them
function drawAllNodes(item, index){

    block = new PIXI.projection.Sprite2d.from("../images/block-01.png");
    block.anchor.set(0.5, 0.5);
    block.convertTo3d();
    block.proj.affine = PIXI.projection.AFFINE.AXIS_X;
    block.position.set(item.position.x, item.position.y);
    block.height = 80; //100
    block.width = 60; //75
    block.tint = item.color;
    // interaction
    block.interactive = true;
    block.on('pointerover', (event) => onPointerOver(block, item.id));
    block.on('pointerout', (event) => onPointerOut(block, item.id));
    block.on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

    item.graphics = block;
    nodes[item.id] = item;
}


// function that draws all vertices that are defined in the file
function drawAllVertices(item, index){
    let graphics = new PIXI.Graphics();
    let node1 = findNode(item.from);
    let node2 = findNode(item.to);
    graphics = drawLine(graphics, node1.position.x, node1.position.y, node2.position.x, node2.position.y, item.color);
    item.graphics = graphics;
    vertices[item.id] = item;

    arrowhead = new PIXI.Sprite.from("../images/arrowhead3-01.png");
    arrowhead.x = node1.position.x + (node2.position.x - node1.position.x) * 0.67;
    arrowhead.y = node1.position.y + (node2.position.y - node1.position.y) * 0.67;
    arrowhead.height = 20;
    arrowhead.width = 20;
    arrowhead.anchor.set(0.5);
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

    item.arrowhead = arrowhead;
    vertices[item.id] = item;
}


// when point over a block or a vertice, in the down right corner id of the block will show
function onPointerOver(object, text) {
    textId.text = "ID : " + text;
}

// when pointer is not over a block or a vertice, there is nothing showing
function onPointerOut(object, text) {
    textId.text = "ID : -";
}


//closing sidenav function
function closeSidenav(){
    document.getElementById('sidenav').style.width = '0';
    document.getElementById('main').style.marginLeft = "12.5%";
    document.getElementById('leftSide').style.display = "block";
    document.getElementById('rightSide').style.display = "block";
}


//opening sidenav function
function openSidenav(){
    document.getElementById('sidenav').style.width = '25%';
    document.getElementById('main').style.marginLeft = "25%";
    document.getElementById('leftSide').style.display = "none";
    document.getElementById('rightSide').style.display = "none";
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

                if (result.background){
                    showBackground = true;
                } else {
                    showBackground = false;
                }

                cleanStage();

                if (!checkPosition(result.nodes)){
                    console.log("pozvano");
                    result.nodes = generateNewPosition(result.nodes);
                }

                result.nodes.forEach(drawAllNodes);
                updateNodes();
                result.vertices.forEach(drawAllVertices);

                for (var key in nodes){
                    app.stage.addChild(nodes[key].graphics);
                }

                for (var key in vertices){
                    app.stage.addChild(vertices[key].graphics);
                }

                for (var key in vertices){
                    app.stage.addChild(vertices[key].arrowhead);
                }

                importedJSON = true;
                showMessage("Successfully imported JSON file","success");
            }catch(err){
                showBackground = false;
                cleanStage();
                console.log(err.message);
                importedJSON = false;
                showMessage("Wrong format of data!","error");
            }
        }

        fr.readAsText(files.item(0));
    }
}


// task 2
function highlight_element_submit(){
    if (!importedJSON){
        showMessage("You need to import the JSON file first!","info");
    }else{
        let nodeId = document.getElementById('highlightElementId').value;
        if (nodeId == ""){
            showMessage("You need to fill the Id textbox first!","warning");
        }else{
            let node = findNode(nodeId);
            if (node){
                node.graphics.filters = [new PIXI.filters.GlowFilter({ distance: 20, innerStrength: 0.5, outerStrength: 6, color: '0xCC8899', quality: 0.1})];
                node.highlighted = true;
                nodes[nodeId] = node;
                showMessage("Successfully highlighted the element","success");
            }else{
                showMessage("There is no such element!","error");
            }
        }
    }
}


//task 3
function unhighlight_element_submit(){
    if (!importedJSON){
        showMessage("You need to import the JSON file first!","info");
    }else{
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
}


// task 4
function time_highlighting_element_submit(){
    if (!importedJSON){
        showMessage("You need to import the JSON file first!","info");
    }else{
        let nodeId = document.getElementById('timeHighlightingElementId').value;
        let time = document.getElementById('highlightingElementTime').value;
        if (nodeId == "" || time == ""){
            showMessage("You need to fill both textbox!","warning");
        } else if(time <= 0 || time > 20) {
            showMessage("Time must be in a range 1s to 20s!", "warning");
        } else{
            let node = findNode(nodeId);
            if (!node.highlighted){
                node.graphics.filters = [new PIXI.filters.GlowFilter({ distance: 20, innerStrength: 0.5, outerStrength: 6, color: '0xCC8899', quality: 0.1})];
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
}


//task 5
function show_text_submit(){
    if (!importedJSON){
        showMessage("You need to import the JSON file first!","info");
    }else{
        let nodeId = document.getElementById('showTextId').value;
        let text = document.getElementById('showTextContent').value;
        if (nodeId == "" || text == ""){
            showMessage("You need to fill both textbox!","warning");
        }else{
            let node = findNode(nodeId);
            if (node){
                if (!node.textShowed){
                    nodeText = new PIXI.Text(text, {fontFamily : 'Arial', fontSize: 14, fill: "black", wordWrap: true, wordWrapWidth: 350});
                    nodeText.x = node.position.x;
                    nodeText.y = node.position.y - node.graphics.height * 0.9;
                    nodeText.anchor.set(0.5);
                    nodeText.filters = [new PIXI.filters.GlowFilter({ distance: 20, innerStrength: 0.5, outerStrength: 6, color: '0xCC8899', quality: 0.1})];
                    node.nodeText = nodeText;
                    app.stage.addChild(nodeText);
                    node.textShowed = true;
                    nodes[nodeId] = node;
                    showMessage("Successfully showed the text for the element","success");
                } else {
                    node.nodeText.text = text;
                    showMessage("Successfully showed the text for the element","success");
                }
            }else{
                showMessage("There is no such element!","error");
            }
        }
    }
}


// task 6
function hide_text_submit(){
    if (!importedJSON){
        showMessage("You need to import the JSON file first!","info");
    }else{
        let nodeId = document.getElementById('hideTextId').value;
        if (nodeId == ""){
            showMessage("You need to fill the Id textbox first!","warning");
        }else{
            let node = findNode(nodeId);
            if (node){
                if (node.textShowed){
                    app.stage.removeChild(node.nodeText);
                    node.textShowed = false;
                    nodes[nodeId] = node;
                    showMessage("Successfully hide text from the element","success");
                }else{
                    showMessage("The text for given element has not been showned!","info");
                }
            }else{
                showMessage("There is no such element!","error");
            }
        }
    }
}


// task 7
function time_showing_text_submit(){
    if (!importedJSON){
        showMessage("You need to import the JSON file first!","info");
    }else{
        let nodeId = document.getElementById('timeShowingTextId').value;
        let time = document.getElementById('showingTextTime').value;
        let text = document.getElementById('timeShowingTextContent').value;
        if (nodeId == "" || time == "" || text == ""){
            showMessage("You need to fill all textboxes!","warning");
        } else if(time <= 0 || time > 20) {
            showMessage("Time must be in a range 1s to 20s!", "warning");
        } else{
            let node = findNode(nodeId);
            if (!node.textShowed){
                nodeText = new PIXI.Text(text, {fontFamily : 'Arial', fontSize: 14, fill: "black", wordWrap: true, wordWrapWidth: 350});
                nodeText.x = node.position.x;
                nodeText.y = node.position.y - node.graphics.height * 0.85;
                nodeText.anchor.set(0.5);
                nodeText.filters = [new PIXI.filters.GlowFilter({ distance: 20, innerStrength: 0.5, outerStrength: 6, color: '0xCC8899', quality: 0.1})];
                node.nodeText = nodeText;
                app.stage.addChild(nodeText);
                node.textShowed = true;
                nodes[nodeId] = node;
                showMessage("Successfully showed the text for the element","success");
            } else {
                node.nodeText.text = text;
                showMessage("Successfully showed the text for the element","success");
            }
            setTimeout(function(){
                app.stage.removeChild(node.nodeText);
                node.textShowed = false;
                nodes[nodeId] = node;
                showMessage("Successfully hide the text from the element","success");
            }, time * 1000);
        }
    }
}


// task 8
function send_a_message_submit(){
    if (!importedJSON){
        showMessage("You need to import the JSON file first!","info");
    }else{
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

                    let k;

                    setTimeout(function(){
                        message.x = node1.position.x;
                        message.y = node1.position.y;
                        k = function() {
                            message.x += (node2.position.x - node1.position.x)/(time * 1000 / path.length) * app.ticker.elapsedMS;
                            message.y += (node2.position.y - node1.position.y)/(time * 1000 / path.length) * app.ticker.elapsedMS;
                        }
                        app.ticker.add(k);
                    }, i * (time * 1000 / path.length));
                    setTimeout(function(){ 
                        app.ticker.remove(k);
                        message.x = node2.position.x;
                        message.y = node2.position.y;
                    }, (i + 1) * (time * 1000 / path.length));

                }

                setTimeout(function(){
                    showMessage("Succesfully sent a message!!", "success");
                    app.stage.removeChild(message); 
                }, time * 1000);   
            }
        }
    }
}


// task 9
function send_a_message_highlight_submit(){
    if (!importedJSON){
        showMessage("You need to import the JSON file first!","info");
    }else{
        let paths = document.getElementById('sendMessageHighlightPath').value;
        let time = document.getElementById('sendMessageHighlightTime').value;

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

                let highlightLine = new PIXI.Graphics();
                highlightLine.lineStyle(2.5, "0xFFD700", 1);
                app.stage.addChild(highlightLine);

                let vertice0 = findVertice(path[0]);
                let node0 = findNode(vertice0.from);
                message.x = node0.position.x;
                message.y = node0.position.y;
                app.stage.addChild(message);    

                for (var i = 0; i < path.length; i++){
                    let vertice = findVertice(path[i]);
                    let node1 = findNode(vertice.from);
                    let node2 = findNode(vertice.to);

                    let k;

                    setTimeout(function(){
                        highlightLine.moveTo(node1.position.x, node1.position.y);
                        node1.graphics.filters = [new PIXI.filters.GlowFilter({ distance: 20, innerStrength: 0.5, outerStrength: 6, color: '0xFFD700', quality: 0.1})];
                        message.x = node1.position.x;
                        message.y = node1.position.y;
                        k = function() {
                            message.x += (node2.position.x - node1.position.x)/(time * 1000 / path.length) * app.ticker.elapsedMS;
                            message.y += (node2.position.y - node1.position.y)/(time * 1000 / path.length) * app.ticker.elapsedMS;
                            highlightLine.clear();
                            highlightLine.lineStyle(2.5, "0xFFD700", 1);
                            highlightLine.moveTo(node1.position.x, node1.position.y);
                            highlightLine.lineTo(message.x, message.y);
                        }
                        app.ticker.add(k);
                    }, i * (time * 1000 / path.length));
                    setTimeout(function(){ 
                        highlightLine.clear();
                        highlightLine.lineStyle(2.5, "0xFFD700", 1);
                        node1.graphics.filters = [];
                        app.ticker.remove(k);
                        message.x = node2.position.x;
                        message.y = node2.position.y;
                    }, (i + 1) * (time * 1000 / path.length));

                }

                let lastVertice = findVertice(path[path.length - 1]);
                let lastNode = findNode(lastVertice.to);
                setTimeout(function(){
                    lastNode.graphics.filters = [new PIXI.filters.GlowFilter({ distance: 20, innerStrength: 0.5, outerStrength: 6, color: '0xFFD700', quality: 0.1})];
                }, time * 1000);
                setTimeout(function(){
                    lastNode.graphics.filters = [];
                }, time * 1000 + 3000);

                setTimeout(function(){
                    showMessage("Succesfully sent a message!!", "success");
                    app.stage.removeChild(message); 
                }, time * 1000);   
            }
        }
    }
}


// ==== PIXI variables ======
let nodes = {};
let vertices = {};
// for task 8 and task 9 purposes
let message = new PIXI.Sprite.from("../images/message.png");
message.x = 0;
message.y = 0;
message.height = 36;
message.width = 24;
message.anchor.set(0.5);
//grid, background
let gridLine1 = new PIXI.Graphics();
let gridLine2 = new PIXI.Graphics();
// is left rotation
let isLeft;
// container
let container = new PIXI.Container();
// background variable
let showBackground = false;
let importedJSON = false;


// whenever window resizes, PIXI,js window will also scale to it
window.addEventListener("resize", event => {
    scaleToWindow(app.view);
});


// function that scales PIXI.js window to browser window
function scaleToWindow(appWin){
    appWin.style.position = "absolute";
    appWin.style.width = (window.innerWidth * 0.75 - 10) + "px";
    appWin.style.height = (window.innerHeight * 0.85 - 10) + "px";
    appWin.style.display = "block";
    return appWin;
}


// function that draws line in PIXI.js
function drawLine(graphics, x1, y1, x2, y2, color){
    graphics.lineStyle(2.5, color, 1);
    graphics.moveTo(x1, y1);
    graphics.lineTo(x2, y2);
    return graphics;
}


// drawing everything that goes background in PIXI,js
function drawBackgroundGrid(){
    gridLine1.lineStyle(0.7, "0x343535", 1);
    gridLine2.lineStyle(0.7, "0x343535", 1);
    gridLine1.rotation = Math.PI * 0.29;
    gridLine2.rotation = Math.PI * 0.21;
    for (let i = -2 * app.view.height; i <= 3 * app.view.height; i += 50) {
        gridLine2.moveTo(-2 * app.view.width, i);
        gridLine2.lineTo(3 * app.view.width, i);
    }
    for (let i = -2 * app.view.width; i <= 3 * app.view.width; i += 50) {
        gridLine1.moveTo(i, 3 * app.view.height);
        gridLine1.lineTo(i, -2 * app.view.height);
    }
    container.addChild(gridLine1);
    container.addChild(gridLine2);
    if (showBackground){
        app.stage.addChild(container);
    }

    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xFFFFFF);
    rectangle.drawRect(4/8 * app.view.width, 13/14 * app.view.height, 4/8 * app.view.width, 1/14 * app.view.height);
    rectangle.endFill();

    let rotationLeft = new PIXI.Sprite.from("../images/rotation-left.png");
    rotationLeft.x = 21/32 * app.view.width;
    rotationLeft.y = 27/28 * app.view.height;
    rotationLeft.height = 1/28 * app.view.height;
    rotationLeft.width = 1/28 * app.view.width;
    rotationLeft.anchor.set(0.5);
    rotationLeft.interactive = true;
    rotationLeft.buttonMode = true;
    rotationLeft.on('pointerdown', function(){
        isLeft = true;
        app.ticker.add(rotateMap);
    });
    rotationLeft.on('pointerup', function(){
        app.ticker.remove(rotateMap);
        updateNodes();
        for (var key in vertices){
            app.stage.removeChild(vertices[key].arrowhead);
            app.stage.removeChild(vertices[key].graphics);
            drawAllVertices(vertices[key], key);
        }

        for (var key in vertices){
            app.stage.addChild(vertices[key].graphics);
        }

        for (var key in vertices){
            app.stage.addChild(vertices[key].arrowhead);
        }
    });

    let rotationRight = new PIXI.Sprite.from("../images/rotation-right.png");
    rotationRight.x = 23/32 * app.view.width;
    rotationRight.y = 27/28 * app.view.height;
    rotationRight.height = 1/28 * app.view.height;
    rotationRight.width = 1/28 * app.view.width;
    rotationRight.anchor.set(0.5);
    rotationRight.interactive = true;
    rotationRight.buttonMode = true;
    rotationRight.on('pointerdown', function(){
        isLeft = false;
        app.ticker.add(rotateMap);
    });
    rotationRight.on('pointerup', function(){
        app.ticker.remove(rotateMap);
        updateNodes();
        for (var key in vertices){
            app.stage.removeChild(vertices[key].arrowhead);
            app.stage.removeChild(vertices[key].graphics);
            drawAllVertices(vertices[key], key);
        }

        for (var key in vertices){
            app.stage.addChild(vertices[key].graphics);
        }

        for (var key in vertices){
            app.stage.addChild(vertices[key].arrowhead);
        }
    });

    let plusSign = new PIXI.Sprite.from("../images/plus.png");
    plusSign.x = 17/32 * app.view.width;
    plusSign.y = 27/28 * app.view.height;
    plusSign.height = 1/28 * app.view.height;
    plusSign.width = 1/32 * app.view.width;
    plusSign.anchor.set(0.5);
    plusSign.tint = '0x000000';
    plusSign.interactive = true;
    plusSign.buttonMode = true;
    plusSign.on('pointerdown', function(){
        minusSign.tint = '0x000000';
        for (var key in nodes){
            nodes[key].graphics.scale.x *= 1.05;
            nodes[key].graphics.scale.y *= 1.05;
            if (nodes[key].graphics.width > 150){
                nodes[key].graphics.width = 150;
                plusSign.tint = '0xFFFFFF';
            } else {
                plusSign.tint = '0x000000';
            }
            if (nodes[key].graphics.height > 200){
                nodes[key].graphics.height = 200;
                plusSign.tint = '0xFFFFFF';
            } else {
                plusSign.tint = '0x000000';
            }
            updateNodes();
            for (var key in vertices){
                app.stage.removeChild(vertices[key].arrowhead);
                app.stage.removeChild(vertices[key].graphics);
                drawAllVertices(vertices[key], key);
            }

            for (var key in vertices){
                app.stage.addChild(vertices[key].graphics);
            }

            for (var key in vertices){
                app.stage.addChild(vertices[key].arrowhead);
            }
        }
    });

    let minusSign = new PIXI.Sprite.from("../images/minus.png");
    minusSign.x = 19/32 * app.view.width;
    minusSign.y = 27/28 * app.view.height;
    minusSign.height = 1/28 * app.view.height;
    minusSign.width = 1/32 * app.view.width;
    minusSign.anchor.set(0.5);
    minusSign.tint = '0x000000';
    minusSign.interactive = true;
    minusSign.buttonMode = true;
    minusSign.on('pointerdown', function(){
        plusSign.tint = '0x000000';
        for (var key in nodes){
            nodes[key].graphics.scale.x *= 0.95;
            nodes[key].graphics.scale.y *= 0.95;
            if (nodes[key].graphics.width < 45){
                nodes[key].graphics.width = 45;
                minusSign.tint = '0xFFFFFF';
            } else {
                minusSign.tint = '0x000000';
            }
            if (nodes[key].graphics.height < 60){
                nodes[key].graphics.height = 60;
                minusSign.tint = '0xFFFFFF';
            } else {
                minusSign.tint = '0x000000';
            }
            updateNodes();
            for (var key in vertices){
                app.stage.removeChild(vertices[key].arrowhead);
                app.stage.removeChild(vertices[key].graphics);
                drawAllVertices(vertices[key], key);
            }

            for (var key in vertices){
                app.stage.addChild(vertices[key].graphics);
            }

            for (var key in vertices){
                app.stage.addChild(vertices[key].arrowhead);
            }
        }
    });

    // lines that form black frame
    let lines = new PIXI.Graphics();
    lines.lineStyle(2, "0x000000", 1);
    lines.moveTo(4/8 * app.view.width, app.view.height);
    lines.lineTo(4/8 * app.view.width, 13/14 * app.view.height);
    lines.lineTo(app.view.width, 13/14 * app.view.height);
    lines.moveTo(5/8 * app.view.width, app.view.height);
    lines.lineTo(5/8 * app.view.width, 13/14 * app.view.height);
    lines.moveTo(6/8 * app.view.width, app.view.height);
    lines.lineTo(6/8 * app.view.width, 13/14 * app.view.height);

    app.stage.addChild(rectangle);
    app.stage.addChild(textId);
    app.stage.addChild(rotationLeft);
    app.stage.addChild(rotationRight);
    app.stage.addChild(plusSign);
    app.stage.addChild(minusSign);
    app.stage.addChild(lines);
}


// function that rotates map based on the direction
function rotateMap(){
    if (isLeft){
        coef = 1;
    } else {
        coef = -1;
    }
    step = 0.003 * coef;
    for (var key in nodes){
        block = nodes[key].graphics;
        x1 = Math.cos(step) * (block.x-app.view.width / 2) - Math.sin(step) * (block.y-app.view.height / 2) + app.view.width/2;
        y1 = Math.sin(step) * (block.x-app.view.width / 2) + Math.cos(step) * (block.y-app.view.height / 2) + app.view.height/2;
        block.x = x1;
        block.y = y1;
        nodes[key].graphics = block;
        nodes[key].position.x = x1;
        nodes[key].position.y = y1;

        if (nodes[key].textShowed){
            nodes[key].nodeText.x = x1;
            nodes[key].nodeText.y = y1 - nodes[key].graphics.height * 0.9;
        }
    }

    for (var key in vertices){
        app.stage.removeChild(vertices[key].arrowhead);
        app.stage.removeChild(vertices[key].graphics);
        drawAllVertices(vertices[key], key);
    }

    for (var key in vertices){
        app.stage.addChild(vertices[key].graphics);
    }

    for (var key in vertices){
        app.stage.addChild(vertices[key].arrowhead);
    }

    container.rotation += coef * 0.003;
}


// removing everything from the PIXI.js window (but calling draw background function after)
function cleanStage(){
    for (var i = app.stage.children.length - 1; i >= 0; i--) {	
        app.stage.removeChild(app.stage.children[i]);
    }
    nodes = {};
    vertices = {};
    drawBackgroundGrid();
}


// ======================= PIXI main ==============================

const app = new PIXI.Application({ antialias: true, transparent: true });
const displayDiv = document.getElementById('main');

app.view.style.position = "absolute";
app.view.style.width = (window.innerWidth * 0.75 - 10) + "px";
app.view.style.height = (window.innerHeight * 0.85 - 10) + "px";
app.view.style.display = "block";

displayDiv.appendChild(app.view);

let textId = new PIXI.Text("ID : -", {fontFamily : 'Arial', fontSize: 16, fill: "black"});
textId.x = 14/16 * app.view.width;
textId.y = 27/28 * app.view.height;
textId.anchor.set(0.5);

drawBackgroundGrid();

container.x = app.view.width / 2;
container.y = app.view.height / 2;