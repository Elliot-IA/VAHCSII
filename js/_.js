$("#emailMeBtn")[0].addEventListener("click", ()=>{
    submitPOST("emailMe", {});
});
$("#runPureBtn")[0].addEventListener("click", ()=>{
    submitPOST("runCode", $("#codeBox")[0].value);
});
