var admin = function(){

	var initsEvents = function(){
		verifyUser();
	}
	
	/*Obtiene el usuario y verifica los permisos del mismo*/
    var verifyUser = function(){
    	$.get("../rsesion/getSesion")
    	.done(function(data){
    		$(".nameUser").text(data.user);
    		$(".info>p").text(data.name);
    		$(".img-circle").attr("src", data.image);
    		$(".user-image").attr("src", data.image);

    	});
    }

    /*
    	Obtiene los usurios y llena la tabla de usuarios en /admin/usuarios
    */
    var getUsers = function(){

    	$.get("../rsesion/getAllUser")
    	.done(function(data){
    		var num = 0;
    		for(i=0;i<data.length;i++){
    			num++;
			    $('#tblUsuarios>tbody').append('<tr id='+data[i].userid+'><td>'+ num +'</td><td>'+data[i].nombre+'</td><td>'+data[i].apellido+'</td><td>'+data[i].email+'</td><td>'+data[i].permiso+'</td><td><p data-toggle="tooltip" title="Editar"><button class="btn btn-primary btn-xs" data-title="Editar" data-toggle="modal" data-target="#edit" ><span class="glyphicon glyphicon-pencil"></span></button></p><p data-toggle="tooltip" title="Eliminar"><button class="btn btn-danger btn-xs" data-title="Delete" data-toggle="modal" data-target="#delete" ><span class="glyphicon glyphicon-trash"></span></button></p></td></tr>');
			    //$('#tblUsuarios>tbody>tr').attr("id", data[i].userid);

			}
			$("#tblUsuarios").DataTable();
			
    	});

    }

	return{
		initsEvents:initsEvents,
		getUsers:getUsers
	}
}();
admin.initsEvents();