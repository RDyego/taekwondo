
$(document).ready(function() {
    $('select').material_select();
	$(".dropdown-button").dropdown({ hover: false });
	$('.modal-trigger').leanModal({
		dismissible: true, // Modal can be dismissed by clicking outside of the modal
		in_duration: 300, // Transition in duration
		out_duration: 200, // Transition out duration
	}).on('click', function () {
		var $myElementCliked = $(this);
		var $form = $($myElementCliked.attr('data-form'));
		var action = $myElementCliked.attr('data-action');
		$form.attr('action', action);
	});
});