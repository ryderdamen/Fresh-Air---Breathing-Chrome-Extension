/*
Main.js
Version: 1.0.1
Author: Ryder Damen
ryderdamen.com/fresh-air

*/

// Global Variables
var showDate = false;

// Page Lifecycle -------------------------------------------------------------------------------------
initializePage();



	


// Functions -------------------------------------------------------------------------------------
function initializePage() {
	// First, get things from storage
	chrome.storage.sync.get(
	[	'fa_inhaleLength',
		'fa_holdLength',
		'fa_startAutomatically',
		'fa_circleColorHex',
		'fa_showDate'
	], function (stored) {
		
		if (stored.fa_inhaleLength === undefined) {
			// This is our first time loading, set default variables
			stored.fa_inhaleLength = 3.5;
			stored.fa_holdLength = 2.5;
			stored.fa_startAutomatically = 1;
			stored.fa_circleColorHex = "#4db6ac";
			stored.fa_showDate = false;
		}
		
		if (stored.fa_circleColorHex == "") {
			stored.fa_circleColorHex = "#4db6ac";
		}
		
		// If show date is enabled, enable it as a global var
		if (stored.fa_showDate) { window.showDate = true; }
		
		// Next, set up the circle bar
		var bar = new ProgressBar.Circle(circle, {
			strokeWidth: 6,
			easing: 'easeInOut',
			duration: stored.fa_inhaleLength * 1000,
			color: stored.fa_circleColorHex,
			trailColor: '#eee',
			trailWidth: 4,
			svgStyle: null
		});
		
		// Set Up the Date
		setupDate();
		
		// Finally, breath if it's automatically set
		if (stored.fa_startAutomatically) {
			doBreathing(bar, stored.fa_inhaleLength, stored.fa_holdLength, true);
		}
		else {
			// Or, Set up clicking so that it's ready to go for the user
			$( "#circle" ).click(function() { doBreathing(bar, stored.fa_inhaleLength, stored.fa_holdLength, true); });
		}
		
	});
	
}

function setupDate() {
	var d = new Date();
	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var months = ["January","February","March","April","May","June","July","August","September","October","November","December" ];
	document.getElementById("text").innerHTML = days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
}


function doBreathing(bar, breathLength, holdLength, firstTime) {
	
	// First, disable clicking for the time being
	$('#circle').click(function(){return false;});
	$('#circle').off('click');

	// Inhale
	bar.animate(1.0);
	
	// Wait & Exhale
	setTimeout(function(){
		// Then down to zero
		bar.animate(0.0);
	}, (breathLength * 1000) + (holdLength * 1000));
	
	// On Breath Completion
	setTimeout(function(){
		// Restore clicking functionality
		$( "#circle" ).click(function() { doBreathing(bar, breathLength, holdLength, false); });
		
		if (firstTime && window.showDate) {
			
			$( "#inner" ).animate({
				top: '45%'
				}, 1800, function() {
					// animation complete
				});
			
			$( "#text" ).animate({
				top: '57%',
				opacity: 1
				}, 2000, function() {
					// animation complete
				});

			
		}
		
	}, (breathLength * 1000 * 2) + (holdLength * 1000));
	
		
}
