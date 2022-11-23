const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
var nodemailer = require('nodemailer');
const url = require('url');
var fs = require("fs");
var archiver = require("archiver");
const request = require("request");
const requestIp = require('request-ip');
const dateAndTime = require("date-and-time");
const { MongoClient, ServerApiVersion } = require('mongodb');

const puppeteer = require('puppeteer')//-extra')
//const StealthPlugin = require('puppeteer-extra-plugin-stealth')
//puppeteer.use(StealthPlugin());
//const { executablePath } = require('puppeteer') //require executablePath from puppeteer

app.use(express.static(path.join(__dirname, ".")));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

console.log("Server Initiated! Working Directory (for server js file):"+path.join(__dirname, "."));

const PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
    console.log("Server started on port "+ PORT);
    if(PORT == 8080){
        settingsToUse = localSettings;
        console.log("Launching Puppeteer with localSettings");
    }else{
        console.log("Launching Puppeteer with deploymentSettings");
    }
});

//#######     --Connect To Databases--     #######                 #######                 #######                 #######                 #######
const data_uri = "mongodb+srv://Napoleon78:socialEntreprenuer78@cluster0.5nal4sm.mongodb.net/?retryWrites=true&w=majority";
var vahcs_db = "";
const vahcsdb_client = new MongoClient(data_uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log("Connecting to Databases...");
vahcsdb_client.connect((res,err)=>{
    console.log("~vahcsdb Connection Established~");
    console.log("res: "+res+" err: "+err);
    vahcs_db = vahcsdb_client.db("transferData");
    globalLassesDiaryData = vahcsdb_client.db("Nutridairy").collection("LassesDiary").find().toArray();
});

app.get("/", function(req, res){
    res.sendFile(__dirname+"/vahcs.html");
});
app.post("/", function(req, res){
    if(req.body.command == "emailMe"){
        console.log("Running emailMe request");
        sendMyselfAnEmail();
        res.status(204).send();
    }else if(req.body.command == "runCode"){
        console.log("Running runCode request");
        var codeAsString = req.body.data;
        console.log("Given code:\n"+codeAsString);
        runPureCode(codeAsString);
        res.status(204).send();
    }else{
        console.log("(!)A post request was made but the command was not recognized");
        res.status(204).send();
    }
});

////////////////Personal Automations////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/timesheet", function(req, res){       //Fill out your timesheet
    sendEmailToElliot("Attempting to fill out your timesheets", "I'm logging 12 hours of work on this week's Andesrson Labs timesheet and logging 11 to 3 shifts on Monday Thursday and Friday, and I will notify if I was or was not sucsessful...");
    fillOutExceedLabTimesheet();
    res.send("Filling out your timesheets...");
});
app.get("/ip", function(req, res){       //Get IP Address Test
    //const ipAddress = IP.address();
    //res.send(req.ip);
    const clientIp = requestIp.getClientIp(req);
    res.send(clientIp);
});
app.get("/phantomSequenceGenerator", function(req, res){       //Get IP Address Test
    res.sendFile(__dirname+"/subprograms/stringToCharArrConverter/converter.html");
});
app.get("/webpageScafoldGenerator", function(req, res){       //Get IP Address Test
    res.sendFile(__dirname+"/subprograms/webpageScafoldGenerator/main.html");
});
app.get("/notescape", function(req, res){
    res.sendFile(__dirname+"/subprograms/Notescape/notescape.html");        
});
app.get("/astraverse", function(req, res){
    res.sendFile(__dirname+"/subprograms/Astraverse/astraverse.html");        
});
app.get("/getLowDefImg", function(req, res){

});
app.get("/getHighDefImg", function(req, res){

});

////////////////Personal Automations////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////Toni's Door Control////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/myDoorPanel", function(req, res){
    console.log("Sending someone door page...");
    res.sendFile(__dirname+"/subprograms/myDoorOpener/myDoorPage.html");        
});
var doorLocked = true;
var myApprovedDoorTokens = [];
app.get("/changeDoorState", function(req, res){
    console.log("Door State change requested!");
    const clientIp = requestIp.getClientIp(req);
    var queryObject = url.parse(req.url,true).query;
    console.log("Request to toggle door state to: "+queryObject.newState+" from IP: "+clientIp);    
    var combinedIPs = "";
    nullIPs.forEach((ip)=>{combinedIPs+=ip});
    /*if(combinedIPs.indexOf(clientIp) == -1){
            console.log("toggle request for my door rejected, not from an approved IP!");
            res.send({doorStatus: "InvalidIP"});
        }else{*/
    console.log("toggle request for my door accepted!");
    if(doorLocked != queryObject.newState){
        doorLocked = queryObject.newState;
        console.log("Door state changed to: "+doorLocked);
    }else{
        console.log("No change in door state");
    }
    res.send({doorStatus: JSON.stringify(doorLocked)});
    //}
});
app.get("/doorState", function(req, res){
    console.log("Door State requested!");
    res.send({doorStatus: JSON.stringify(doorLocked)});
});
app.get("/Notify_myDoorLocked", function(req, res){
    sendIPhoneNotification("Sir, your door was locked!","~~~~~~~~~");
    res.send("Success!");
});
app.get("/Notify_myDoorUnlocked", function(req, res){
    sendIPhoneNotification("Sir, your door was unlocked!","~~~~~~~~~");
    res.send("Success!");
});
////////////////Toni's Door Control////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////Lasse's Nutridiary////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/nutridiary", function(req, res){
    console.log("Sending Lasse Nutridairy Program!...");
    res.sendFile(__dirname+"/subprograms/Nutridiary/Nutridiary.html");
    
});
function executeLassesBarcodeToNutritionFacts(){
    // puppeteer usage as normal
    puppeteer.launch(settingsToUse).then(async browser => {
        const page = await browser.newPage();
        universalPage = page;
        console.log("Beginning to convert a new barcode into nutrition fact data...");
        //const page = await browser.newPage();
        await page.goto('https://products.aspose.app/barcode/recognize#'); 
    });
}
var globalLassesDiaryData = null;
app.get("/getDairyData", function(req, res){
    res.send(globalLassesDiaryData);
});
function startNewDairyDay(){
    vahcsdb_client.db("Nutridairy").collection("LassesDiary").insertOne(
        {"date":dateAndTime.format(new Date(), "MM.DD.YY"),"nutrientData":{"calories":{"$numberInt":"0"},"totalFat":{"$numberInt":"0"},"saturatedFat":{"$numberInt":"0"},"cholesterol":{"$numberInt":"0"},"sodium":{"$numberInt":"0"},"totalCarbohydrates":{"$numberInt":"0"},"calcium":{"$numberInt":"0"},"dietaryFiber":{"$numberInt":"0"},"iron":{"$numberInt":"0"},"potassium":{"$numberInt":"0"},"protein":{"$numberInt":"0"},"totalSugars":{"$numberInt":"0"},"vitaminA":{"$numberInt":"0"},"vitaminD":{"$numberInt":"0"}}}
);
}
////////////////Lasse's Nutridiary////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////JRARASS Automations\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\//
var link_freeStuffCatalog = "https://jrarass-freejunk.herokuapp.com/";
var link_UMNPartsCatalog = "https://umn-parts.herokuapp.com/";
var link_UMNToolsCatalog = "https://umn-tools.herokuapp.com/";
var link_GreenMachineCatalog = "https://gm-spareparts.herokuapp.com/";
var link_listedObjectRequestForm = "https://docs.google.com/forms/d/1wGunRb2aDsmf7-3JC2_gGckRBvVfybr_9QymGXV5cQg";
var link_unlistedObjectRequestForm = "https://docs.google.com/forms/d/1uCWqe8CX8qVokkpbYlDRHWWB8CacWgyAqhe2s-uQWX8";
var link_makerRegistrationForm = "https://docs.google.com/forms/d/1Emkx1Cvn0zD6RSZW_-Ch_iM00qLt9uM3ktAh90rpfKo";
var link_myBestWork = "https://www.astradux.org";

app.get("/0", function(req, res){       //Anderson Labs Free Stuff Catalog
    res.redirect(link_freeStuffCatalog);
    sendEmailToElliot("QR Code 0 was just scanned!", "Sir, someone went to the 'Free Maker Material Catalog' (really the free stuff catalog) from Anderson Labs!");
});
app.get("/1", function(req, res){       //Toaster Free Stuff Catalog
    res.redirect("https://jrarass-freejunk.herokuapp.com/?search=[%22Junk%20Vault%20Europa%22,%22location%22]");
    sendEmailToElliot("QR Code 1 was just scanned!", "Sir, someone went to the free stuff catalog from The Toaster!");
});
app.get("/2", function(req, res){       //Anderson Labs Listed Object Request Form
    res.redirect(link_listedObjectRequestForm);
    sendEmailToElliot("QR Code 2 was just scanned!", "Sir, someone went to the Listed Object Request Form from Anderson Labs!");
});
app.get("/3", function(req, res){       //Toaster Listed Object Request Form
    res.redirect(link_listedObjectRequestForm);
    sendEmailToElliot("QR Code 3 was just scanned!", "Sir, someone went to the Listed Object Request Form from The Toaster!");
});
app.get("/4", function(req, res){       //Exceed Lab Free Maker Material Catalog
    res.redirect(link_freeStuffCatalog);
    sendEmailToElliot("QR Code 4 was just scanned!", "Sir, someone went to the 'Free Maker Material Catalog' (really the free stuff catalog) from The Exceed Lab! Timestamp");
});
app.get("/5", function(req, res){       //Exceed Listed Object Request Form
    res.redirect(link_listedObjectRequestForm);
    sendEmailToElliot("QR Code 5 was just scanned!", "Sir, someone went to the Listed Object Request Form from The Exceed Lab!");
});
app.get("/6", function(req, res){       //Keller Free Stuff Table Free Maker Material Catalog
    res.redirect(link_freeStuffCatalog);
    sendEmailToElliot("QR Code 6 was just scanned!", "Sir, someone went to the Free Maker Material Catalog from The Keller Free Stuff Table!");
});
app.get("/7", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_freeStuffCatalog);
    sendEmailToElliot("QR Code 7 was just scanned!", "Sir, someone went to the Unlisted Object Request Form from The Keller Free Stuff Table! Go here: https://docs.google.com/forms/d/1uCWqe8CX8qVokkpbYlDRHWWB8CacWgyAqhe2s-uQWX8/edit");
});
app.get("/8", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_unlistedObjectRequestForm);
    sendEmailToElliot("QR Code 8 was just scanned!", "Sir, someone went to the Unlisted Object Request Form from Anderson Labs!");
});
app.get("/9", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_freeStuffCatalog);
    sendEmailToElliot("Someone went to the free junk catalog with a link you sent!", "Sir, someone went to the free junk catalog from the free float link!");
});
app.get("/10", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_myBestWork);
    sendEmailToElliot("QR Code 9 was just scanned!", "Sir, someone requested to see your best work (the astradux) from your maker plaque!");
});
app.get("/11", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_makerRegistrationForm);
    sendEmailToElliot("Someone went to the maker registration form!", "Sir, someone went to the maker registration form from the Toaster Maker Allience Display!");
});
app.get("/12", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_freeStuffCatalog);
    sendEmailToElliot("QR Code 12 was just scanned!", "Sir, someone went to the Free Maker Material Catalog from a sticker on a catalog box in the Exceed Lab Closet!");
});
app.get("/13", function(req, res){       //Parts Catalog Anderson Labs
    res.redirect(link_UMNPartsCatalog);
    sendEmailToElliot("QR Code 13 was just scanned!", "Sir, someone went to the Parts Catalog from a poster in Anderson Labs!");
});
app.get("/14", function(req, res){       //Tools Catalog Anderson Labs
    res.redirect(link_UMNToolsCatalog);
    sendEmailToElliot("QR Code 14 was just scanned!", "Sir, someone went to the Tools Catalog from a poster in Anderson Labs!");
});
app.get("/15", function(req, res){       //Green Machine Spare Parts Catalog
    res.redirect(link_GreenMachineCatalog+"?code=1");
    sendEmailToElliot("QR Code 15 was just scanned!", "Sir, someone went to the Green Machine Spare Parts Catalog from a poster QR Code!");
});
app.get("/16", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_UMNPartsCatalog);
    sendEmailToElliot("QR Code 16 was just scanned!", "Sir, someone went to the Parts Catalog from a poster in The Toaster!");
});
app.get("/17", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_UMNToolsCatalog);
    sendEmailToElliot("QR Code 17 was just scanned!", "Sir, someone went to the Tools Catalog from a poster in The Toaster!");
});
app.get("/18", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_UMNPartsCatalog);
    sendEmailToElliot("QR Code 18 was just scanned!", "Sir, someone went to the Parts Catalog from a poster in The Toaster!");
});
app.get("/19", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_UMNToolsCatalog);
    sendEmailToElliot("QR Code 19 was just scanned!", "Sir, someone went to the Tools Catalog from a poster in The Toaster!");
});
app.get("/20", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_UMNPartsCatalog);
    sendEmailToElliot("QR Code 20 was just scanned!", "Sir, someone went to the Parts Catalog from a poster in The Toaster!");
});
app.get("/21", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_UMNToolsCatalog);
    sendEmailToElliot("QR Code 21 was just scanned!", "Sir, someone went to the Tools Catalog from a poster in The Toaster!");
});
app.get("/22", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_UMNPartsCatalog);
    sendEmailToElliot("QR Code 22 was just scanned!", "Sir, someone went to the Parts Catalog from a poster in The Toaster!");
});
app.get("/23", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect(link_UMNToolsCatalog);
    sendEmailToElliot("QR Code 23 was just scanned!", "Sir, someone went to the Tools Catalog from a poster in The Toaster!");
});
app.get("/24", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect("https://jrarass-freejunk.herokuapp.com/?search=[%22Junk%20Vault%20Juniper%22,%22location%22]");
    sendEmailToElliot("QR Code 24 was just scanned!", "Sir, scanned to see within junk vault juniper from its signage!");
});
app.get("/25", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect("https://jrarass-freejunk.herokuapp.com/?search=[%22Junk%20Vault%20Avalon%22,%22location%22]");
    sendEmailToElliot("QR Code 25 was just scanned!", "Sir, scanned to see within junk vault avalon from its signage!");
});
app.get("/26", function(req, res){       //Green Machine Spare Parts Catalog
    res.redirect(link_GreenMachineCatalog+"?code=2");
    sendEmailToElliot("QR Code 26 was just scanned!", "Sir, someone went to the Green Machine Spare Parts Catalog from a poster QR Code!");
});
app.get("/27", function(req, res){       //Green Machine Spare Parts Catalog
    res.redirect(link_GreenMachineCatalog+"?code=3");
    sendEmailToElliot("QR Code 27 was just scanned!", "Sir, someone went to the Green Machine Spare Parts Catalog from a poster QR Code!");
});
app.get("/28", function(req, res){       //Green Machine Spare Parts Catalog
    res.redirect(link_GreenMachineCatalog+"?code=4");
    sendEmailToElliot("QR Code 28 was just scanned!", "Sir, someone went to the Green Machine Spare Parts Catalog from a poster QR Code!");
});
app.get("/29", function(req, res){       //Green Machine Spare Parts Catalog
    res.redirect(link_GreenMachineCatalog+"?code=5");
    sendEmailToElliot("QR Code 29 was just scanned!", "Sir, someone went to the Green Machine Spare Parts Catalog from a poster QR Code!");
});
app.get("/30", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect("https://jrarass-freejunk.herokuapp.com/?search=[%22Europa%20Cabinet%202%22,%22location%22]");
    sendEmailToElliot("QR Code 30 was just scanned!", "Sir, someone scanned to see inside Europa Cabinet 2 from its signage!");
});
app.get("/31", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect("https://jrarass-freejunk.herokuapp.com/?search=[%22Junk%20Vault%20Hermes%22,%22location%22]");
    sendEmailToElliot("QR Code 31 was just scanned!", "Sir, scanned to see within Junk Vault Hermes from its signage!");
});
app.get("/32", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect("https://jrarass-freejunk.herokuapp.com");
    sendEmailToElliot("Someone used free junk Z-Link!", "Sir, someone went to free junk site from the z-link! That means someone voluntarily looked it up!");
});
app.get("/33", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect("https://jrarass-freejunk.herokuapp.com");
    sendEmailToElliot("Someone used free junk Instagram Z-Link!", "Sir, someone went to free junk site from the instagram z-link! That means someone voluntarily looked it up!");
});
app.get("/34", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect("https://jrarass-freejunk.herokuapp.com/?search=[%22Europa%20Cabinet%201%22,%22location%22]");
    sendEmailToElliot("QR Code 34 was just scanned!", "Sir, someone looked inside Europa Cabinet 1 from its signage!");
});
app.get("/35", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect("https://jrarass-freejunk.herokuapp.com/?search=[%22Europa%20Bin%201%22,%22location%22]");
    sendEmailToElliot("QR Code 35 was just scanned!", "Sir, someone looked inside Europa Bin 1 from its signage!");
});
app.get("/36", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect("https://jrarass-freejunk.herokuapp.com/?search=[%22Europa%20Bin%202%22,%22location%22]");
    sendEmailToElliot("QR Code 36 was just scanned!", "Sir, someone looked inside Europa Bin 2 from its signage!");
});
app.get("/37", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect("https://jrarass-freejunk.herokuapp.com/?search=[%22Europa%20Bin%203%22,%22location%22]");
    sendEmailToElliot("QR Code 37 was just scanned!", "Sir, someone looked inside Europa Bin 3 from its signage!");
});
app.get("/38", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect("https://jrarass-freejunk.herokuapp.com/?search=[%22Europa%20Bin%204%22,%22location%22]");
    sendEmailToElliot("QR Code 38 was just scanned!", "Sir, someone looked inside Europa Bin 4 from its signage!");
});
app.get("/39", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect("https://jrarass-freejunk.herokuapp.com/?search=[%22Europa%20Bin%205%22,%22location%22]");
    sendEmailToElliot("QR Code 39 was just scanned!", "Sir, someone looked inside Europa Bin 5 from its signage!");
});
app.get("/40", function(req, res){       //Keller Free Stuff Table Unlisted Object Request
    res.redirect("https://jrarass-freejunk.herokuapp.com/?search=[%22Europa%20Bin%206%22,%22location%22]");
    sendEmailToElliot("QR Code 40 was just scanned!", "Sir, someone looked inside Europa Bin 6 from its signage!");
});

var nullTokens = [
    ["Ian's Acer Chromebook","??"],
    ["Ian's IPhone8",'??'],
    ["Ian's Surface","q9pPIhunWtM0"],
    ["Ian's IPhone13","R10EuEoI2Ldb"],
    ["Ian's Levento Chromebook","uBhz6Cu8WiZE"],
    ["Ian's Levento Chromebook localhost","3i4xy7WcwGiT"],
    ["Ian's Levento Chromebook 2","3cEpDcKIolvw"]
];
app.get("/sniffTrigger", function(req, res){
    var queryObject = url.parse(req.url,true).query;
    console.log(">>>Sniff Recieved!: query object: "+JSON.stringify(queryObject)+" <<->> source field: "+queryObject.source+" ->> ip field: "+queryObject.ip);
    res.json({response:"Success!"});
    var combinedTokens = "";
    nullTokens.forEach((nullToken)=>{combinedTokens+=nullToken});
    if(combinedTokens.indexOf(queryObject.ip) == -1){
        sendEmailToElliot("Sniff from "+queryObject.source+"!", "Sir, I detected someone loading "+queryObject.source+" with this token: "+queryObject.ip+"\nThis token was not listed as null. Null tokens are: "+JSON.stringify(nullTokens));
        console.log("Command send from non-null ip, email sent!");
    }else{
        console.log("Command send from null token, email not sent");
    }
});
app.get("/JunkTerminalBellTrigger", function(req, res){
    var queryObject = url.parse(req.url,true).query;
    console.log("Ring detected on Bell: "+queryObject.bellNum);
    res.json({response:"Success!"});
});
var bell1_emailOptions = {
    from: 'vahcs.computer@gmail.com',
    to: 'alexa818@umn.edu',
    html: 'Sir, someone has submitted a post-it junk request from Bell 1 and is awaiting response!...<img height="500px" src="cid:unique3@kreata.ee"/>',
    attachments: [{
        filename: 'bell1.png',
        path: './transferData/bell1.png',
        cid: 'unique3@kreata.ee' //same cid value as in the html img src
    }]
}
app.get("/JRARASS_claimAlert", function(req, res){
    var queryObject = url.parse(req.url,true).query;
    console.log("Claim on part: "+queryObject.partData);
    res.json({response:"Success!"});
    sendEmailToElliot("JRARASS Item Claim", "Someone claimed this item: "+queryObject.partData);
});
app.get("/JRARASS_claimAlert_claimFulfilled", function(req, res){
    var queryObject = url.parse(req.url,true).query;
    console.log("Claim Fullfilled on part: "+queryObject.partData);
    res.json({response:"Success!"});
    sendEmailToElliot("JRARASS Item Fullfillment", "Someone reported taking this item: "+queryObject.partData);

    vahcsdb_client.db("Claimed_JRARASS_Objects").collection("CJO_PartIndexes").insertOne({"part_index":queryObject.partData,"claim_timestamp":buildTimestamp()});
});
app.get("/JRARASS_claimAlert_claimAborted", function(req, res){
    var queryObject = url.parse(req.url,true).query;
    console.log("Claim Aborted on part: "+queryObject.partData);
    res.json({response:"Success!"});
    sendEmailToElliot("JRARASS Item Claim Aborted", "Someone claimed but then declined taking this item: "+queryObject.partData);
});
////////////////Hyperlogger Automations
//New object image request handler
//New location image request handler
//function to download images, resolve location, assign tags, and then store all information in a new JRARASS 2.0 collection
//function to use puppeteer to return image tags with google object recognition!
//\\\\\\\\\\\\\Hyperlogger Automations
////////////////Location QR Automations
//
//\\\\\\\\\\\\\Location QR Automations
//\\\\\\\\\\\\\JRARASS Automations////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


////////////////MARIbot Automations\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
resinTrayPreviouslyInPlace = true;
var distanceStrikes = [0,0,0,0];
resinTrayXPreviouslyInPlace = [true, true, true, true];
app.get("/MARIbot_vinylInOutOfStock", function(req, res){
    var queryObject = url.parse(req.url,true).query;
    console.log("-------------Executing MARIbot Resin Plate check...");
    console.log(">>>Vinyl Checked!: query object: "+JSON.stringify(queryObject)+" <<->> distance 1: "+queryObject.d1 +" -- distance 2: "+queryObject.d2+" -- distance 3: "+queryObject.d3+" -- distance 4: "+queryObject.d4);
    var curSensor = 0;
    var distancesArr = [eval(queryObject.d3),eval(queryObject.d4),eval(queryObject.d1),eval(queryObject.d2)];
    var thresholdValues = [7,7,9,15];
    console.log("Important Values for Resin Trays:: distancesArr:"+JSON.stringify(distancesArr)+" thresholdValues: "+JSON.stringify(thresholdValues)+" distanceStrikes: "+JSON.stringify(distanceStrikes));
    console.log("------------------------------------------------------------------------------------------------");
    console.log("----------------------------------------------------------");
    while(curSensor<=3){
        if(distancesArr[curSensor] != null && distancesArr[curSensor] != undefined){
            if(distancesArr[curSensor] > thresholdValues[curSensor] && resinTrayXPreviouslyInPlace[curSensor]){
                if(distanceStrikes[curSensor] == 3){
                    MARIbot_sendEmail("(~) Resin Tray "+(curSensor+1)+" Halfway Alert (~)", "Hey! I sensed someone took resin printer tray "+(curSensor+1)+" with 3 strikes! Letting you know now Elliot, I'll send an email to Carolyn after 6 stikes",2);
                }
                if(distanceStrikes[curSensor] == 6){
                    console.log("Resin Tray "+(curSensor+1)+" not in place with 6 checks, sending an email!...");
                    MARIbot_sendEmail("(~) Resin Tray "+(curSensor+1)+" Alert (~)", "Hey! I sensed someone took resin printer tray "+(curSensor+1)+"!",1);
                    console.log("Reseting Tray " + (curSensor+1) +"'s distanceStrikes index back to zero" );
                    distanceStrikes[curSensor] = 0;
                    resinTrayXPreviouslyInPlace[curSensor] = false;
                }else{
                    distanceStrikes[curSensor]++;
                    console.log("Resin Tray "+(curSensor+1)+" not in place, strike " + distanceStrikes[curSensor]);
                }
            }else if(distancesArr[curSensor] > thresholdValues[curSensor] && !resinTrayXPreviouslyInPlace[curSensor]){
                console.log("Resin Tray "+(curSensor+1)+" not in place with 3 strikes but email already sent");
            }else{
                console.log("Resin Tray "+(curSensor+1)+" in place");
                console.log("Reseting Tray " + (curSensor+1) +"'s distanceStrikes index back to zero" );
                distanceStrikes[curSensor] = 0;
                resinTrayXPreviouslyInPlace[curSensor] = true;
            }
        }
        curSensor++;
        console.log("----------------------------------------------------------");
    }
    console.log("------------------------------------------------------------------------------------------------");
    res.send("MARIbot Printer Tray check sucsessful");
    MARIbot_offline = false;
});
var MARIbot_offline = false;
var MARIbot_previouslyOnline = true;
var MARIbot_offlineEmailNotSent = true;
var MARIbot_firstOffline = null;
app.get("/MARIbot_statusCheck", function(req, res){
    console.log("Running a status check on MARIbot...");
    if(MARIbot_offline){
        console.log("MARIbot offline");
        if(MARIbot_previouslyOnline){
            console.log("MARIbot previously online");
            MARIbot_firstOffline = new Date();
            MARIbot_previouslyOnline = false;
        }else{
            if(!(dateAndTime.isSameDay(MARIbot_firstOffline, new Date() ) ) ){
                if(MARIbot_offlineEmailNotSent){
                    MARIbot_sendEmail("Resin Plate Checker Offline", "Hey Carolyn and Ian, MARIbot here, I'm waiting for my resin plate sensor to ping me but I've lost contact with it for over a day! Please check that it is on and connected to the internet.",2);
                    console.log("MARIbot offline for more than a day, offline email sent v/");
                    MARIbot_offlineEmailNotSent = false;
                }else{
                    console.log("MARIbot offline for more than a day, email already sent");
                }
            }else{
                console.log("MARIbot offline for less than a day");
            }
        }
    }else{
        console.log("MARIbot online")
        MARIbot_previouslyOnline = true;
        MARIbot_offlineEmailNotSent = true;
        MARIbot_firstOffline = null;
    }
    MARIbot_offline = true;
    res.send("Done");
});//   

var MARIBotMailOptions1 = {
    from: 'MARIbot.computer@gmail.com',
    to: ['alexa818@umn.edu', 'cbishoff@umn.edu'],
    subject: '[Default Email]',
    text: '[This is my defualt email! You many not have changed the mailOptions varible in my script]'
};
var MARIBotMailOptions2 = {
    from: 'MARIbot.computer@gmail.com',
    to: ['alexa818@umn.edu'],
    subject: '[Default Email]',
    text: '[This is my defualt email! You many not have changed the mailOptions varible in my script]'
};
var MARIBotTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'maribot.computer@gmail.com',
        pass: 'cqsqfxygvsimnoip'
    }
});
var MARIbot_testingMode = true;
function MARIbot_sendEmail(subject, body, emailOption){
    MARIBotMailOptions1.subject = subject;
    MARIBotMailOptions1.text = body;
    var emailOp = MARIBotMailOptions1;
    if(emailOption == 1){
        emailOp = MARIBotMailOptions1;
    }else if(emailOption == 2){
        emailOp = MARIBotMailOptions2;
    }
    
    MARIBotTransporter.sendMail(emailOp, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    if(!MARIbot_testingMode){
        MARIBotMailOptions2.subject = subject;
        MARIBotMailOptions2.text = body;
        MARIBotTransporter.sendMail(MARIBotMailOptions2, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}
////////////////MARIbot Automations////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////TEDbot Automations\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//\\\\\\\\\\\\\TEDbot Automations//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////GENERAL////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vahcs.computer@gmail.com',
        pass: 'jnfyluctsykvmnpn'
    }
});
var mailOptions = {
    from: 'vahcs.computer@gmail.com',
    to: 'alexa818@umn.edu',
    subject: '[Default Email]',
    text: '[This is my defualt email, sir you many not have changed the mailOptions varible in my script]'
};
var timesheet_successOptions = {
    from: 'vahcs.computer@gmail.com',
    to: 'alexa818@umn.edu',
    subject: 'Timesheet Filled!',
    html: 'Sir I believe I have successfully filled out your timesheet! Check to make sure...<img height="500px" src="cid:unique@kreata.ee"/><img height="500px" src="cid:unique2@kreata.ee"/>',
    attachments: [{
        filename: 'Result1.png',
        path: './timesheet/Result1.png',
        cid: 'unique2@kreata.ee' //same cid value as in the html img src
    },{
        filename: 'Result2.png',
        path: './timesheet/Result2.png',
        cid: 'unique@kreata.ee' //same cid value as in the html img src
    }]
}
function sendEmailToElliot(subject, body){
    mailOptions.subject = subject;
    mailOptions.text = body;

    sendIPhoneNotification(subject,body);
    
    /*transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });*/
}
function sendHTMLEmailToElliot(subject, html){
    mailOptions.subject = subject;
    mailOptions.text = body;

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}



function buildTimestamp(){
    var clock = new Date();

    var year = clock.getFullYear();
    var month = strAdjust(clock.getMonth()+1);
    var day = strAdjust(clock.getDate());
    var hour = strAdjust(clock.getHours());
    var minuete = strAdjust(clock.getMinutes());
    var second = strAdjust(clock.getSeconds());
    var millisecond = clock.getMilliseconds();

    if(hour <= 12){
        hour = hour+"am";
    }else{
        hour = hour-12;
        hour = strAdjust(hour);
        hour = hour+"pm";
    }

    return year+"-"+month+"-"+day+"   "+hour+":"+minuete+":"+second+"."+millisecond;//
}
function strAdjust(n){
    return (n<10)?"-"+n:n;
}

var localSettings = {headless: false, devtools: true };
var deploymentSettings = {headless: true, devtools: false,  args: ["--no-sandbox", "--disable-setuid-sandbox"]};
var settingsToUse = deploymentSettings;

var universalPage = null;
function sendMyselfAnEmail_old(){
    // puppeteer usage as normal//
    puppeteer.launch(settingsToUse).then(async browser => {
        const page = await browser.newPage();
        universalPage = page;
        console.log('Logging into inbox...');
        //const page = await browser.newPage();
        await page.goto('https://mail.google.com/mail/u/1/?fs=1&tf=cm&source=mailto&to');

        await loginTo_RJE(page);

        console.log('0s/40s Awaiting compose to load up...');
        await page.waitForTimeout(10000);
        console.log('10s/40s Awaiting compose to load up...');
        await page.waitForTimeout(10000);
        console.log('20s/40s Awaiting compose to load up...');
        await page.waitForTimeout(10000);
        console.log('30s/40s Awaiting compose to load up...');
        await page.waitForTimeout(10000);


        //await page.waitForSelector("#sbddm");
        console.log('40s/40s Great compose should be ready');

        console.log('Writting who email should be sent to...');
        await page.keyboard.type("alexa818@umn.edu");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Tab");
        await page.waitForTimeout(2000);
        console.log('Writing Email subject line...');
        await page.keyboard.type("This is from VAHCS!");
        await page.waitForTimeout(1000);
        await page.keyboard.press("Tab");
        await page.waitForTimeout(1000);
        console.log('Writing Email body...');
        await page.keyboard.type('Sir, your email was sent sucsessfully!');
        await page.waitForTimeout(1000);
        console.log('Pressing send...');
        await page.keyboard.press("Tab");
        await page.waitForTimeout(1000);
        await page.keyboard.press("Enter");
        console.log('Message Sent!');
        console.log('v/ EmailMe Sequence complete');
        //page.close();
    });
}


function uploadYoutubeVideo(){
    // puppeteer usage as normal
    puppeteer.launch(settingsToUse).then(async browser => {
        const page = await browser.newPage();
        universalPage = page;
        console.log('Logging into Youtube...');
        await page.goto('https://studio.youtube.com/channel/UCGPaqgFF0dlWzViC9aC1hJg/editing/sections');///

        loginTo_RJE();
    });
}

async function loginTo_RJE(page){
    console.log('Logging into your gmail account...');
    await page.type("#identifierId", "ianalexander.rje@gmail.com");

    console.log('Clicking next...');
    await page.click("#identifierNext", {clickCount: 1});

    console.log('email address entered');
    await page.waitForTimeout(3000);
    console.log('Pressing enter key...');
    await page.keyboard.press("Enter");
    console.log('Waiting some time...');//
    await page.waitForTimeout(5000);
    await page.keyboard.type("Perseverance");
    console.log('Waiting some time...');
    await page.waitForTimeout(1500);
    await page.keyboard.press("Enter");

}

app.get("/uploadYoutubeVideo", function (req, res) {
    uploadYoutubeVideo();
    res.send("done");
});

async function runPureCode(codeStr){
    console.log("Running a string of pure code...");
    eval(codeStr);
}
function fillOutExceedLabTimesheet() {
    puppeteer.launch(settingsToUse).then(async browser => {
        try{
            var i = 0;
            var page = await browser.newPage();
            universalPage = page;
            console.log('Filling out your Toaster Timesheet...');
            await page.goto('https://www.myu.umn.edu/psp/psprd/EMPLOYEE/HRMS/c/ROLE_EMPLOYEE.TL_MSS_EE_SRCH_PRD.GBL');
            await page.waitForSelector("#username");
            await page.type("#username", "alexa818");
            await page.type("#password", "$GoGoldenGophers2020");
            await page.click(".idp3_form-submit");
            await page.waitForSelector("#duo_form");
            console.log("Waiting for Form to load...'");
            const frameHandle = await page.$("#duo_form");
            console.log("Form loaded waiting more...'");
            await page.waitForTimeout(2500);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            progShot(page, "timesheet", i++);
            await page.waitForTimeout(500);
            console.log("Clicking 'Send Me a Push'");
            await page.keyboard.press("Enter");
            progShot(page, "timesheet", i++);
            await page.waitForSelector("#lbFrame");
            progShot(page, "timesheet", i++);
            await page.waitForTimeout(2500);
            console.log("Clicking 'Student Accedemic Support'");
            progShot(page, "timesheet", i++);
            await page.waitForTimeout(1000);
            //await page.mouse.click(132, 353);
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Enter");

            progShot(page, "timesheet", i++);
            await page.waitForSelector("#ptifrmtemplate");
            progShot(page, "timesheet", i++);
            await page.waitForTimeout(2500);
            progShot(page, "timesheet", i++);

            console.log("Tabbing into input spaces...'");
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            progShot(page, "timesheet", i++);

            await page.keyboard.type("9:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("12:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("12:15");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("14:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Space");
            await page.waitForTimeout(100);
            await page.keyboard.press("ArrowDown");
            await page.waitForTimeout(100);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("PA_OVRRIDE");
            await page.waitForTimeout(1000);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(1000);
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("1000100232216700000349779");
            await page.waitForTimeout(500);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(2000);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            progShot(page, "timesheet", i++);

            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            progShot(page, "timesheet", i++);

            await page.keyboard.type("9:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("12:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("12:15");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("14:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Space");
            await page.waitForTimeout(100);
            await page.keyboard.press("ArrowDown");
            await page.waitForTimeout(100);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("PA_OVRRIDE");
            await page.waitForTimeout(500);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(2000);
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("1000100232216700000349779");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            progShot(page, "timesheet", i++);

            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            progShot(page, "timesheet", i++);

            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            progShot(page, "timesheet", i++);

            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            progShot(page, "timesheet", i++);

            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");  
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(3000);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(3000);
            progShot(page, "timesheet", "Result1");
            await page.waitForTimeout(1000);

            page = await browser.newPage();
            universalPage = page;
            console.log('Filling out your Anderson Labs Timesheet...');
            await page.goto('https://www.myu.umn.edu/psp/psprd/EMPLOYEE/HRMS/c/ROLE_EMPLOYEE.TL_MSS_EE_SRCH_PRD.GBL');
            progShot(page, "timesheet", i++);

            await page.waitForTimeout(2500);
            console.log("Clicking 'Student Tech Support Services'");
            progShot(page, "timesheet", i++);
            await page.waitForTimeout(1000);
            await page.keyboard.press("Enter");
            //await page.mouse.click(132, 303);
            progShot(page, "timesheet", i++);
            await page.waitForSelector("#ptifrmtemplate");
            await page.waitForTimeout(2500);

            progShot(page, "timesheet", i++);
            console.log("Tabbing into input spaces...'");
            progShot(page, "timesheet", i++);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            progShot(page, "timesheet", i++);

            await page.keyboard.type("9:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:01");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");//
            await page.waitForTimeout(100);
            await page.keyboard.type("10:15");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Space");
            await page.waitForTimeout(100);
            await page.keyboard.press("ArrowDown");
            await page.waitForTimeout(100);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            progShot(page, "timesheet", i++);

            await page.keyboard.type("9:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:01");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:15");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Space");
            await page.waitForTimeout(100);
            await page.keyboard.press("ArrowDown");
            await page.waitForTimeout(100);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            progShot(page, "timesheet", i++);

            await page.keyboard.type("9:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:01");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:15");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Space");
            await page.waitForTimeout(100);
            await page.keyboard.press("ArrowDown");
            await page.waitForTimeout(100);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            progShot(page, "timesheet", i++);

            await page.keyboard.type("9:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:01");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:15");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Space");
            await page.waitForTimeout(100);
            await page.keyboard.press("ArrowDown");
            await page.waitForTimeout(100);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            progShot(page, "timesheet", i++);

            await page.keyboard.type("9:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:01");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:15");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Space");
            await page.waitForTimeout(100);
            await page.keyboard.press("ArrowDown");
            await page.waitForTimeout(100);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            progShot(page, "timesheet", i++);

            await page.keyboard.type("9:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:01");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("11:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Space");
            await page.waitForTimeout(100);
            await page.keyboard.press("ArrowDown");
            await page.waitForTimeout(100);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            progShot(page, "timesheet", i++);

            await page.keyboard.type("9:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("10:01");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.keyboard.type("11:00");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Space");
            await page.waitForTimeout(100);
            await page.keyboard.press("ArrowDown");
            await page.waitForTimeout(100);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Tab");
            await page.waitForTimeout(100);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(3000);
            await page.keyboard.press("Enter");
            await page.waitForTimeout(3000);
            progShot(page, "timesheet", "Result2");

            transporter.sendMail(timesheet_successOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }catch{
            console.log("(!)Something went wrong filling out timesheet!");
            sendEmailToElliot("(!) Error Filling Out Timesheets", "Sir something went wrong filling out your timesheets :(");
        }
    });
}


app.get("/preTimesheetReminder", function (req, res) {
    var url = "https://alertzy.app/send?accountKey=m143fegulr79ila&title=Filling%20Out%20TimeSheet%20In%2015&message=Prepare%20To%20Approve%20Push&group=null";
    console.log("Requesting url: "+url);
    request({url: url, json:true},(error,data) =>{
        res.send("done");
    });
});
function sendIPhoneNotification(sub,mes){   //Send a push notification on your IPhone!//
    var url = "https://alertzy.app/send?accountKey=m143fegulr79ila&title="+encodeURIComponent(sub)+"&message="+encodeURIComponent(mes);
    console.log("Requesting url: "+url);
    request({url: url, json:true},(error,data) =>{
        console.log("Alertzy Message Sent!");//
    });
}

app.get("/grabTSShots", function (req, res) {
    console.log("Download all Timesheet images to client's computer...");

    var output = fs.createWriteStream('TSShots.zip');
    var archive = archiver('zip');

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('Archiver has been finalized and the output file descriptor has closed -- zip sucsessful!');
        res.download(__dirname + "/TSShots.zip");
        console.log('~download performed~');
        //res.send('~downloaded!~');
    });

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);

    // append files from a sub-directory, putting its contents at the root of archive
    archive.directory('./timesheet', false);

    // append files from a sub-directory and naming it `new-subdir` within the archive
    archive.directory('subdir/', 'new-subdir');

    archive.finalize();
});

async function progShot(p, fold, incrementer) {
    await p.screenshot({ path: fold + '/' + incrementer + '.png' });
}

function mattSweep() {
    puppeteer.launch({
        headless: false, devtools: true
    }).then(async browser => {

        var i = 1;
        await recursiveProductPageCollectorDriver(browser, i, recursiveProductPageCollectorDriver);

        var j = 55;
        await recursiveProductPageScreenshotDriver(browser, i, recursiveProductPageScreenshotDriver);


    });
}

var capturedProductSubpageLinks = [];
async function recursiveProductPageCollectorDriver(browser,i, callback) {
    console.log('Going to Oponer products page ' + i + '...');
    const page = await browser.newPage();
    universalPage = page;
    await page.goto('https://www.uponor.com/en-us/products?page=' + i);
    console.log('Pulling product page ' + i + '\'s product subpage links...');

    let urls = await page.$$eval('.jJSlwt', links => {
        // Extract the links from the data
        links = links.map(el => el.href)
        console.log("links: " + links);
        return links;
    });

    console.log("urls: " + urls);
    capturedProductSubpageLinks = capturedProductSubpageLinks.concat(urls);
    console.log("Current capturedProductSubpageLinks array: " + JSON.stringify(capturedProductSubpageLinks));

    capturedProductSubpageLinks

    i++;
    await page.close();
    if (i <= 26) {
        await callback(browser, i, recursiveProductPageCollectorDriver);
    }
}
async function recursiveProductPageScreenshotDriver(browser, j, callback) {
    console.log('Going to Oponer product subpage ' + j + ':' + capturedProductSubpageLinks[j]+'...');
    const page = await browser.newPage();
    await page.setViewport({ width: 2320, height: 1000 });
    universalPage = page;
    await page.goto(capturedProductSubpageLinks[j]);
    console.log('Clearing the Accept Cookies blocker...');
    await page.evaluate(() => {
        document.getElementById("usercentrics-root").remove();
    });

    var s = 0;
    do {
        console.log('Taking a screenshot ('+s+')...');
        await page.screenshot({ path: 'captures/' + j + '_' + s + '.png' });

        await page.evaluate(() => {
            document.scrollingElement.scrollBy(0, window.innerHeight - 200);
        });
        s++;
        isNotDone = await getData(page);
    } while (isNotDone );
    await page.close();

    j++;
    if (j < capturedProductSubpageLinks.length) {
        await callback(browser, j, recursiveProductPageScreenshotDriver);
    }
}
const getData = (page) => {
    return page.evaluate(async () => {
        return await new Promise(resolve => { // <-- return the data to node.js from browser
            resolve(document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight);
        })
    })
}

app.get("*", function(req, res){
    res.send("404!");
});
