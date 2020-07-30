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

function highlight_element_submit(){
    showMessage("Funkcija 2 pozvana","success");
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