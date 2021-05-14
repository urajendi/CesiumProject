// Defining SVGs and it's dimensions
var matSvg;
var menuSvg;

// Defining dimensions and margin
var matSvgWidth;
var matSvgHeight;
var menuSvgWidth;
var menuSvgHeight;
var margin = {top: 10, right: 10, left: 10, bottom: 10};

// Defining buttons
var addButton;
var delButton;
var delIcon;

// Defining form items
var formLeft;
var formRight;
var nameInput;
var mname;
var mvolume;
var mddate;
var mcolor;
var mcost;
var waitMsg;
var errorMsg;
var successMsg;

// Defining date variables
var today;
var dateFormat = "MM-DD-YYYY";

// Defining JSON object to store materials list
var matJSON = [];
var matJSONLength;
var delJSON = [];

// Defining matTable elements
var defaultText;

// Defining hover and onclick attributes
var hoverColor = "#000344";
var hoverOpacity = 0.8;
var clickColor = "#FFFFFF"; 
var clickOpacity = 0.2;


// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Fetching Svgs
    matSvg = d3.select("#materials");
    matSvgWidth = + matSvg.style('width').replace('px','');
    matSvgHeight = +matSvg.style('height').replace('px','');
    matInnerWidth = matSvgWidth - margin.left - margin.right;
    matInnerHeight = matSvgHeight - margin.top - margin.bottom;

    menuSvg = d3.select("#menu");
    menuSvgWidth = + menuSvg.style('width').replace('px','');
    menuSvgHeight = +menuSvg.style('height').replace('px','');
    menuInnerWidth = menuSvgWidth - margin.left - margin.right;
    menuInnerHeight = menuSvgHeight - margin.top - margin.bottom;

    // Setting default text for materials list
    defaultText = d3.select("#default-text");
    defaultText.append("g")
        .attr("id", "initial-text")
        .attr("transform", `translate(${matInnerWidth/2+margin.right},${matInnerHeight/2+margin.top+margin.bottom})`)
        .append("text")
        .text("No Materials")
        .style("font-weight", 300)
        .style("font-style", "italic")
        .style("text-anchor", "middle")
        .style("font-size", "22px")
        .style("font-family", "'Open Sans', sans-serif;")
        .style("fill", "#AEAEAF")
        .style("color", "#AEAEAF");

    // Setting default date to today
    today = new Date();
    document.getElementById("mddate").valueAsDate = new Date();

    // Setting menu div to invisible in the begining
    formLeft = document.getElementById("form-wrapper-left");
    formRight = document.getElementById("form-wrapper-right");
    formLeft.style.visibility = "hidden";
    formRight.style.visibility = "hidden";

    // Fetching buttons by ID
    addButton = d3.select("#add-button");
    addIcon = document.getElementById("add-icon");
    delButton = document.getElementById("delete-button");
    delIcon = document.getElementById("delete-icon");

    matJSONLength = matJSON.length;
    if(matJSONLength<1){
        // Setting initial values for delete button
        delButton.style.backgroundColor="#3A3A44";
        delButton.style.color="#737373";
        delButton.style.cursor="default";
        delButton.disabled = true;

        delIcon.src="icons/delete-off.png";
        delIcon.style.cursor="default";
    }

    // Fetching initial form values by ID
    nameInput = document.getElementById("mname");
    if (nameInput != null) {
        mname = nameInput.value;
    }
    else {
        mname = null;
    }
    mvolume = document.getElementById("mvolume").value;
    mddate = document.getElementById("mddate").valueAsDate;
    // Adding one day to the date because default javascript fetchs one day prior to current date
    mddate.setDate(mddate.getDate() + 1);   
    mcolor = document.getElementById("mcolor").value;
    mcost = document.getElementById("mcost").value;

    waitMsg = document.getElementById("waitMsg");
    errorMsg = document.getElementById("errorMsg");
    successMsg = document.getElementById("successMsg");

    // Onclick for add 
    addButton.on('mouseover', function() {
        formLeft.style.visibility = "visible";
        formRight.style.visibility = "visible";
    })
    .on('mousemove',function() {
        formLeft.style.visibility = "visible";
        formRight.style.visibility = "visible";
    })
    .on('mouseout', function() {
        // Do nothing
    })
    .on('click', function() {

        // Emptying the error message
        errorMsg.innerHTML = "";
        successMsg.innerHTML = "";
        waitMsg.append("Checking for input validity...");

        // Fetching current form values by ID
        nameInput = document.getElementById("mname");
        if (nameInput != null) {
            mname = nameInput.value;
        }
        else {
            mname = null;
        }
        mvolume = document.getElementById("mvolume").value;
        mddate = document.getElementById("mddate").valueAsDate;
        mddate.setDate(mddate.getDate() + 1);   
        mcolor = document.getElementById("mcolor").value;
        mcost = document.getElementById("mcost").value;
        errorMsg = document.getElementById("errorMsg");

        // Check for validity
        validateInput();
    });
    
});

// Function to validate the form input
function validateInput(){
    // Logs for form values
    // console.log("----Log for form values----");
    // console.log("mname = "+mname);
    // console.log("mvolume = "+mvolume);
    // console.log("mddate = "+moment(mddate).format(dateFormat));
    // console.log("mcolor = "+mcolor);
    // console.log("mcost = "+mcost);

    // Defining check variables for form items
    var isNameEmpty = false;
    var isVolZero = false;
    var isCostZero = false;
    var isDateDefault = false;
    var isColorDefault = false;

    var trueCount = 0;
    
    // 0. Initial checksum
    if(mname==null){
        isNameEmpty = true;
        trueCount += 1;
    }
    if(mvolume==0){
        isVolZero = true;
        trueCount += 1;
    }
    if(mcost==0){
        isCostZero = true;
        trueCount += 1;
    }
    if(moment(mddate).format(dateFormat)==moment(today).format(dateFormat)){
        isDateDefault = true;
    }
    if(mcolor=="#ffffff"){
        isColorDefault = true;
    }

    // Logs for inital checksum
    // console.log("----Log for inital checksum----");
    // console.log("trueCount = "+trueCount);
    // console.log("isNameEmpty = "+isNameEmpty);
    // console.log("isVolZero = "+isVolZero);
    // console.log("isCostZero = "+isCostZero);
    // console.log("isDateDefault = "+isDateDefault);
    // console.log("isColorDefault = "+isColorDefault);
    
    // 1. Empty or zero or default value checks
    if(trueCount>1){
        errorMsg.style.visibility = "visible";
        waitMsg.innerHTML = "";
        errorMsg.append("Warning! One or more form field is empty or zero!!");
        return;
    } else if (mname==null){
        errorMsg.style.visibility = "visible";
        waitMsg.innerHTML = "";
        errorMsg.append("Warning! Name cannot be Empty!!");
        return;
    } else if(mvolume<=0){
        errorMsg.style.visibility = "visible";
        waitMsg.innerHTML = "";
        errorMsg.append("Warning! Volume cannot be zero or less!!");
        return;
    } else if(mcost<=0){
        errorMsg.style.visibility = "visible";
        waitMsg.innerHTML = "";
        errorMsg.append("Warning! Cost cannot be zero or less!!");
        return;
    } else if(isColorDefault==true && isDateDefault==true){
        errorMsg.style.visibility = "visible";
        waitMsg.innerHTML = "";
        errorMsg.append("Warning! Date and color are set to default values!!");
        return;
    } else if(isDateDefault==true){
        errorMsg.style.visibility = "visible";
        waitMsg.innerHTML = "";
        errorMsg.append("Warning! Date is set to default value!!");
        return;
    } else if(isColorDefault==true){
        errorMsg.style.visibility = "visible";
        waitMsg.innerHTML = "";
        errorMsg.append("Warning! Color is set to default value!!");
        return;
    } else {
        appendMat(mname, mvolume, mddate, mcolor, mcost);
        successMsg.style.visibility = "visible";
        waitMsg.innerHTML = "";
        defaultText.style("visibility", "hidden");
        successMsg.append("Successfully added new material!!");
        return;
    }
}

// Function to store materials to table
function appendMat(mname, mvolume, mddate, mcolor, mcost){
    // Logs for form values
    // console.log("----Log for form values----");
    // console.log("mname = "+mname);
    // console.log("mvolume = "+mvolume);
    // console.log("mddate = "+moment(mddate).format(dateFormat));
    // console.log("mcolor = "+mcolor);
    // console.log("mcost = "+mcost);

    var record = {}
    record["Name"] = mname;
    record["Volume"] = mvolume;
    record["Date"] = mddate;
    record["Color"] = mcolor;
    record["Cost"] = mcost;
    record["x"] = 0;
    record["y"] = matJSON.length*10;
    record["text"] = 120;

    matJSON.push(record);

    drawTable(matJSON);
    updateTotal(matJSON);

    // Enabling delete button 
    delButton = document.getElementById("delete-button");

    matJSONLength = matJSON.length;
    if(matJSONLength<1){
        // No Records to delete
        delButton.style.backgroundColor="#3A3A44";
        delButton.style.color="#737373";
        delButton.style.cursor="default";
        delButton.disabled = true;

        delIcon.src="icons/delete-off.png";
        delIcon.style.cursor="default";
    } else {
        delButton.style.backgroundColor="#FF444C";
        delButton.style.color="#DFDFE0";
        delButton.style.cursor="pointer";
        delButton.disabled = false;

        delIcon.src="icons/delete-on.png";
        delIcon.style.cursor="pointer";
    }
    
    var deleteButton = d3.select("#delete-button");
    // Onclick for delete 
    if(delButton.disabled == false){
        deleteButton.on('click', function() {
            deleteItems(matJSON);
        });
    }
}

// Function to display materials list
function drawTable(matJSON){

    matSvg.selectAll("*").remove();

    var lineHeight = 0;

    var rect = matSvg.selectAll("g")
                        .data(matJSON)
                        .enter()
                        .append("rect")
                        .attr("class", "rowRectangle")
                        .attr("id", function(d,i) { 
                            return "rect-"+i;
                        })
                        .attr("cx", function(d) { 
                            return d.x; 
                        })
                        .attr("cy", function(d) { 
                            return d.y; 
                        })
                        .attr("transform", function(d) {
                            return `translate(${0},${d.y*8})`;
                        })
                        .on('mouseover', function(d, i) {
                            var rectID = document.getElementById("rect-"+i);
                            if(rectID.getAttribute("class")!="rowRectangle-clicked"){   
                                rectID.style.fill = hoverColor;
                                rectID.style.opacity = hoverOpacity;
                                rectID.style.cursor = "pointer";
                            }
                        })
                        .on('mousemove',function(d, i) {
                            var rectID = document.getElementById("rect-"+i);
                            if(rectID.getAttribute("class")!="rowRectangle-clicked"){   
                                rectID.style.fill = hoverColor;
                                rectID.style.opacity = hoverOpacity;
                                rectID.style.cursor = "pointer";
                            }
                        })
                        .on('mouseout', function(d, i) {
                            var rectID = document.getElementById("rect-"+i);
                            if(rectID.getAttribute("class")!="rowRectangle-clicked"){   
                                rectID.style.fill = "rgba(0,0,0,0)";
                                rectID.style.opacity = 0;
                                rectID.style.cursor = "default";
                            }
                        })
                        .on('click', function(d, i) {
                            var rectID = document.getElementById("rect-"+i); 
                            if(rectID.getAttribute("class")=="rowRectangle-clicked"){
                                rectID.setAttribute("class", "rowRectangle");      
                                rectID.style.fill = "rgba(0,0,0,0)";
                                rectID.style.opacity = 0;
                            } else {
                                rectID.setAttribute("class", "rowRectangle-clicked");    
                                rectID.style.fill = clickColor;
                                rectID.style.opacity = clickOpacity;
                                rectID.style.cursor = "pointer";
                            }
                        });

    var circle = matSvg.selectAll("g")
                    .data(matJSON)
                    .enter()
                    .append("circle")
                    .attr("class", "colorCircle")
                    .attr("id", function(d,i) { 
                        return "circ-"+i;
                    })
                    .style("stroke", "none")
                    .style("fill", function(d) { 
                        return d.Color; 
                    })
                    .attr("cx", function(d) { 
                        return d.x; 
                    })
                    .attr("cy", function(d) { 
                        return d.y; 
                    })
                    .attr("r", 25)
                    .attr("transform", function(d, i) {
                        return `translate(${40},${d.y+(60)*i+40})`;
                    })
                    .on('mouseover', function(d, i) {
                        var rectID = document.getElementById("rect-"+i);
                        if(rectID.getAttribute("class")!="rowRectangle-clicked"){   
                            rectID.style.fill = hoverColor;
                            rectID.style.opacity = hoverOpacity;
                            rectID.style.cursor = "pointer";
                        }
                    })
                    .on('mousemove',function(d, i) {
                        var rectID = document.getElementById("rect-"+i);
                        if(rectID.getAttribute("class")!="rowRectangle-clicked"){   
                            rectID.style.fill = hoverColor;
                            rectID.style.opacity = hoverOpacity;
                            rectID.style.cursor = "pointer";
                        }
                    })
                    .on('mouseout', function(d, i) {
                        var rectID = document.getElementById("rect-"+i);
                        if(rectID.getAttribute("class")!="rowRectangle-clicked"){   
                            rectID.style.fill = "rgba(0,0,0,0)";
                            rectID.style.opacity = 0;
                            rectID.style.cursor = "default";
                        }
                    })
                    .on('click', function(d, i) {
                        var rectID = document.getElementById("rect-"+i); 
                        if(rectID.getAttribute("class")=="rowRectangle-clicked"){
                            rectID.setAttribute("class", "rowRectangle");      
                            rectID.style.fill = "rgba(0,0,0,0)";
                            rectID.style.opacity = 0;
                        } else {
                            rectID.setAttribute("class", "rowRectangle-clicked");    
                            rectID.style.fill = clickColor;
                            rectID.style.opacity = clickOpacity;
                            rectID.style.cursor = "pointer";
                        }
                    });
    
    var itemName = matSvg.selectAll("g")
                        .data(matJSON)
                        .enter()
                        .append("text")
                        .attr("class", "itemName")
                        .attr("id", function(d,i) { 
                            return "itemName-"+i;
                        })
                        .text(function(d){
                            return d.Name;
                        })
                        .attr("cx", function(d) { 
                            return d.x; 
                        })
                        .attr("cy", function(d) { 
                            return d.y; 
                        })
                        .attr("r", 25)
                        .attr("transform", function(d, i) {
                            return `translate(${80},${(80*(i+1)-40)})`
                        })
                        .on('mouseover', function(d, i) {
                            var rectID = document.getElementById("rect-"+i);
                            if(rectID.getAttribute("class")!="rowRectangle-clicked"){   
                                rectID.style.fill = hoverColor;
                                rectID.style.opacity = hoverOpacity;
                                rectID.style.cursor = "pointer";
                            }
                        })
                        .on('mousemove',function(d, i) {
                            var rectID = document.getElementById("rect-"+i);
                            if(rectID.getAttribute("class")!="rowRectangle-clicked"){   
                                rectID.style.fill = hoverColor;
                                rectID.style.opacity = hoverOpacity;
                                rectID.style.cursor = "pointer";
                            }
                        })
                        .on('mouseout', function(d, i) {
                            var rectID = document.getElementById("rect-"+i);
                            if(rectID.getAttribute("class")!="rowRectangle-clicked"){   
                                rectID.style.fill = "rgba(0,0,0,0)";
                                rectID.style.opacity = 0;
                                rectID.style.cursor = "default";
                            }
                        })
                        .on('click', function(d, i) {
                            var rectID = document.getElementById("rect-"+i); 
                            if(rectID.getAttribute("class")=="rowRectangle-clicked"){
                                rectID.setAttribute("class", "rowRectangle");      
                                rectID.style.fill = "rgba(0,0,0,0)";
                                rectID.style.opacity = 0;
                            } else {
                                rectID.setAttribute("class", "rowRectangle-clicked");    
                                rectID.style.fill = clickColor;
                                rectID.style.opacity = clickOpacity;
                                rectID.style.cursor = "pointer";
                            }
                        });

    var itemVolume = matSvg.selectAll("g")
                        .data(matJSON)
                        .enter()
                        .append("text")
                        .attr("class", "itemVolume")
                        .attr("id", function(d,i) { 
                            return "itemVolume-"+i;
                        })
                        .text(function(d){
                            return d.Volume+"  ㎥";
                        })
                        .attr("cx", function(d) { 
                            return d.x; 
                        })
                        .attr("cy", function(d) { 
                            return d.y; 
                        })
                        .attr("r", 25)
                        .attr("transform", function(d, i) {
                            return `translate(${80},${(80*(i+1)-20)})`
                        })
                        .on('mouseover', function(d, i) {
                            var rectID = document.getElementById("rect-"+i);
                            if(rectID.getAttribute("class")!="rowRectangle-clicked"){   
                                rectID.style.fill = hoverColor;
                                rectID.style.opacity = hoverOpacity;
                                rectID.style.cursor = "pointer";
                            }
                        })
                        .on('mousemove',function(d, i) {
                            var rectID = document.getElementById("rect-"+i);
                            if(rectID.getAttribute("class")!="rowRectangle-clicked"){   
                                rectID.style.fill = hoverColor;
                                rectID.style.opacity = hoverOpacity;
                                rectID.style.cursor = "pointer";
                            }
                        })
                        .on('mouseout', function(d, i) {
                            var rectID = document.getElementById("rect-"+i);
                            if(rectID.getAttribute("class")!="rowRectangle-clicked"){   
                                rectID.style.fill = "rgba(0,0,0,0)";
                                rectID.style.opacity = 0;
                                rectID.style.cursor = "default";
                            }
                        })
                        .on('click', function(d, i) {
                            var rectID = document.getElementById("rect-"+i); 
                            if(rectID.getAttribute("class")=="rowRectangle-clicked"){
                                rectID.setAttribute("class", "rowRectangle");      
                                rectID.style.fill = "rgba(0,0,0,0)";
                                rectID.style.opacity = 0;
                            } else {
                                rectID.setAttribute("class", "rowRectangle-clicked");    
                                rectID.style.fill = clickColor;
                                rectID.style.opacity = clickOpacity;
                                rectID.style.cursor = "pointer";
                            }
                        });
}

// Function to update the total
function updateTotal(matJSON){
    var sum = document.getElementById("total-value");
    var totalCost = 0;
    for(var i=0; i<matJSON.length; i++){
        totalCost += matJSON[i].Volume*matJSON[i].Cost;
    }
    sum.innerHTML = "$"+totalCost;
}

// Function to delete selected materials
function deleteItems(matJSON){

    var delIDs = [];
    var clickedRect = d3.selectAll(".rowRectangle-clicked")
                        .each(function(){
                            var temp = d3.select(this).attr("id");
                            delIDs.push(temp.split("-")[1]);
                        });
    delIDs.sort().reverse();

    for(var i=matJSON.length-1; i>=0; i--){
        if(i in delIDs){
            delIDs.shift();
            matJSON.splice(i, 1);
        }
    }

    // If there are elements to display
    if(matJSON.length>0){
        for(var i=0; i<matJSON.length; i++){
            matJSON[i].y = i*10;;
        }
        drawTable(matJSON);
        updateTotal(matJSON);

        // Display success message
        successMsg = document.getElementById("successMsg");
        successMsg.style.visibility = "visible";
        waitMsg.innerHTML = "";
        successMsg.innerHTML = "";
        defaultText.style("visibility", "hidden");
        successMsg.append("Successfully deleted selected material!!");

    } else {    // If there are no items to display
        matSvg = d3.select("#materials");
        matSvgWidth = + matSvg.style('width').replace('px','');
        matSvgHeight = +matSvg.style('height').replace('px','');
        matInnerWidth = matSvgWidth - margin.left - margin.right;
        matInnerHeight = matSvgHeight - margin.top - margin.bottom;

        // Setting default text for materials list
        matSvg.selectAll("*").remove();
        matSvg.append("g")
                .attr("id", "#default-text")
                .append("g")
                .attr("id", "initial-text")
                .attr("transform", `translate(${matInnerWidth/2+margin.right},${matInnerHeight/2+margin.top+margin.bottom})`)
                .append("text")
                .text("No Materials")
                .style("font-weight", 300)
                .style("font-style", "italic")
                .style("text-anchor", "middle")
                .style("font-size", "22px")
                .style("font-family", "'Open Sans', sans-serif;")
                .style("fill", "#AEAEAF")
                .style("color", "#AEAEAF");

        // Fetching delete button by ID
        delButton = document.getElementById("delete-button");
        delIcon = document.getElementById("delete-icon");

        // Setting initial values for delete button
        delButton.style.backgroundColor="#3A3A44";
        delButton.style.color="#737373";
        delButton.style.cursor="default";
        delButton.disabled = true;

        delIcon.src="icons/delete-off.png";
        delIcon.style.cursor="default";
    }
}