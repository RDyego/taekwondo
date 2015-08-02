
$(document).ready(function () {
    $('select').material_select();
	$(".dropdown-button").dropdown({ hover: false });
	$('.datepicker').pickadate({
		// Strings and translations
		monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
			'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
		monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
			'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
		weekdaysFull: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
		weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
		// Buttons
		today: 'Hoje',
		clear: 'Limpar',
		close: 'Fechar',
		// Formats
		format: 'dd/mm/yyyy',
		selectMonths: true, // Creates a dropdown to control month
		selectYears: 70 // Creates a dropdown of 15 years to control year
	});
	$('.modal-trigger').leanModal({
		dismissible: true, // Modal can be dismissed by clicking outside of the modal
		in_duration: 300, // Transition in duration
		out_duration: 200, // Transition out duration
	}).on('click', function () {
		var $myElementCliked = $(this);
		var $form = $($myElementCliked.attr('data-form'));
		var $p = $($myElementCliked.attr('data-form') + ' p');
		var $h4 = $($myElementCliked.attr('data-form') + ' h4');
		var action = $myElementCliked.attr('data-action');
		var message = $myElementCliked.attr('data-message');
		var title = $myElementCliked.attr('data-title');
		$form.attr('action', action);
		$h4.text(title);
		$p.text(message);
	});
});