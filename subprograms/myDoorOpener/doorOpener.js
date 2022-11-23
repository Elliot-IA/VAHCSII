var doorLocked = null;

function fetchDoorStatus(){
    fetch('/doorState').then((response) => {
        response.json().then((data)=>{
            console.log("fetch Returned! Data: "+JSON.stringify(data));
            setGUI(data.doorStatus);
        });
    });
}

function toggleDoorState(){
    var newState = JSON.stringify(!doorLocked);
    fetch('/changeDoorState?newState='+newState)
        .then(response => response.json())
        .then(data => {
        setGUI(data.doorStatus);
    });
}

function setGUI(state){
    state = eval(state);
    console.log("setting GUI with state: "+state);
    if(state == "true" || state == true){
        $("#statusLine")[0].innerHTML = "Door is Locked";
        $("#toggleBtn")[0].innerHTML = "Unlock Door";
        doorLocked = true;
    }else if(state == "false" || state == true){
        $("#statusLine")[0].innerHTML = "Door is Unlocked";
        $("#toggleBtn")[0].innerHTML = "Lock Door";
        doorLocked = false;
    }else{
        $("#statusLine")[0].innerHTML = "You do not have permission to change door state!";
        $("#toggleBtn")[0].innerHTML = "!!";
    }
}

window.onload=()=>{
    
    if(getCookie("userToken") != ''){
        //This means the user DOES have a cookie token
    }else{
        //This means the user DOES NOT have a cookie token
        setCookie("userToken", generateUserToken(12), 100000);
    }
    $("#toggleBtn")[0].onclick = ()=>{
        toggleDoorState();
    }

    fetchDoorStatus();
}

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateUserToken(length){
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
