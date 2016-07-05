var app = function(){

	/* Función que inicia todos los eventos que se cargan 
		al terminar de cargar la página
	*/
	var initEvent = function(){
		
		$(document).ready(function() {
			/*Renderizar pagina full*/
			var fullHeight = $(window).height() - $(".header").outerHeight() - $(".title-board").outerHeight();
			$(".container-full").height(fullHeight);

			/*metodos*/
			getUser();
			column.getJSON();
			moment.locale();			
		
		});
	}

	var getUser = function(){
		$.get('rsesion/getSession', function(user){
	    	$("#nameUser").text(user);
		});
	}

	/*Cuando vuelve del callback, si acepta la peticion de acceso
		- pone un alerta confirmando
		- llama a positInWait del module posit(post-it.js)*/
	var confirmCalendar = function(){
		$.get('/confirmCalendar', function(data){
			var fechaWait = new Date(data.fecha)
				fecha = moment(data.fecha, 'YYYY.MM.DD').format('DD/MM/YYYY');

			if(data){
				if (data.link) {
					Lobibox.alert("success",{
						title: "Éxito",
						msg: "Se ha registrado un nuevo evento en su calendario el " + fecha
					});
				}else{
					$.post("ritem/deleteFecha", {item: data.id}, function(){
	                })
	                .done(function(red){
	                	$('li[data-id="'+data.id+'"]').find(".drag-handler").show();
            			$('li[data-id="'+data.id+'"]').addClass("nowait").removeClass("positWait");
            			$('li[data-id="'+data.id+'"] .todo-actions .edit-todo').show();
            			$('li[data-id="'+data.id+'"] .lobilist-item-duedate').remove();
            			column.countItem();
            			Lobibox.alert("error",{
                            title: "ERROR",
                            msg: "Hubo un error al intentar conectar con Google Calendar. Verifique su conexión..."
                        }); 
	                })	
				}
				

		    }
		    	
		});
	}

	/* 
		Suprimir el uso de la tecla ENTER en Textarea
	*/
	var form_sin_enter = function($char, $mozChar){
	   	$('input').keypress(function(e){   
		    if(e == 13){
		      return false;
		    }
	  	});

		$('textarea').keypress(function(e){
		    if(e.which == 13){
		      return false;
		    }
		});
	}

	return{
		initEvent:initEvent,
		confirmCalendar:confirmCalendar,
		form_sin_enter:form_sin_enter,

	}

}();
app.initEvent();