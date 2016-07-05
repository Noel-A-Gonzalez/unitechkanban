var posit = function(){
	
	/*
		Pasa los posit de una columna a otra en escalera
		@params indexOrigen indice de la lista desde donde se movió el item
		@params indexDest indice de la lista que recibe el item
	*/
	var updateState = function(indexOrigen, indexDest){
		if (indexDest > indexOrigen) {
            $($(".lobilist-items").get().reverse()).each(function(index){
                idList = $(this).parents().eq(2).index()+1;

                if (indexOrigen > idList) {
                    
                    var indice = $($(this)[0]).parents().eq(2).index(); /*Posición actual*/
                    var listgetItem = $($(this)[0]).parents().eq(1).attr("id");
                    var nextList = $(".lobilist").eq(indice+1).attr("id");
                    var item = $("#" + listgetItem).find(".lobilist-items>.nowait").get(0);
                    column.showProcess(nextList);
                    $.post("ritem/updateStatus", {positID: $(item).data("id"), listID: nextList})
                    .done(function(){
                        column.hideProcess(nextList);
                        $("#" + nextList).find("ul").append(item).find("li:last").hide().fadeIn(700).effect("bounce");
                        column.countItem();  
                    })
                    .fail(function(){
                        column.hideProcess(nextList);
                        Lobibox.alert("info",{
                            title: "Información",
                            msg: "Lo sentimos, algo salió mál.."
                        }); 
                    })
                };
            }); 
             
        }else{
            var cantList = $(".lobilist-wrapper").size();

            $(".lobilist-items").each(function(index) {

            	var idList = $(this).parents().eq(2).index()+1;//Indice de la lista
                    
                if (indexOrigen < idList && cantList > idList) {
                    
                    var indice = $($(this)[0]).parents().eq(2).index(); /*Posición actual*/
                    var listgetItem = $($(this)[0]).parents().eq(1).attr("id");
                    var nextList = $(".lobilist").eq(indice-1).attr("id");
                    var item = $("#" + listgetItem).find(".lobilist-items>.nowait").get(0);
                    column.showProcess(nextList);
                    $.post("ritem/updateStatus", {positID: $(item).data("id"), listID: nextList})
                    .done(function(){
                        column.hideProcess(nextList);
                        $("#" + nextList).find("ul").append(item).find("li:last").hide().fadeIn(700).effect("bounce");
                        column.countItem(); 
                    })
                    .fail(function(){
                        column.hideProcess(nextList);
                        Lobibox.alert("info",{
                            title: "Información",
                            msg: "Lo sentimos, algo salió mál.."
                        }); 
                    })
                };
            });
            /*Llama a la función que cuenta y modifica
              la cantidad de item que hay en cada columna*/
            column.countItem(); 
        }
	}

    /*
    * Funcion que edita la cantidad de Posit que puede tener una columna
    */
    var editWIP = function(idList) {
        Lobibox.prompt('number', {
            title: 'Máximo de Posit',
            attrs: { 
                placeholder: "WIP",
                min: 1,
                max: 10
            },
            errorMessage: 'El campo es requerido',
            buttons: {
                ok: {
                    'class': 'lobibox-btn lobibox-btn-default',
                    text: 'OK',
                    closeOnClick: true
                },
            },
            callback: function(box, btn){
                var value = box.getValue();
                    cantItemAct = $("#" + idList + " #countIt").text();
                    valueActItem = parseInt(cantItemAct.charAt(0), 8);
                if (btn == 'ok' && value != ""){
                    if (valueActItem <= value) {
                        $.post("rstatus/editWIP", {idlist: idList, wip: value})
                        .done(function(){
                            $("#" + idList + " #maxItem").text(value);
                        })
                        .fail(function(){
                            Lobibox.alert("error",{
                                title: "ERROR",
                                msg: "Ha ocurrido un error.."
                            }); 
                        })
                        //console.log(idList);
                    }else{
                        Lobibox.alert("info",{
                            title: "Información",
                            msg: "El valor ingresado es menor que la cantidad de Posit existentes.."
                        }); 
                    }
                    
                }
            }
        })
    }

    /*
        Funcion que obtiene la url del callback del calendar y redirecciona
        - Envia datos para agregar un evento a la api google calendar
    */
    var getUrlCalendar = function(){
        var date = '2016-06-28';
            due = '2016-06-28';
            dueDate = new Date(due);
        //var fechaCalendar = dueDate.replace(/\//g, '-');
            $.get("/auth/calendar", {positId:161, fechaNormal:date, fecha:dueDate, titleEvent:'title', descriptEvent:'description'}, function(data){
                if (data){
                    window.location.href = data;
                    console.log(data);
                    return true;
                }else{
                    Lobibox.alert("error",{
                        title: "ERROR",
                        msg: "Hubo un error al intentar conectar con Google Calendar. Verifique su conexión..."
                    }); 
                    return false;
                }
            });
    }


    /*
    * Funciona que convierte la fecha DD-MM-YYYY
    */
    var convertDate = function(date) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(date);
        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-');
    }

    /*
    * Funciona que convierte la fecha DD-MM-YYYY
    */
    var convertDateCalendar = function(date) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(date);
        return [pad(d.getFullYear()), pad(d.getMonth()+1), d.getDate()].join('-');
    }

   /* var dateHoy = function() {
        Number.prototype.padLeft = function(base,chr){
            var  len = (String(base || 10).length - String(this).length)+1;
            return len > 0? new Array(len).join(chr || '0')+this : this;
        }

        var d = new Date;
        dformat = [ (d.getMonth()+1).padLeft(),
        d.getDate().padLeft(),
        d.getFullYear()].join('-');
        var datetime = new Date(dformat);
        return datetime;
    }*/

    /*
    * Funcion que pone en gris el Posit que está en espera
    */
    var hideDragHandler = function() {
        $("ul li .lobilist-item-duedate").each(function(index, val){
            var idItem = $(this).parent().data("id");
            //$('li[data-id="'+idItem+'"]').find(".drag-handler").hide();
            $('li[data-id="'+idItem+'"]').addClass("positWait").removeClass("nowait");
            //$('li[data-id="'+idItem+'"] .todo-actions .edit-todo').hide();
        });
        //$('li[data-id="'+itemID+'"]').find(".drag-handler").hide();
    }

    /*
        Función que controla cuando la fecha del recordatorio de un Posit
        es igual a la fecha de ingreso al sistema. Si es igual lleva el Posit
        a la primera columna y pone como una tarea común
    */
    var isfechawait = function(){
        var datehoy = new Date();
            fecha = moment(datehoy).format('DD-MM-YYYY');
            idList = $(".lobilist-wrapper").children().eq(0).attr('id'); //ID de la primera columna

        $("ul li .lobilist-item-duedate").each(function(index, val){
            var fechaPosit = $(this).text();
            if (fecha === fechaPosit) {
                var idItem = $(this).parent().data("id");
                    posit = $(this).parent();

                $.post("ritem/deleteFecWait", {itemID: idItem, list: idList})
                .done(function(){
                    // $('li[data-id="'+idItem+'"]').find(".drag-handler").show();
                    $('li[data-id="'+idItem+'"]').addClass("nowait").removeClass("positWait");
                    //$('li[data-id="'+idItem+'"] .todo-actions .edit-todo').show();
                    
                    $("#" + idList).find("ul").append(posit).find("li:last").hide().fadeIn(700).effect("bounce");
                    $("#" + idList).find(".lobilist-item-duedate").remove();

                    Lobibox.notify('success', {
                        continueDelayOnInactiveTab: true,
                        title: 'Recordatorio',
                        msg: 'Vea su calendario, hoy tiene un compromiso..',
                        soundPath: 'bower_components/lobibox/sounds/',
                        sound: "sound4",
                    });
                })
            }
        });
    }
	
	return{
		updateState:updateState,
        editWIP:editWIP,
        getUrlCalendar:getUrlCalendar,
        convertDate:convertDate,
        //dateHoy:dateHoy,
        convertDateCalendar:convertDateCalendar,
        hideDragHandler:hideDragHandler,
        isfechawait:isfechawait
	}
}();