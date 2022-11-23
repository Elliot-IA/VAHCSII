function convertStr(){
    var str = document.getElementById("inputBox").value;
    var finalStr = "char ___["+document.getElementById("inputBox").value.length+"] = {";
    finalStr += "\'"+str[0]+"\'";
    for(var i = 1; i<str.length; i++){
        finalStr += ","+"\'"+str[i]+"\'";
    }
    finalStr += "};\n//"+str+"\n";
    document.getElementById("outputBox").value = finalStr;
    document.getElementById("outputBox").select()
}

document.addEventListener("keyup", (e)=>{
    if(e.key == "Enter"){
        convertStr();
    }
});



window.onload = (e)=>{
    document.getElementById("inputBox").focus();
    document.getElementById("inputBox").addEventListener("click", (e)=>{
        setTimeout(()=>{
            document.getElementById("inputBox").select();
        },10);
    });

    document.getElementById("inputBox2").addEventListener("click", (e)=>{
        setTimeout(()=>{
            document.getElementById("inputBox2").select();
        },10);
    });
};

function deconvertStr(){
    var str = document.getElementById("inputBox2").value.substring(document.getElementById("inputBox2").value.indexOf("{"),document.getElementById("inputBox2").value.length);
    var finalStr = "";
    for(var i = 2; i<str.length; i+=4){
        finalStr += str[i];
    }
    document.getElementById("outputBox2").value = finalStr;
    document.getElementById("outputBox2").select();
}