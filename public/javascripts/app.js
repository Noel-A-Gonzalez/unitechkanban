/*
	##APP
	FUNCION PRINCIPAL DONDE BASICAMENTE SE DEBEN TRATAR LAS 
	FUNCIONES PRINCIPALES DE TODO EL SISTEMA

*/

var app = function(){
	/*Funcion que inicia los eventos*/
	var initEvents = function(){
		$( document ).ready(function() {
			/*Ocultar boton guardar*/
			$("#guardar_btn").css('display', 'none');
			$("#loading").hide();


			/*CALL FUNCTIONS*/
			directory.getNodes();
			deleteTextLicence();
			deleteSeparadorEditor();
			directory.insertText();
			directory.editarButtom();
			//directory.selectedNode();
		});
	}

	/*Elimina un div que separa los botones y los manda abajo*/
	var deleteSeparadorEditor = function(){
		$('div').each(function(index) {
			var style = $(this).attr('class');
			if(style == 'fr-separator fr-hs'){
				console.log($(this));
			  	$(this).remove();
			}
		});
	}

	/*Elimina el texto de que la licencia no es la original*/
	var deleteTextLicence = function(){
		$('div>a').each(function(index) {
			var style = $(this).attr('href');
			if(style == 'https://froala.com/wysiwyg-editor'){
			  	$(this).remove();
			}
		});
	}
	
	return{
		initEvents:initEvents,
	}
}();
app.initEvents();