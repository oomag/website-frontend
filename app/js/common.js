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

	// on submit form
	$('#callToAction').submit(function (event) {
		event.preventDefault();

		var form = this;
		var name = $(form).find('#i-1');
		var phone = $(form).find('#i-2');
		var email = $(form).find('#i-3');

		sendFormData(name, phone, email, form);
	});

	function sendFormData(name, phone, email) {
		var ok = validateForm(name, phone, email)
		if (!ok) {
			return false
		}

		var data = { name: name.val(), phone: phone.val(), email: email.val() }

		console.log('Sending form data: ', name, phone, email)

		$.ajax({
			type: 'POST',
			url: 'http://172.17.0.2:11000/contact-us',
			data: JSON.stringify(data),
			dataType : 'json',
			contentType: 'application/json',
			success: function (response) {
				console.log(response);
			}
		});
	}

	function validateForm(name, phone, email) {
		var testVal = {
			name: {
				obj: name,
				val: !!name.val()
			},
			phone: {
				obj: phone,
				val: !!phone.val()
			},
			email: {
				obj: email,
				val: !!email.val()
			}
		};

		var hasError = false;

		Object.keys(testVal).forEach(function (row) {
			if (!testVal[row].val) {
				console.log(testVal[row],' error ')
				testVal[row].obj.parent().addClass('-error');
				hasError = true;
			} else {
				console.log(testVal[row],' ok, removing ')
				testVal[row].obj.parent().removeClass('-error');
			}
		});

		return !hasError
	}
});
