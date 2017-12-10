/*
Options.js
Version: 1.0
Author: Ryder Damen
ryderdamen.com/fresh-air

A modified version of the Main.js page, with highlighting and options functioanlity

*/

// Circle and Highlighting Functionality -------------------------------------------------------------------------------------

// Global Variables
var breathDuration = 3500;

var bar = new ProgressBar.Circle(circle, {
	  strokeWidth: 6,
	  easing: 'easeInOut',
	  duration: breathDuration,
	  color: '#4db6ac',
	  trailColor: '#eee',
	  trailWidth: 4,
	  svgStyle: null
	});
 
// Page Setup
doBreathing();


function doBreathing() {
	
	// First, disable clicking for the time being
	$('#circle').click(function(){return false;});

	// Inhale
	bar.animate(1.0);
	$('#repeat').css('color','#000');
	$('#inhale').css('color','#4db6ac');
	
	// Wait
	setTimeout(function(){
		// Then down to zero
		$('#inhale').css('color','#000');
		$('#hold').css('color','#4db6ac');
	}, breathDuration);
	
	// Wait & Exhale
	setTimeout(function(){
		// Then down to zero
		$('#hold').css('color','#000');
		$('#exhale').css('color','#4db6ac');
		bar.animate(0.0);
	}, breathDuration * 1.5);
	
	// On Breath Completion
	setTimeout(function(){
	// Restore clicking functionality
	$( "#circle" ).click(function() { doBreathing(); });
	$('#exhale').css('color','#000');
	$('#repeat').css('color','#4db6ac');
	}, breathDuration * 2.5);
		
}



// Options Functionality

// Lifecycle
onPageLoad();

// Listener for submit click (since no inline JS is allowed in chrome extensions)
document.addEventListener('DOMContentLoaded', function() {
    var submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function() {
        onSubmit();
    });
});


// Functions

function onPageLoad() {
	// When the page is loaded
	// Retrieve variables from storage and write them to the view
	chrome.storage.sync.get(
		[
			'fa_inhaleLength',
			'fa_holdLength',
			'fa_startAutomatically',
			'fa_circleColorHex',
		], function (stored) {
			
			// Handling Undefined Variables
			
			if (stored.fa_inhaleLength == undefined || stored.fa_inhaleLength == 0) {
				stored.fa_inhaleLength = 3.5;
			}
			
			if (stored.fa_holdLength == undefined || stored.fa_holdLength == 0) {
				stored.fa_holdLength = 2.5;
			}
			
			if (stored.fa_startAutomatically == undefined) {
				stored.fa_startAutomatically = 1; // Default to start automatically
			}
			
			if (stored.fa_circleColorHex == undefined || stored.fa_circleColorHex == "undefined") {
				stored.fa_circleColorHex = "#4db6ac";
			}
			
			// Setting them in the view
			document.getElementById("inhaleLength").value = stored.fa_inhaleLength;
			document.getElementById("holdLength").value = stored.fa_holdLength;
			document.getElementById("startAutomatically").checked = stored.fa_startAutomatically;
			document.getElementById("circleColorHex").value = stored.fa_circleColorHex;
	});
}

function goBack() { // DEPRECATED
	// Return to the previous window; should we save?
	window.history.back();
}

function onSubmit() {
	// When the submit button is pressed, write the preferences
	
	var inhaleLength = document.getElementById("inhaleLength").value;
	var holdLength = document.getElementById("holdLength").value;
	var startAutomatically = document.getElementById("startAutomatically").checked;
	var circleColorHex = document.getElementById("circleColorHex").value;
	
	writePreferences(inhaleLength, holdLength, startAutomatically, circleColorHex);
}

function writePreferences(inhaleLength, holdLength, startAutomatically, circleColorHex) {
	// Writes preferences to chrome's storage, and to a javascript temp file
		// Save to chrome sync'd storage
        chrome.storage.sync.set({
	        'fa_inhaleLength': inhaleLength,
	        'fa_holdLength': holdLength,
	        'fa_startAutomatically': startAutomatically,
	        'fa_circleColorHex': circleColorHex
	        }, function() {
		        // TODO, replace this with a toast or something
		        
		        
		        //$.notify("Hello World");
		        
		        $("#submitButton").notify("Got it! Saved!", "success");

		        
/*
		        var button = document.getElementById("submitButton");
		        var originalBackgroundColor = button.style.backgroundColor;
		        var originalTextColor = button.style.color;
		        button.style.backgroundColor = "#00FF7F";
		        button.style.color = "#FFF";
		        setTimeout(function(){ 
			        button.style.backgroundColor = originalBackgroundColor;
					button.style.color = originalTextColor;
			         }, 300);
*/
	        });	    
}

