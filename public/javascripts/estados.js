var column = function(){

	/*
		Crea una instancia de Lobilist con todos sus datos
	 	y configuraciones
	 */
	var createLobilist = function(data){
		var objectJSON = JSON.parse(data[0].sp_getalljson);
		var myList = $('#kanban-board').lobiList({
				beforeListAdd1: function (lobilist, list) {
					var $dueDateInput = list.$el.find('form [name=dueDate]');
			        $dueDateInput.datepicker();
					/*Antes llamar a nextID*/
					$.get("rstatus/getNextID")
					.done(function(data) { 
						var newid = "c"+data[0].nextid;
						list.$el[0].id = newid;
		           		$.post("rstatus/insertList",{idlist: newid})
		           		.done(function() {
		           			order();
		           			hideProcess(newid);
		           		})
					})
		        },
		        afterItemDelete: function (item) {
		        	countItem();
		        },
		        afterItemAdd: function (item) {
		        	/*primero pasarle el id que va a tener*/
		        		var title = item[1].title;
		        		description = item[1].description;
		        		fecha = item[1].dueDate;
		        		idPosit = item[1].id;
		        		idStatus = item[0].$el[0].id;

		        		countItem();   			        	
		        },
		        afterListAdd: function(lobilist, list){
			        var $dueDateInput = list.$el.find('form [name=dueDate]');
			        $dueDateInput.datepicker();
			        column.countItem();
			    },
		        lists: objectJSON,
	    	});

			/*Llama a la función que cuenta y modifica
              la cantidad de item que hay en cada columna*/
            column.countItem();
            $(".loading").hide();
            $('input,form').attr('autocomplete','off');
            deleteSpan(); 
            getMaxItem();
            showTooltip();
            posit.hideDragHandler();
            app.confirmCalendar();
            posit.isfechawait();
            app.form_sin_enter();

            //console.log($('li[data-id="3"]').find(".drag-handler").hide());
	}
	/*
		Obtiene las columnas con sus posit desde la base y se
		lo pasa a la función "createLobilist"
		@params ninguno
	*/
	var getJSON = function(){
		$.get('rsesion/getSession', function(user){
	    	$.post("rstatus/getItemJSON",{user: user}, createLobilist)
		});
		
	}

	/*
		Edita el nombre de la columna
		@params1 id que es el id de la columna
		@params2 name que es el nombre de la columna
	*/
	var editHeader = function(id, name){
		$.post("rstatus/updateList", {idlist: id, titlist: name})
		.done(function(){
			console.log(id + " " + name);
		})
		
	}

	/*
		Edita el color de la columna
		@params1 id que es el id de la columna
		@params2 color que es el color de la columna
	*/
	var editColor = function(id, color){
		console.log(id);
		console.log(color);

		$.post("rstatus/editColor", {idlist: id, color:color})
		.done(function(){

		})
		.fail(function(){

		})
	}

	/*
		Cuenta cuantos items hay en cada Lista y edita 
		el span de cada una
	*/
	var countItem = function(){
		$(".lobilist-items").each(function(index) {
	        var listgetItem = "#" + $($(this)[0]).parents().eq(1).attr("id");
	        	cantItem = $(listgetItem +" ul>.nowait").size();

	       	$(listgetItem + " #countIt").text(cantItem+" de ")
		});
	}

	/*
		Asigna el maximo que puede tener cada columna.
		Los datos vienen desde la BD
	*/
	var getMaxItem = function(){
		$.get("rstatus/getMaxWIP", function() {
		})
		.done(function(data) {
			$(".lobilist-items").each(function(index) {
		        var listgetItem = "#" + $($(this)[0]).parents().eq(1).attr("id");
		       	$(listgetItem + " #maxItem").text(" "+data[index].wip)

			});
		})
	}

	/*
		Elimina los span de cantidad de item a la primera 
		y a la ultima lista
	*/
	var deleteSpan = function () {
		var firstID = '#' + $(".lobilist").eq(0).attr("id");
			lastIndex = $(".lobilist-wrapper").size();
			lastID = '#' + $(".lobilist").eq(lastIndex-1).attr("id");

			$(firstID).find(".cantItem").remove();
			$(lastID).find(".cantItem").remove();
	}

	/*
		Funcion que recorre las listas y obtiene el orden
	*/
	var order = function(idlist) {
		$(".lobilist-wrapper").each(function(index) {
			index++;
			$.post("rstatus/updateOrder", {order: index, list: $(this).children().attr("id")})
			.done(function(data){
			})
			
			//console.log("Orden: " + index + " Columna: " + $(this).children().attr("id"));
		});
	}

	/*
		Funcion que muestra cuando comienza un request Ajax
	*/
	var showProcess = function(idlist) {
		$("#"+idlist).find(".loading").show();
	}

	/*
		Funcion que oculta cuando Finaliza un request Ajax
	*/
	var hideProcess = function(idlist) {
		$("#"+idlist).find(".loading").hide();
	}

	/*
		Funcion que muestra los tooltips y oculta al segundo
	*/
	var showTooltip = function() {
		$('[data-title]').mouseenter(function(){
		    var that = $(this)
		    that.tooltip('show');
		    setTimeout(function(){
		        that.tooltip('hide');
		    }, 1000);
		});

		$('[data-title]').on("click", function(){
		    $('[data-title]').tooltip('hide');
		});
	}

	


	

	return{
		editHeader:editHeader,
		editColor:editColor,
		countItem:countItem,
		getJSON:getJSON,
		showProcess:showProcess,
		hideProcess:hideProcess,
		order:order
	}
}();