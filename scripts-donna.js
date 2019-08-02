(function ($, root, undefined) {
	$(function () {
		$('.texto .btn').on('click', function() {
            $('#frame').fadeIn();
        });

        $('#frame').on('click', function(){
            $(this).fadeOut();
        })

	});
	
})(jQuery, this);