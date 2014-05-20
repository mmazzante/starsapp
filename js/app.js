// SET URL SERVICE APP
var setUrl = "http://lnx.nablastudio.it/starsapp/";

var urlService = setUrl+"index.php/";
var homeScroll;
var detailScroll;
var selected_index = -1; //Index of the selected list item
var tbBookmark = localStorage.getItem("tbBookmark");//Retrieve the stored data
	tbBookmark = JSON.parse(tbBookmark); //Converts string to object
	if(tbBookmark == null){ //If there is no data, initialize an empty array
		tbBookmark = [];
	}
		
// GET HOME DATA		
function getRecipeHome(){
	$('#list-home').empty();
	var url = urlService+'service/get_list_home';
	getRequest(url, function(data) {
        var data = JSON.parse(data.responseText);         
        for (var i = 0; i < data.length; i++) {
			
			if(!data[i]['list_image']){
				var img = 'images/empty.jpg';
			}else{
				var img = 'upload/images/'+ data[i]['list_image'];   
			}

			$('#list-home').append('<li>'+
				'<a href="#detail" class="getDetail" data-transition="slide" rel="'+ data[i]['list_id'] +'">'+
					'<div class="home-container img-shadow">'+
					'<div class="title-menu">'+ data[i]['list_name'] +'</div>'+
					'<img src="images/bg_home_title.png" border="0" class="img-menu">'+
					'<img src="'+setUrl+''+ img +'" width="250px" height="200px" />'+
					'</div>'+
				'</a>'+
				'</li>');
			}
	});
}

// GET CATEGORY DATA	
function getRecipeCategory(){
	$('#list-category').empty();
	var url = urlService+'service/get_category';
	getRequest(url, function(data) {
        var data = JSON.parse(data.responseText);         
        for (var i = 0; i < data.length; i++) {
			
			if(!data[i]['category_image']){
				var img = 'images/empty.jpg';
			}else{
				var img = 'upload/category/'+ data[i]['category_image'];
			}
			
				$('#list-category').append('<li>'+
					'<a href="#list_all" data-transition="slide" class="getList" rel="'+data[i]['category_id']+'">'+
        				'<img border="0" height="80" src="'+setUrl+''+ img +'">'+
        				'<h2>'+ data[i]['category_name'] +'</h2>'+
        				'<p>'+ data[i]['category_desc'] +'</p>'+
						'<span class="ui-li-count">'+ data[i]['count'] +'</span>'+
					'</a>'+
    				'</li>').listview('refresh');
			}
	});
}

// GET LIST DATA	
function getRecipeList(id){
	
	$('#list-all').empty();
	var url = urlService+'service/get_list?id='+id;
	getRequest(url, function(data) {
        var data = JSON.parse(data.responseText);         
        for (var i = 0; i < data.length; i++) {
			
			if(!data[i]['list_image']){
				var img = 'images/empty.jpg';
			}else{
				var img = 'upload/images/'+ data[i]['list_image'];
			}
			
			$('#list-all').append('<li>'+
				'<a href="#detail" data-transition="slide" class="getDetail" rel="'+data[i]['list_id']+'">'+
        			'<img border="0" height="80" src="'+setUrl+''+ img +'">'+
        			'<h2>'+ data[i]['list_name'] +'</h2>'+
				'</a>'+
    			'</li>').listview('refresh');
			}
	});
}


// GET BOOKMARK DATA	
function getRecipeBookmark(){
	
	$('#list-bookmark').empty();
	for (var i in tbBookmark) {
		
		var cli = JSON.parse(tbBookmark[i]);
		var url = urlService+'service/get_bookmark?id='+cli.id;
		
		getRequest(url, function(data) {
       		var data = JSON.parse(data.responseText);
		         
       	 	for (var i = 0; i < data.length; i++) {
			
				if(!data[i]['list_image']){
					var img = 'images/empty.jpg';
				}else{
					var img = 'upload/images/'+ data[i]['list_image'];
				}
			
				$('#list-bookmark').append('<li>'+
					'<a href="#detail" data-transition="slide" class="getDetail" rel="'+data[i]['list_id']+'">'+
        				'<img border="0" height="80" src="'+setUrl+''+ img +'">'+
        				'<h2>'+ data[i]['list_name'] +'</h2>'+

					'</a>'+
    				'</li>').listview('refresh');
			}
		});
	}
}

// GET DETAIL DATA	
function getDetail(id){
	
	$('#btn-bookmark').attr("rel",id);
	
	var url = urlService+'service/get_detail?id='+id;
	getRequest(url, function(data) {
        var data = JSON.parse(data.responseText);         
        for (var i = 0; i < data.length; i++) {
			
			if(!data[i]['list_image']){
				var img = 'images/empty.jpg';
			}else{
				var img = 'upload/images/'+ data[i]['list_image'];
			}
			
			$('#btn-bookmarks').html('<img src="images/buttom.png" border="0" style="position:absolute; margin-top:-17px;">');
			$('#name').html(data[i]['list_name']);
			$('#image').html('<img src="'+setUrl+''+ img +'" width="250px" height="200px" />');
			$('#summary').html(data[i]['list_summary']);
			$('#ingredients').html(data[i]['list_ingredients']);
			$('#instruction').html(data[i]['list_instruction']);
		}
			
	});
}

// GET REQUEST DATA
function getRequest(url, callback) {
	$('.loading').show();
    var request;
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest(); // IE7+, Firefox, Chrome, Opera, Safari
    } else {
        request = new ActiveXObject("Microsoft.XMLHTTP"); // IE6, IE5
    }
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            callback(request);
			$('.loading').hide();
        }
    }
    request.open("GET", url, true);
    request.send();
}

// GET BUTTON METHODS
$(document).on('click', '.getList', function() {
	var id = $(this).attr('rel');
	getRecipeList(id);
});

$(document).on('click', '.getDetail', function() {
	var id = $(this).attr('rel');
	getDetail(id);
});

$(document).on('click', '#getBookmark', function() {
	getRecipeBookmark();
});

$(document).on('click', '#btn-bookmark', function() {
	
	var id = $(this).attr('rel');
	
 	for (var i in tbBookmark) {
		var cli = JSON.parse(tbBookmark[i]);
        if (cli.id === id) return;
    }
	
	var client = JSON.stringify({
		id : id
	});
		
	tbBookmark.push(client);
	localStorage.setItem("tbBookmark", JSON.stringify(tbBookmark)); 
	alert("The data was bookmark.");
	return true;
});		

// DETECT DIMENSIONS 
function jqUpdateSize(){
	vph = $(window).height() - 240;
    $('#verticalWrapper').css({'height': vph + 'px'});
	setTimeout(jqUpdateSize, 500);
	detailScroll.refresh();
}

$(document).ready(jqUpdateSize);    // When the page first loads
$(window).resize(jqUpdateSize);     // When the browser changes size


function loaded() {
	homeScroll = new iScroll('horizontalWrapper');
	detailScroll = new iScroll('verticalWrapper');
}

document.addEventListener('DOMContentLoaded', loaded, false);

//LOAD DATA
getRecipeHome();
getRecipeCategory();