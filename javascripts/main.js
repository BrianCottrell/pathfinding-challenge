/* Path Minimization Challenge Application */
/* By Brian Cottrell		               */
/* 12-18-2014      		                   */

/*VARIABLES*/
var scale = 29.9484914796,	//Gives the map scale in miles per percentage of image width
	groups = 48,			//Indicates the number of group to pass through to complete a challenge
	//Set the starting parameters for the highscore, login, menu, preferences, and title modules
	highscoreX = '80%', highscoreY = '30%', highscoreColor = 'rgba(0,50,100,0.8)',
	loginX = '85%', loginY = '0%', loginColor = 'rgba(200,100,0,0.4)',
	menuX = '2%', menuY = '30%', menuColor = 'rgba(0,200,50,0.6)',
	preferencesX = '6%', preferencesY = '6%', preferencesColor = 'rgba(200,200,0,0.7)',
	titleX = '35%', titleY = '0%', titleColor = 'rgba(0,100,200,0.6)';
var x, y, width,			//X and Y coordinates and image width for the map image
	distanceTotal,			//Stores the total distance of the current path
	saveColor,				//Stores the original color of an element for mouseover
	dragging,				//Indicates when an element is being dragged
	dragX, dragY;			//X and Y coordinates of drag event	
var pointsData = getPoints();	//Returns the point data information from the points.js file
var pointsArray = [],		//Stores all of the points as html elements
	pathArray = [],			//Stores the points included in the current path
	groupTotal = [];		//Stores each unique group incuded in the current path
var map = document.getElementsByClassName('map')[0];

/*FUNCTIONS*/
//Draw all of the clickable points on the map using data frome the points.js file
function drawPoints(){
	pointsArray.length = pointsData.length;
	//Fill the points array with html point elements and add them to the map
	for(var i = 0; i < pointsData.length; i++){
		//X and Y coordinate information is given in the first two positions of the array
		x = pointsData[i][0];
		y = pointsData[i][1];
		width = map.offsetWidth;
		pointsArray[i] = document.createElement('div');
		pointsArray[i].classList.add('point');
		pointsArray[i].style.backgroundColor = groupColor(pointsData[i][2]);
		map.appendChild(pointsArray[i]);
		pointsArray[i].style.marginLeft = (x*width/100-pointsArray[i].offsetWidth/2)+'px';
		pointsArray[i].style.marginTop = ((y-50)*width/100-pointsArray[i].offsetHeight/2)+'px';
		//Add event listeners to make the points respond to clicks and mouseover
		pointsArray[i].addEventListener('mouseover', addFocus, false)
		pointsArray[i].addEventListener('mouseout', removeFocus, false)
		pointsArray[i].addEventListener('click', selectPoint, false);
	}
}
//Updates the position of all points
function redrawPoints(){
	for(var i = 0; i < pointsData.length; i++){
		x = pointsData[i][0];
		y = pointsData[i][1];
		width = map.offsetWidth;
		pointsArray[i].style.marginLeft = (x*width/100-pointsArray[i].offsetWidth/2)+'px';
		pointsArray[i].style.marginTop = ((y-50)*width/100-pointsArray[i].offsetHeight/2)+'px';
	}
}
//Draw a line between to points
function drawLine(point1x, point1y, point2x, point2y){
	var x1 = point1x;
	var y1 = point1y;
	var x2 = point2x;
	var y2 = point2y;
	var leftOffset;
	var rotation;
	line = document.createElement('div');
	line.classList.add('line');
	line.style.width = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2))+'%'
	leftOffset = (x1-(parseFloat(line.style.width.substr(0,line.style.width.length-1))-(x2-x1))/2);	
	line.style.marginLeft = leftOffset+'%';
	line.style.marginTop = ((y1-50)+(y2-y1)/2)+'%';
	rotation = Math.atan((y2-y1)/(x2-x1));
	line.style.transform = 'rotate('+rotation+'rad)';
	line.style.mozTransform = 'rotate('+rotation+'rad)';
	line.style.webkitTransform = 'rotate('+rotation+'rad)';
	map.appendChild(line);
}
//Change the color of an element during a mouse over event
function addFocus(){
	saveColor = this.style.backgroundColor;
	this.style.backgroundColor = 'orange';
}
//Restore the original color when the mouse leave the element
function removeFocus(){
	this.style.backgroundColor = saveColor;
}
//When a point is clicked
function selectPoint(){
	var xSquared, ySquared
	var leftOffset = parseInt(this.style.marginLeft.substr(0,this.style.marginLeft.length-2))-3;
	var topOffset = parseInt(this.style.marginTop.substr(0,this.style.marginTop.length-2))-3;
	this.style.border = '3px solid yellow';
	this.style.marginLeft = leftOffset+'px';
	this.style.marginTop = topOffset+'px';
	pathArray.push(pointsData[pointsArray.indexOf(this)]);
	if(pathArray.length > 1){
		distanceTotal = 0;
		for(var i = 1; i < pathArray.length; i++){
			xSquared = Math.pow(pathArray[i][0]-pathArray[i-1][0],2);
			ySquared = Math.pow(pathArray[i][1]-pathArray[i-1][1],2)
			distanceTotal+=Math.sqrt(xSquared+ySquared)*scale;
		}
		var x1 = pathArray[pathArray.length-1][0];
		var y1 = pathArray[pathArray.length-1][1];
		var x2 = pathArray[pathArray.length-2][0];
		var y2 = pathArray[pathArray.length-2][1];
		drawLine(x1, y1, x2, y2);
	}
	if(distanceTotal){
		document.getElementsByClassName('distance')[0].innerHTML = Math.round(distanceTotal)+' miles';
		document.getElementsByClassName('distance')[1].value = Math.round(distanceTotal);
	}
	checkCompeteness();
}
//Set the color of each point based on its group number
function groupColor(number){
	var colorValue;
	var group = number;
	if(group%6 == 0){
		colorValue = (3*group).toString()+','+(255-3*group).toString()+','+(255-3*group).toString();
	}else if(group%6 == 1){
		colorValue = (255-3*group).toString()+','+(3*group).toString()+','+(3*group).toString();
	}else if(group%6 == 2){
		colorValue = (255-3*group).toString()+','+(255-3*group).toString()+','+(3*group).toString();
	}else if(group%6 == 3){
		colorValue = (3*group).toString()+','+(3*group).toString()+','+(255-3*group).toString();
	}else if(group%6 == 4){
		colorValue = (255-3*group).toString()+','+(3*group).toString()+','+(255-3*group).toString();
	}else{
		colorValue = (3*group).toString()+','+(255-3*group).toString()+','+(3*group).toString();
	}
	return 'rgb('+colorValue+')';
}
//Check if a point from every group has been selected
function checkCompeteness(){
	for(var i = 0; i < pathArray.length; i++){
		if(groupTotal.indexOf(pathArray[i][2]) < 0){
			groupTotal.push(pathArray[i][2]);
		}
	}
	if(groupTotal.length >= groups){
		document.getElementsByClassName('enter')[0].style.display = 'inline';
	}else{
		document.getElementsByClassName('enter')[0].style.display = 'none';
	}
}
//Set the home page of the application
function setIndex(){
	if(localStorage.menuX && localStorage.menuY){
		menuX = JSON.parse(localStorage.menuX);
		menuY = JSON.parse(localStorage.menuY);
	}
	document.getElementsByClassName('menu')[0].style.marginTop = menuY;
	document.getElementsByClassName('menu')[0].style.marginLeft = menuX;
	document.getElementsByClassName('menu')[0].addEventListener('mousedown', startDrag);
	document.getElementsByClassName('menu')[0].addEventListener('mousemove', drag);
	document.getElementsByClassName('menu')[0].addEventListener('mouseup', endDrag);
	//Title element
	if(localStorage.titleX && localStorage.titleY){
		titleX = JSON.parse(localStorage.titleX);
		titleY = JSON.parse(localStorage.titleY);
	}
	document.getElementsByClassName('title')[0].style.marginTop = titleY;
	document.getElementsByClassName('title')[0].style.marginLeft = titleX;
	document.getElementsByClassName('title')[0].addEventListener('mousedown', startDrag);
	document.getElementsByClassName('title')[0].addEventListener('mousemove', drag);
	document.getElementsByClassName('title')[0].addEventListener('mouseup', endDrag);
	//Sign in and sign up module
	if(localStorage.loginX && localStorage.loginY){
		loginX = JSON.parse(localStorage.loginX);
		loginY = JSON.parse(localStorage.loginY);
	}
	document.getElementsByClassName('login')[0].style.marginTop = loginY;
	document.getElementsByClassName('login')[0].style.marginLeft = loginX;
	document.getElementsByClassName('login')[0].addEventListener('mousedown', startDrag);
	document.getElementsByClassName('login')[0].addEventListener('mousemove', drag);
	document.getElementsByClassName('login')[0].addEventListener('mouseup', endDrag);
	//Preferences menu
	if(localStorage.preferencesX && localStorage.preferencesY){
		preferencesX = JSON.parse(localStorage.preferencesX);
		preferencesY = JSON.parse(localStorage.preferencesY);
	}
	document.getElementsByClassName('preferences')[0].style.marginTop = preferencesY;
	document.getElementsByClassName('preferences')[0].style.marginLeft = preferencesX;
	document.getElementsByClassName('preferences')[0].addEventListener('mousedown', startDrag);
	document.getElementsByClassName('preferences')[0].addEventListener('mousemove', drag);
	document.getElementsByClassName('preferences')[0].addEventListener('mouseup', endDrag);
	//High score display
	if(localStorage.highscoreX && localStorage.highscoreY){
		highscoreX = JSON.parse(localStorage.highscoreX);
		highscoreY = JSON.parse(localStorage.highscoreY);
	}
	document.getElementsByClassName('highscore')[0].style.marginTop = highscoreY;
	document.getElementsByClassName('highscore')[0].style.marginLeft = highscoreX;
	document.getElementsByClassName('highscore')[0].addEventListener('mousedown', startDrag);
	document.getElementsByClassName('highscore')[0].addEventListener('mousemove', drag);
	document.getElementsByClassName('highscore')[0].addEventListener('mouseup', endDrag);
	//Change the color of every element
	if(localStorage.storeColor){
		var setColor = JSON.parse(localStorage.storeColor);
		highscoreColor = setColor;
		menuColor = setColor;
		loginColor = setColor;
		preferencesColor = setColor;
		titleColor = setColor;
	}
	document.getElementsByClassName('highscore')[0].style.backgroundColor = highscoreColor;
	document.getElementsByClassName('login')[0].style.backgroundColor = loginColor;
	document.getElementsByClassName('menu')[0].style.backgroundColor = menuColor;
	document.getElementsByClassName('preferences')[0].style.backgroundColor = preferencesColor;
	document.getElementsByClassName('title')[0].style.backgroundColor = titleColor;
	//Add a border to each element
	if(localStorage.storeBorder){
		var setBorder = JSON.parse(localStorage.storeBorder);
		document.getElementsByClassName('highscore')[0].style.border = setBorder;
		document.getElementsByClassName('login')[0].style.border = setBorder;
		document.getElementsByClassName('menu')[0].style.border = setBorder;
		document.getElementsByClassName('preferences')[0].style.border = setBorder;
		document.getElementsByClassName('title')[0].style.border = setBorder;
	}
	//Round the corners of each element
	if(localStorage.storeRadius){
		var setRadius = JSON.parse(localStorage.storeRadius);
		document.getElementsByClassName('highscore')[0].style.borderRadius = setRadius;
		document.getElementsByClassName('login')[0].style.borderRadius = setRadius;
		document.getElementsByClassName('menu')[0].style.borderRadius = setRadius;
		document.getElementsByClassName('preferences')[0].style.borderRadius = setRadius;
		document.getElementsByClassName('title')[0].style.borderRadius = setRadius;
	}
	//Change the text color of each element
	if(localStorage.storeText){
		var setText = JSON.parse(localStorage.storeText);
		document.getElementsByClassName('highscore')[0].style.color = setText;
		document.getElementsByClassName('login')[0].style.color = setText;
		document.getElementsByClassName('menu')[0].style.color = setText;
		document.getElementsByClassName('preferences')[0].style.color = setText;
		document.getElementsByClassName('title')[0].style.color = setText;
	}
	document.getElementsByTagName('body')[0].style.visibility = 'visible';
	//Add event listeners to each preferences menu element
	document.getElementsByClassName('green')[0].addEventListener('click', storeColor);
	document.getElementsByClassName('bordered')[0].addEventListener('click', storeBorder);
	document.getElementsByClassName('rounded')[0].addEventListener('click', storeRounded);
	document.getElementsByClassName('squared')[0].addEventListener('click', storeSquared);
	document.getElementsByClassName('bluetext')[0].addEventListener('click', storeText);
	document.getElementsByClassName('clear')[0].addEventListener('click', clearStorage);
}
//Store element color to browser
function storeColor(){
	localStorage.storeColor = JSON.stringify('rgba(0,250,0,0.75)');
	setIndex();
}
//Store element text color to browser
function storeText(){
	localStorage.storeText = JSON.stringify('rgba(150,150,250,1)');
	setIndex();
}
//Store element border status to browser
function storeBorder(){
	localStorage.storeBorder = JSON.stringify('4px solid rgba(150,150,250,0.85)');
	setIndex();
}
//Store rounded corner status to browser
function storeRounded(){
	localStorage.storeRadius = JSON.stringify('10px');
	setIndex();
}
//Store square corner status to browser
function storeSquared(){
	localStorage.storeRadius = JSON.stringify('0px');
	setIndex();
}
//Clear browser storage
function clearStorage(){
	localStorage.clear();
	setIndex();
}
//Start the dragging process
function startDrag(){
	dragX = event.clientX;
	dragY = event.clientY;
	dragging = true;
}
//Make each element Draggable
function drag(){
	if(dragging){
		positionY = parseFloat(this.style.marginTop.substr(0,this.style.marginTop.length-1));
		positionX = parseFloat(this.style.marginLeft.substr(0,this.style.marginLeft.length-1));
		positionX+=100*(event.clientX-dragX)/window.innerWidth;
		positionY+=100*(event.clientY-dragY)/window.innerWidth;
		this.style.marginTop = positionY+'%';
		this.style.marginLeft = positionX+'%';
		dragX = event.clientX;
		dragY = event.clientY;
	}
}
//End the dragging process
function endDrag(){
	dragging = false
	if(this.id == 'menu'){
		localStorage.menuY = JSON.stringify(this.style.marginTop);
		localStorage.menuX = JSON.stringify(this.style.marginLeft);
	}else if(this.id == 'title'){
		localStorage.titleY = JSON.stringify(this.style.marginTop);
		localStorage.titleX = JSON.stringify(this.style.marginLeft);
	}else if(this.id == 'login'){
		localStorage.loginY = JSON.stringify(this.style.marginTop);
		localStorage.loginX = JSON.stringify(this.style.marginLeft);
	}else if(this.id == 'preferences'){
		localStorage.preferencesY = JSON.stringify(this.style.marginTop);
		localStorage.preferencesX = JSON.stringify(this.style.marginLeft);
	}else if(this.id == 'highscore'){
		localStorage.highscoreY = JSON.stringify(this.style.marginTop);
		localStorage.highscoreX = JSON.stringify(this.style.marginLeft);
	}
}
//Update the position of all points if the window is resized
window.onresize = function(event){
	redrawPoints();
}

/*PROGRAM*/
drawPoints();
setIndex();