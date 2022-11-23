var device = "webpage";
function submitPOST(command, dataObj){
    $.post("/", {command: command, data: dataObj});
}
function addEl(type, id, className, appendSelector){
    var el= document.createElement(type);
    el.id = id;
    el.className = className;
    $(appendSelector)[0].appendChild(el);
}
function a(id){
    return $("#"+id)[0];
}

window.onload = ()=>{
    var date = JSON.stringify(new Date())
    var dateNum = date.substring(date.indexOf("-")+1,date.lastIndexOf("-"))+"."+date.substring(date.lastIndexOf("-")+1,date.indexOf("T")) +"."+date.substring(3,date.indexOf("-"));
    document.getElementById("todaysDate").innerHTML = dateNum;
}