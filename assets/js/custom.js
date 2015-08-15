$(document).ready(function () {
	function filterBy () {
		io.socket.get('/athlete/test?where={"name":{"contains":"Dyego"}}', function (purchases) {
			console.log(purchases);
		});
	}
	
	$('.collapsible-header').on('click', function() {
		var $myFilter = $(this);
		var $myHidden = $($myFilter.next().find('input:hidden'));		
		var isOpen = $myFilter.hasClass('active');
		$myHidden.val('false');
		var thA = $('th a');
		if(isOpen){
			$myHidden.val('true');
			if(thA.attr('href')){
				thA.attr('href',thA.attr('href').replace('&filterIsOpen=false','&filterIsOpen=true'));
			}
		}else{
			if(thA.attr('href')){
				thA.attr('href',thA.attr('href').replace('&filterIsOpen=true','&filterIsOpen=false'));
			}
		}
	});
	
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
		selectYears: 200 // Creates a dropdown of 15 years to control year
	});
	$('.modal-trigger').leanModal({
		dismissible: true, // Modal can be dismissed by clicking outside of the modal
		in_duration: 600, // Transition in duration
		out_duration: 200, // Transition out duration
	}).on('click', function () {
		var $myElementCliked = $(this);
		var $form = $($myElementCliked.attr('data-form'));
		var $p = $($myElementCliked.attr('data-form') + ' p');
		var $h4 = $($myElementCliked.attr('data-form') + ' h4');
		var $button = $($myElementCliked.attr('data-form') + ' button');
		var action = $myElementCliked.attr('data-action');
		var message = $myElementCliked.attr('data-message');
		var title = $myElementCliked.attr('data-title');
		var button = $myElementCliked.attr('data-button');
		$form.attr('action', action);
		$h4.text(title);
		$p.text(message);
		$button.text(button);
	});

	$('.modal-trigger-card').leanModal({
		dismissible: true, // Modal can be dismissed by clicking outside of the modal
		in_duration: 600, // Transition in duration
		ready: function () {
			var $divCard = $('#cardAthlete');
			var $download = $('#downloadCardAthlete');
			html2canvas($divCard).then(function (canvas) {
				$download.attr('href', canvas.toDataURL());
				//$download.attr('download', "CarteiraTeste");
			});
		},
    }).on('click', function () {
		
		var $myElementCliked = $(this);
		
		if($myElementCliked.attr('data-form') == '#formBaseAthlete'){
			var $form = $($myElementCliked.attr('data-form'));
			var $p = $($myElementCliked.attr('data-form') + ' p');
			var $h4 = $($myElementCliked.attr('data-form') + ' h4');
			var $button = $($myElementCliked.attr('data-form') + ' button');
			var action = $myElementCliked.attr('data-action');
			var message = $myElementCliked.attr('data-message');
			var title = $myElementCliked.attr('data-title');
			var button = $myElementCliked.attr('data-button');
			$form.attr('action', action);
			$h4.text(title);
			$p.text(message);
			$button.text(button);
		}
		else{
			var $divCard = $('#cardAthlete');
			
			var urlColorCard = $('#urlColorCard').val();
			var urlBlackCard = $('#urlBlackCard').val();
			var urlbackGroundImage = "url("+urlColorCard+")";
			
			var $imgPhoto = $('#athleteCardPhoto');
			var $pGraduation = $('#athleteCardGraduation');
			var $pName = $('#athleteCardName');
			var $pAcademy = $('#athleteCardAcademy');
			var $pDateStarted = $('#athleteCardDateStarted');
			var $pRegisterNumber = $('#athleteCardRegisterNumber');
			var $pValidity = $('#athleteCardValidity');
			
			var $pBloodGroup = $('#athleteCardBloodGroup');
			var $pRHFactor = $('#athleteCardRHFactor');
			var $pNaturalness = $('#athleteCardNaturalness');
			var $pBday = $('#athleteCardBday');
			
			$imgPhoto.attr('src',($myElementCliked.attr('data-athlete-photo')));
			$pGraduation.text($myElementCliked.attr('data-athlete-graduation'));
			$pName.text($myElementCliked.attr('data-athlete-name'));
			$pAcademy.text($myElementCliked.attr('data-athlete-academy'));
			$pDateStarted.text($myElementCliked.attr('data-athlete-date-started'));
			$pValidity.text($myElementCliked.attr('data-athlete-validity'));
			$pRegisterNumber.text($myElementCliked.attr('data-athlete-register-number'));
			
			$pBloodGroup.text($myElementCliked.attr('data-athlete-blood-group'));
			$pRHFactor.text($myElementCliked.attr('data-athlete-rh-factor'));
			$pNaturalness.text($myElementCliked.attr('data-athlete-naturalness'));
			$pBday.text($myElementCliked.attr('data-athlete-bday'));
			
			var isBlackBelt = $pGraduation.text().indexOf('Dan') != -1;
			if(isBlackBelt){
				urlbackGroundImage = "url("+urlBlackCard+")";
			}
			$divCard.css('background-image', urlbackGroundImage);
			
			
			var $download = $('#downloadCardAthlete');
			$download.attr('download', "Carteira " + $pName.text().replace('.',''));
		}
	});
});