console.log("~Nutradaily.js initiated");
document.getElementById("imagesPlusBtn").onclick = () => {
    document.getElementById("imagesPlusBtn").style.borderWidth = "6px 4px 1px 4px";   
    setTimeout(()=>{    
        document.getElementById("imagesPlusBtn").style.borderWidth = "1px 4px 6px 4px";
    },200);
    fetch_diaryData(()=>{
        
    });
}

var diaryData = null;
function fetch_diaryData(callback){
    console.log("Fetching Diary Data...");
    fetch('/getDairyData')
        .then(response => response.json())
        .then(data => {
            diaryData = data;
            callback();
    });
}