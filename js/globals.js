function submitPOST(command, dataObj){
    $.post("/", {command: command, data: dataObj});
}
function a(id){
    return $("#"+id)[0];
}