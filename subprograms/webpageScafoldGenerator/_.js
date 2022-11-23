
function convertToScaffold(){
    var str = document.getElementById("HTML_in").value;
    console.log(str);

    const selectors = [];

    for (let index = 0; index < str.length-3; index++) {
        if (str.substring(index, index-3) == 'id='){
            var id = str.substring(index+1, index+4+str.substring(index+4).indexOf("\""));
            if(id!="") selectors.push("#"+id);
        }
    }
    for (let index = 0; index < str.length-6; index++) {
        if (str.substring(index, index-6) == 'class='){
            var newClass = str.substring(index+4, index+4+str.substring(index).indexOf("\""));
            if(newClass!="") selectors.push("."+newClass);
        }
    }
    
    
    var css = "";
    selectors.forEach((sel)=>{
        css+= sel+"{\n\t\n}";
    });
    
    document.getElementById("CSS_out").value = css;
}

function makeIdsForImages(){
    var str = document.getElementById("HTML_in2").value;
    
}