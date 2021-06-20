$(document).ready(function(){

	//menu mob
	$('.header-bar').on('click', function(){
		$('body').toggleClass('header-active');
	});

	//tab
	$('.drop-text').on('click', function(e){
		e.preventDefault();

		$(this).parents('.drop').toggleClass('drop-active');
		if($(this).parents('.drop').hasClass('drop-menu')){
			$(this).parents('.drop').find('.drop-list').slideToggle();
		}
	});

	$(document).on('click', function (e){
		var block = $(".drop");
		if (!block.is(e.target) && block.has(e.target).length === 0)
			$('.drop').removeClass('active');
	});

	$('input').focus(function(){
	  $(this).parents('.form-group').addClass('focused');
	});

	$('input').blur(function(){
	  var inputValue = $(this).val();
	  if ( inputValue == "" ) {
	    $(this).removeClass('filled');
	    $(this).parents('.form-group').removeClass('focused');  
	  } else {
	    $(this).addClass('filled');
	  }
	})  

});