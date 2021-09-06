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

	// send data
	function sendFormData(name, phone, email, form) {
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
				testVal[row].obj.parent().addClass('-error');
				hasError = true;
			} else {
				testVal[row].obj.parent().removeClass('-error');
			}
		});

		if (hasError) {
			return false
		}

		var data = {
			title: name.val(),
			pipeline_id: 4,
			"8a83689a19ba3027695a8765bcd63dd9088c134c": name.val(),
			"bbf39d6f2aecc762d84617122a788d27a557f59e": phone.val(),
			"100da5cb123f497f3b2602d72b759bb5ab4b4b6f": email.val(),
		};

		console.log('data', data);

		// carrotquest.identify([
		// 	{op: 'update_or_create', key: '$phone', value: data.phone},
		// 	{op: 'update_or_create', key: '$name', value: data.name},
		// 	{op: 'update_or_create', key: '$email', value: data.email}
		// ]);

		$.ajax({
			type: 'POST',
			url: 'https://embily.pipedrive.com/api/v1/deals?api_token=7799e3d04b2eafb208d7bdc3ea0c1da7cfa8bf5a',
			data: JSON.stringify(data),
			dataType : 'json',
			contentType: 'application/json',
			success: function (response) {
				console.log(response);
			}
		});

		name.val('');
		phone.val('');
		email.val('');
	};

});
