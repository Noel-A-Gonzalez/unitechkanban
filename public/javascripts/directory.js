/*
	##DIRECTORY
	REALIZA TODAS LAS OPERACIONES QUE SE REALIZAN SOBRE LOS NODOS

*/

var directory = function(){
	var newVal;
	var nodoSelected;

	/*Crea una instancia de la libreria de jstree
	 con todas sus configuraciones*/
	var createInstance = function(dataNode){
		$.jstree.defaults.core.themes.variant = "large";
		$('#container_directory').jstree({
			"plugins" : [ "contextmenu", "json_data", "dnd", "search", "types"],
			"contextmenu":{
                    "items": function () {
                        return {
                            "Create": {
                                "label": "Nuevo",
                                "action": function (data) {
	                                    var ref = $.jstree.reference(data.reference);
	                                    	obj = ref.get_node(data.reference);
	                                        sel = ref.get_selected();
	                                    if(!sel.length) { return false; }
	                                    if(sel) {
	                                    	createNode(obj.id, "Nuevo", "last");
	                                    }
                                }
                            },
                            "Rename": {
                                "label": "Editar",
                                "icon": "fa fa-pencil",
                                "action": function (data, value) {
                                    var inst = $.jstree.reference(data.reference);
                                        obj = inst.get_node(data.reference);
                                        $('#container_directory').jstree(true).edit(obj.id);
                                        $("#"+obj.id).find(".jstree-rename-input").change(function(){
											 newVal1 = $(this).val(); //nuevo valor
											 getText(obj.id, newVal1);
										});
										
                                }
                            },
                            "Delete": {
                                "label": "Eliminar",
                                "icon":"fa fa-trash-o",
                                "action": function (data) {
                                    var ref = $.jstree.reference(data.reference),
                                    	obj = ref.get_node(data.reference);
                                        id = ref.get_selected();
                                        this.newVal = obj.id;
                                    if(!id.length) { return false; }
                                    deleteNode(obj.id, ref);
                                }
                            }
                        }
                    }
                },
		   'core' : {
			    "check_callback" : true,
			    "data" : dataNode,
			},
		})
		/*Funcion que al cargar los nodos abre todos sus directorios*/
		.bind('loaded.jstree', function(event, data) {
        	data.instance.open_all();  
    	})
    	/*Caputura que nodos se movieron y en qué orden se encuentra*/
		.bind("move_node.jstree", function (e, data) {
			var treeData = $('#container_directory').jstree(true).get_json('#', {flat:true})
			var jsonData = JSON.stringify(treeData);
			//updateOrdenNodo(treeData);
		})
    	/*Obtiene el ID del nodo que fue seleccionado para realizar alguna operacion*/
    	.on('changed.jstree', function (e, data) {
		    var i, j, r = [];
		    for(i = 0, j = data.selected.length; i < j; i++) {
		      r.push(data.instance.get_node(data.selected[i]).id);
		    }
		    this.nodoSelected = r.join(', ');
		    getTextEditor(this.nodoSelected);
		  }).jstree();
	}

		/*Funcio que permite buscar los nodos al escribir el nombre en el input*/
		var to = false;
  		$('#plugins4_q').keyup(function () {
    		if(to) { clearTimeout(to); }
    			to = setTimeout(function () {
      			var v = $('#plugins4_q').val();
      			$('#container_directory').jstree(true).search(v);
    		}, 250);
  		});

/*############ FUNCIONES #############*/
	/*Funcion que retorna los nodos de la base de datos
		y los datos se la pasa a la instancia para que se cree*/
	var getNodes = function() { 
		$.get("rdatos/getNodos", createInstance);
	}

	/*Funcion que retorna el texto que ingresa cuando se modifica el nombre del nodo*/
	var getText = function(id, newValue){
		$("#loading").show();
		$.post("rdatos/editarName", {id:id, text:newValue}, function(res){
				if (res === 'success') {
					$("#loading").hide();
				};
			});
	}

	/*Función que crea un nodo en el directorio*/
	var createNode = function(parent_node, new_node_text, position) {
		$("#loading").show();
		$.get("rdatos/getNewId", function(dato){
			var newid = dato[0].nextval;
			$.post("rdatos/crearNodo", {id:newid, parents:parent_node, text:new_node_text}, function(res){
				if (res === 'success') {
					$("#loading").hide();
					$('#container_directory').jstree('create_node', $("#"+parent_node), { "text":new_node_text, /*"state":{"disabled":true},*/  "icon":"fa fa-book" , "id":newid }, position, false, false);	
				};
			});
		});
	}

	/*Función que elimina un nodo en el directorio*/
	var deleteNode = function(id, ref){
		bootbox.confirm({ 
			title: "Confirmación requerida",
			message: "¿ Está seguro que desea eliminar este Nodo ?",
			buttons: {
			    cancel: {
			        label: "No",
			    },
			    confirm: {
			        label: "Si, seguro",
			        className: "btn-danger",
			    }
			},
			callback: function(result){ 
			    if (result === true){
			    	if (id === '1') {
			    		bootbox.alert("No se puede eliminar el nodo Root");
			    	}else{
			    		$("#loading").show();
			    		$.post("rdatos/deleteNode", {id: id}, function(res){
			    			$("#loading").hide();
				    		if (res === 'success') {
				    			ref.delete_node(id);
				    		}else{
				    			bootbox.alert("No se puede eliminar un nodo padre!");
				    		}
				    	});
			    	}
			    }    
			}
		});
	}

	/*Recibe le ID del nodo para traer el texto del mismo en el editor*/
	var getTextEditor = function(id){
		$("#loading").show();
		$.post("rdatos/getTextBlob",{id: id}, function(data,res){
			if (res === 'success') {
				$("#loading").hide();
				$("div>.fr-view").html(data[0].campo);
				$("#ipt_tit").val(data[0].titulo);
				$("#ipt_descr").val(data[0].descr);
				$('span').each(function(index) {
					var style = $(this).attr('class');
					if(style == 'fr-placeholder'){
			  			$(this).css('display', 'none');
					}
				});
			};
		});
	}

	/*Captura los datos del editor y los envia a la base de datos*/
	var insertText = function(){
		var texto = $('#edit').val();
		var noSelecciono = 0;
		$('.jstree-children>li').each(function(index) {
			var style = $(this).attr("aria-selected");
			if(style === 'true'){
				var idNodo = $(this).attr('id')
				if (idNodo != 1) {
					$("#loading").show();
					$.post("rdatos/insertarTexto",{texto:texto, id: idNodo}, function(data,res){
						if (res === 'success') {
							$("#loading").hide();
							bootbox.alert("Se ha guardado exitosamente el texto");
						}
					});
				}else{
					bootbox.alert("Por favor, inserte un texto antes de guardar o verifique que no sea el nodo raíz!");
				}
			}
		});
		/*Pregunta si selecciono o no algun nodo*/
		
	}

	/*Envia a la base de datos el orden de los nodos cuando se modifica en el mismo*/
	var updateOrdenNodo = function(data){
		$("#loading").show();
		$.post("rdatos/updateOrder", {treeData:data}, function(result){
			if (result='success') {
				$("#loading").hide();
				console.log("OK!");
			};
		});
	}

	/*Al hacer click en editar se desabilita el boton guardar y los campos para editar*/
	var editarButtom = function(){
		$("#editarText").on("click", function(){
			$("#guardar_btn").show();
			$("#ipt_tit").prop('disabled', false);
			$("#ipt_tit").focus();
			$("#ipt_descr").prop('disabled', false);
			$("#guardar_btn").prop('disabled', false);
		});
	}

	/*Captura los datos del titulo y la descripcion y los manda a la base de datos*/
	var guardarTituloDesc = function(){
		var titulo = $('#ipt_tit').val();
		var descripcion = $('#ipt_descr').val();
		var noSelecciono = 0;
		$('.jstree-children>li').each(function(index) {
			var style = $(this).attr("aria-selected");
			if(style === 'true'){
				noSelecciono = 1;
				var idNodo = $(this).attr('id')
				if (titulo && descripcion && idNodo != 1) {
					$("#loading").show();
					$.post("rdatos/updateTit", {id: idNodo, titulo:titulo, descripcion:descripcion}, function(res){
						if (res === "success") {
							$("#loading").hide();
							$("#ipt_tit").prop('disabled', true);
							$("#ipt_descr").prop('disabled', true);
							$("#guardar_btn").hide();
							bootbox.alert("Se ha modificado exitosamente...");
						}
					})
				}else{
					bootbox.alert("Por favor, complete los campos!");
				}
			}
		});

		/*Pregunta si selecciono o no algun nodo*/
		if (noSelecciono === 0) {
			bootbox.alert("Debe seleccionar un Nodo");
		};
	}

	return{
		createInstance:createInstance,
		createNode:createNode,
		getNodes:getNodes,
		newVal:newVal,
		nodoSelected:nodoSelected,
		insertText:insertText,
		editarButtom:editarButtom,
		guardarTituloDesc:guardarTituloDesc,
	}
}();