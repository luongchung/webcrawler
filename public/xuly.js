
class Flag {
    constructor(name ,type, data, def) {
      this.name = name;  
      this.type = type;
      this.data = data;
      this.def = def;
    }
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function loadTable(){
    //body reference 
    var body = document.getElementById("table");
    
    // create elements <table> and a <tbody>
    var tbl = document.createElement("table");
    tbl.setAttribute("class","table");

    var thead = document.createElement("thead");
    //set tên cột
    var name = ["Ex","flags","value"];
    var tr = document.createElement("tr");
    for (var j = 0; j < 3; j++) {
        var th = document.createElement("th");
        th.setAttribute("scope","col");
        th.append(name[j]);
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    tbl.appendChild(thead);


    //1 ->  string
    //2 ->  list string
    //3 ->  int 
    //4 ->  list int
    //5 ->  bool
    var arrFlags = new Flag("",0,"","");
    arrFlags[0] = new Flag("email", 1, "xin chào","Hello");
    arrFlags[1] = new Flag("enable", 5, [true,false],false);
    arrFlags[2] = new Flag("enable1", 2, ["alo","blo"],"alo");
    arrFlags[3] = new Flag("enable4", 3, 3344333,1);

    var tblBody = document.createElement("tbody");
    // cells creation
    for (var j = 0; j <= 3; j++) {
        // table row creation
        var row = document.createElement("tr");
        for (var i = 0; i <= 2; i++) {
            var cell = document.createElement("td");
            if(i == 1){
                var cellText = document.createTextNode(arrFlags[j].name);
                cell.appendChild(cellText);
            }
            if(i == 2){
                if(arrFlags[j].type == 1){
                    var input = document.createElement("input");
                    input.type = arrFlags[j].def;
                    input.className = "css-class-name"; // set the CSS class
                    cell.appendChild(input); // put it into the DOM
                }

                if(arrFlags[j].type == 3){
                    var input = document.createElement("input");
                    input.type = arrFlags[j].def;
                    input.setAttribute("onkeypress","return isNumber(event)");
                    cell.appendChild(input); // put it into the DOM
                }

                if(arrFlags[j].type == 2){
                    var select = document.createElement("select");
                    for (const val of arrFlags[j].data)
                    {
                        var option = document.createElement("option");
                        option.value = val;
                        option.text = val.charAt(0).toUpperCase() + val.slice(1);
                        select.appendChild(option);
                    }
                    select.value = arrFlags[j].def;
                    cell.appendChild(select);
                }
                

                if(arrFlags[j].type == 5){
                    var select = document.createElement("select");
                    for (const val of arrFlags[j].data)
                    {
                        var option = document.createElement("option");
                        option.value = val;
                        if(val) option.text = "TRUE".toUpperCase();
                        else option.text = "FALSE".toUpperCase();
                        select.appendChild(option);
                    }
                    select.value = arrFlags[j].def;
                    cell.appendChild(select);
                }
            }
            
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }
    tbl.appendChild(tblBody);
    body.appendChild(tbl);
}
function checkJson(){
    var xhr = new XMLHttpRequest();
    var url = "http://localhost:2000/config?data=" + encodeURIComponent(JSON.stringify(
      {
          "email": false, 
          "password": "101010",
          "hello": 1
      }
      ));
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          document.getElementById("json-renderer").textContent = JSON.stringify(data, null, 2);
      }
    };
    xhr.send();
}


$(document).ready(function(){
    loadTable();
    $("#check").click(function(){
        checkJson();
    });
});