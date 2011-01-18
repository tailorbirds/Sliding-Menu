$(function(){
	sliding_menu();
	
	$(".selectable").live("click", on_select);
})

function on_select(){
	$(".selected").removeClass("selected");
	$(this).addClass("selected");
}

var sliding_menu_selector = ".sliding_menu"
var animation_duration = 300;
var default_viewport_width = 200;
function sliding_menu(){
	sliding_menu = $(sliding_menu_selector);

	viewport = $("<div class=viewport>");
	moving_container = $("<div class=moving_container>");

	viewport.append(moving_container);

	viewport.width( viewport_width() + "px" );
	$( sliding_menu_selector+", "+sliding_menu_selector+" ul, "+sliding_menu_selector+" ol").width( viewport_width() + "px" );

	sliding_menu.wrap(viewport);

	sliding_menu.children().each(function(index){ set_ids($(this),index) });
	sliding_menu.children().find("li").each(function(index){ set_ids($(this),index) });

	$(".moving_container li").each(add_selectable);

	sliding_menu.find("ul, ol").appendTo($('.moving_container'));

	$(".moving_container").children(":not("+sliding_menu_selector+")").hide();

	$("[data-sliding-parent-id]").each(add_header);

	$(".moving_container li:not(.selectable)").click(slide_moving_container_right);

	$(".moving_container .back").click(slide_moving_container_left);
}

function slide_moving_container_right(){
	parent_id = $(this).attr("data-sliding-id");
	$("[data-sliding-parent-id='"+parent_id+"']").show();	
	slide_moving_container("right", $(this));
};

function slide_moving_container_left(){
	slide_moving_container("left", $(this));
};

var moving = false;
function slide_moving_container(direction, clicked_element){	
	if(direction == "right")
		distance = - viewport_width();
	else distance = viewport_width();
	
	if(!moving){
    moving = true;
    $(".moving_container").animate( { left: '+=' + distance }, animation_duration, 'easeOutCirc', function(){
      moving = false
			if(direction == "left"){
				clicked_element.parents("ul").hide();
			}
    });
  }
};

function viewport_width(){
	return $(sliding_menu_selector).attr("data-width") || default_viewport_width;
}

function set_ids(element, index){
	parent = element.parents("li");
	if(!is_empty(parent)){
		data_id = parent.attr("data-sliding-id") + "[" + index + "]";
		element.attr("data-sliding-id",data_id);
		element.parent().attr("data-sliding-parent-id", parent.attr("data-sliding-id"));
	}
	else {
		data_id = "[" + index + "]";
		element.attr("data-sliding-id",data_id);
	}
}

function add_selectable(){
	parent = $(this);
	child = parent.find("li");
	if(is_empty(child)){
		parent.addClass("selectable");
	}
}

function add_header(){
	ul_element = $(this);
	parent = $("[data-sliding-id='"+ul_element.attr("data-sliding-parent-id")+"']");
	
	heading = $("<div class='heading' />");	
	title = $("<h1>" + parent.html() + "</h1>");
	back = $("<div class='back' />")
	
	heading.append(title).append(back);
	
	ul_element.prepend(heading);
}

function is_empty(element){
	return element.length == 0;
}