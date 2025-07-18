function confirmarRemocao(index) {
    if (confirm("¿Está seguro que desea eliminar este producto?\nItem "+index)) {
        document.querySelector('form input[name="index"][value="' + index + '"]')
               .closest('form')
               .submit();
    }
}






        // Variables globales

        
        //let menu = [];
        //let ingredientesPlatoActual = [];
        //let ventas = [];
        let compras = [];
        let proveedores = [];




function registrarCompra() {
    // Obtener valores del formulario
    const productoId = document.getElementById('productoCompra').value;
    const proveedorId = document.getElementById('proveedorCompra').value;
    const cantidad = parseFloat(document.getElementById('cantidadCompra').value);
    const precio = parseFloat(document.getElementById('precioCompra').value);
    
    // Validar campos obligatorios
    if (!productoId || !proveedorId || isNaN(cantidad) || cantidad <= 0 || isNaN(precio) || precio <= 0) {
        mostrarAlerta('Complete todos los campos con valores válidos', 'error', 'alertasCompras');
        return;
    }
    
    // Buscar producto y proveedor
    const producto = inventario.find(p => p.id == productoId);
    const proveedor = proveedores.find(p => p.id == proveedorId);
    
    if (!producto) {
        mostrarAlerta('Producto no encontrado en el inventario', 'error', 'alertasCompras');
        return;
    }
    
    if (!proveedor) {
        mostrarAlerta('Proveedor no encontrado', 'error', 'alertasCompras');
        return;
    }

    // Crear objeto de compra
    const compra = {
        id: Date.now(),
        productoId: producto.id,
        productoNombre: producto.producto,
        proveedorId: proveedor.id,
        proveedorNombre: proveedor.nombre,
        cantidad: cantidad,
        precioUnitario: precio,
        total: cantidad * precio,
        fecha: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
    };
    
    // Agregar a la lista de compras (VERIFICAR QUE 'compras' ESTÉ DECLARADO GLOBALMENTE)
    compras.push(compra);
    console.log("Compra registrada:", compra); // Debug
    
    // Actualizar inventario - buscar proveedor con mismo precio
    let proveedorEnInventario = producto.proveedores.find(p => 
        p.proveedorId == proveedorId && 
        p.precioUnitario == precio);
    
    if (proveedorEnInventario) {
        // Si existe el mismo proveedor con el mismo precio, actualizar cantidad
        proveedorEnInventario.cantidad += cantidad;
        proveedorEnInventario.fechaCompra = compra.fecha;
    } else {
        // Si no existe, agregar como nuevo registro
        producto.proveedores.push({
            proveedorId: proveedor.id,
            nombre: proveedor.nombre,
            cantidad: cantidad,
            precioUnitario: precio,
            fechaCompra: compra.fecha
        });
        
        // Ordenar proveedores por fecha (más reciente primero)
        producto.proveedores.sort((a, b) => new Date(b.fechaCompra) - new Date(a.fechaCompra));
    }
    
    
    // Mostrar mensaje de éxito
    mostrarAlerta(`Compra registrada: ${cantidad} ${producto.unidad} de ${producto.producto} - Total: S/${compra.total.toFixed(2)}`, 'success', 'alertasCompras');
    
    // Limpiar formulario (excepto producto seleccionado)
    document.getElementById('cantidadCompra').value = '';
    document.getElementById('precioCompra').value = '';
    
    // DEBUG: Verificar estado actual de compras
    console.log("Lista completa de compras:", compras);
}




function limpiarCompra() {
    document.getElementById('proveedorCompra').value = '';
    document.getElementById('productoCompra').innerHTML = '<option value="">Seleccionar producto</option>';
    document.getElementById('cantidadCompra').value = '';
    document.getElementById('precioCompra').value = '';
    document.getElementById('fechaCompra').value = '';
}


function eliminarCompra(id) {
    if (confirm('¿Está seguro que desea eliminar esta compra?')) {
        compras = compras.filter(c => c.id !== id);
        actualizarTablaCompras();
        mostrarAlerta('Compra eliminada correctamente', 'success', 'alertasCompras');
    }
}

// Bar tab functions
let ingredientesBarActual = [];


function eliminarIngredienteBar(index) {
    ingredientesBarActual.splice(index, 1);
    actualizarListaIngredientesBar();
}


function limpiarFormularioBar() {
    document.getElementById('nombreBar').value = '';
    document.getElementById('tipoBar').value = '';
    document.getElementById('descripcionBar').value = '';
    document.getElementById('precioVentaBar').value = '';
    document.getElementById('margenDeseadoBar').value = '';
    document.getElementById('ingredienteSelectBar').value = '';
    document.getElementById('cantidadIngredienteBar').value = '';
    document.getElementById('costoIngredienteBar').value = '';
    ingredientesBarActual = [];
    document.getElementById('listaIngredientesBar').innerHTML = '';
}


function buscarEnBar() {
    const texto = document.getElementById('buscarBar').value.toLowerCase();
    const filas = document.querySelectorAll('#tablaBar tbody tr');
    
    filas.forEach(fila => {
        const nombre = fila.cells[0].textContent.toLowerCase();
        fila.style.display = nombre.includes(texto) ? '' : 'none';
    });
}

function eliminarBar(id) {
    if (confirm('¿Está seguro que desea eliminar este ítem del bar?')) {
        menu = menu.filter(item => item.id !== id);
        actualizarTablaBar(); // Only updates bar table
        actualizarSelectPlatosVenta();
        mostrarAlerta('Ítem eliminado correctamente', 'success', 'alertasBar');
    }
}



// FUNCIONES DE proveedores

function mostrarFormularioProveedor() {
    document.getElementById('formularioProveedor').style.display = 'block';
}

function ocultarFormularioProveedor() {
    document.getElementById('formularioProveedor').style.display = 'none';
    limpiarFormularioProveedor();
}

// Limpiar formulario
function limpiarFormularioProveedor() {
    document.getElementById('nuevoProveedorNombre').value = '';
    document.getElementById('nuevoProveedorContacto').value = '';
    document.getElementById('nuevoProveedorTelefono').value = '';
    document.getElementById('nuevoProveedorEmail').value = '';
}


function buscarProveedores() {
    const termino = document.getElementById('buscarProveedor').value.toLowerCase();
    const filas = document.querySelectorAll('#tablaProveedores tbody tr');
    
    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        fila.style.display = textoFila.includes(termino) ? '' : 'none';
    });
}






        // ========== FUNCIONES DE INVENTARIO ==========
        
       
      
// Función auxiliar para generar IDs consistentes para proveedores
function generarIdProveedor(nombreProveedor) {
    // Creamos un ID basado en el hash del nombre para mantener consistencia
    let hash = 0;
    for (let i = 0; i < nombreProveedor.length; i++) {
        const char = nombreProveedor.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}


function limpiarFormularioInventario() {
    // Limpiar campos básicos
    document.getElementById('producto').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('unidad').value = '';
    document.getElementById('stockMinimo').value = '';
    
    // Limpiar proveedor 1
    document.getElementById('proveedor1Nombre').value = '';
    document.getElementById('proveedor1Cantidad').value = '';
    document.getElementById('proveedor1Precio').value = '';
    document.getElementById('proveedor1Fecha').value = '';
    
    // Limpiar proveedor 2
    document.getElementById('proveedor2Nombre').value = '';
    document.getElementById('proveedor2Cantidad').value = '';
    document.getElementById('proveedor2Precio').value = '';
    document.getElementById('proveedor2Fecha').value = '';
    
    // Limpiar proveedor 3
    document.getElementById('proveedor3Nombre').value = '';
    document.getElementById('proveedor3Cantidad').value = '';
    document.getElementById('proveedor3Precio').value = '';
    document.getElementById('proveedor3Fecha').value = '';
}

        function buscarEnInventario() {
            const texto = document.getElementById('buscarProducto').value.toLowerCase();
            const filas = document.querySelectorAll('#tablaInventario tbody tr');
            
            filas.forEach(fila => {
                const nombre = fila.cells[0].textContent.toLowerCase();
                const categoria = fila.cells[1].textContent.toLowerCase();
                
                if (nombre.includes(texto) || categoria.includes(texto)) {
                    fila.style.display = '';
                } else {
                    fila.style.display = 'none';
                }
            });
        }



        // ========== FUNCIONES DE MENÚ ==========

    
      function eliminarIngrediente(index) {
    ingredientesPlatoActual.splice(index, 1);
    actualizarListaIngredientes();
}


        function limpiarFormularioMenu() {
            document.getElementById('nombrePlato').value = '';
            document.getElementById('tipoPlato').value = '';
            document.getElementById('descripcionPlato').value = '';
            document.getElementById('precioVenta').value = '';
            document.getElementById('margenDeseado').value = '';
            document.getElementById('ingredienteSelect').value = '';
            document.getElementById('cantidadIngrediente').value = '';
            document.getElementById('costoIngrediente').value = '';
            
            ingredientesPlatoActual = [];
            document.getElementById('listaIngredientes').innerHTML = '';
        }

        function buscarEnMenu() {
            const texto = document.getElementById('buscarPlato').value.toLowerCase();
            const filas = document.querySelectorAll('#tablaMenu tbody tr');
            
            filas.forEach(fila => {
                const nombre = fila.cells[0].textContent.toLowerCase();
                const tipo = fila.cells[1].textContent.toLowerCase();
                
                if (nombre.includes(texto) || tipo.includes(texto)) {
                    fila.style.display = '';
                } else {
                    fila.style.display = 'none';
                }
            });
        }





        // ========== FUNCIONES GENERALES ==========
        function mostrarAlerta(mensaje, tipo, seccion) {
            const alerta = document.createElement('div');
            alerta.className = `alert alert-${tipo === 'error' ? 'warning' : 'success'}`;
            alerta.textContent = mensaje;
            
            const contenedor = document.getElementById(seccion);
            contenedor.insertBefore(alerta, contenedor.firstChild);
            
            setTimeout(() => {
                alerta.remove();
            }, 5000);
        }

function eliminarProducto(id) {
    if (confirm('¿Está seguro que desea eliminar este producto?')) {
        inventario = inventario.filter(producto => producto.id !== id);
        actualizarTablaInventario();
        sincronizarProveedoresDesdeInventario(); // Add this line
        actualizarSelectProductosCompra(); // Add this line
        mostrarAlerta('Producto eliminado correctamente', 'success', 'alertasInventario');
    }
    refrescarUICompras();
}
function eliminarPlato(id) {
    if (confirm('¿Está seguro que desea eliminar este plato del menú?')) {
        menu = menu.filter(item => item.id !== id);
        actualizarTablaMenu(); // Only updates food table
        actualizarSelectPlatosVenta();
        mostrarAlerta('Plato eliminado correctamente', 'success', 'alertasMenu');
    }
}





        
    // ========== FUNCIONES DE VENTAS ==========


function calcularTotalVenta() {
    const cantidad = parseInt(document.getElementById('cantidadVenta').value) || 0;
    const precio = parseFloat(document.getElementById('precioUnitarioVenta').value) || 0;
    const total = cantidad * precio;
    document.getElementById('totalVenta').value = total.toFixed(2);
}
// ========== FUNCIÓN PARA DESCONTAR INVENTARIO (PEPS) ==========

function descontarInventario(platoId, cantidad) {
    // Convertir platoId a número si es string (puede venir del select como string)
    platoId = typeof platoId === 'string' ? parseInt(platoId) : platoId;
    
    const plato = menu.find(p => p.id === platoId);
    if (!plato) {
        console.error("Plato no encontrado con ID:", platoId);
        mostrarAlerta("Plato no encontrado en el menú", "error", "alertasVentas");
        return false;
    }

    let todosIngredientesDisponibles = true;
    let ingredientesFaltantes = [];
    
    // Verificar stock para cada ingrediente
    plato.ingredientes.forEach(ingrediente => {
        const productoInventario = inventario.find(p => p.id === ingrediente.id);
        if (!productoInventario) {
            console.error(`Producto no encontrado en inventario: ${ingrediente.nombre}`);
            ingredientesFaltantes.push(ingrediente.nombre);
            todosIngredientesDisponibles = false;
            return;
        }

        const totalDisponible = productoInventario.proveedores.reduce((sum, p) => sum + p.cantidad, 0);
        const cantidadNecesaria = ingrediente.cantidad * cantidad;
        
        if (totalDisponible < cantidadNecesaria) {
            console.error(`Stock insuficiente para: ${productoInventario.producto}`);
            ingredientesFaltantes.push(`${productoInventario.producto} (Faltan: ${cantidadNecesaria - totalDisponible} ${productoInventario.unidad})`);
            todosIngredientesDisponibles = false;
        }
    });

    if (!todosIngredientesDisponibles) {
        const mensaje = `Stock insuficiente para: ${ingredientesFaltantes.join(', ')}`;
        mostrarAlerta(mensaje, "error", "alertasVentas");
        return false;
    }

    // Descontar ingredientes del inventario
    plato.ingredientes.forEach(ingrediente => {
        const productoInventario = inventario.find(p => p.id === ingrediente.id);
        let cantidadADescontar = ingrediente.cantidad * cantidad;
        
        // Ordenar proveedores por fecha más antigua primero (PEPS)
        const proveedoresOrdenados = [...productoInventario.proveedores].sort((a, b) => 
            new Date(a.fechaCompra) - new Date(b.fechaCompra));
        
        for (const proveedor of proveedoresOrdenados) {
            if (cantidadADescontar <= 0) break;
            
            const cantidadADescontarDeEste = Math.min(proveedor.cantidad, cantidadADescontar);
            proveedor.cantidad -= cantidadADescontarDeEste;
            cantidadADescontar -= cantidadADescontarDeEste;
        }
    });

    actualizarTablaInventario();
    return true;
}



function actualizarEstadisticasVentas() {
    const hoy = new Date().toLocaleDateString();
    
    // Ventas Hoy
    const ventasHoy = ventas.filter(v => new Date(v.fechaHora).toLocaleDateString() === hoy);
    const totalHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);
    const gananciaHoy = ventasHoy.reduce((sum, v) => {
        const plato = menu.find(p => p.id === v.platoId);
        return sum + (plato ? v.cantidad * (plato.precioVenta - plato.costoProduccion) : 0);
    }, 0);
    
    document.getElementById('ventasHoy').textContent = `S/${totalHoy.toFixed(2)}`;
    document.getElementById('gananciaHoy').textContent = `S/${gananciaHoy.toFixed(2)}`;
    
    // Ventas Semana
    const semanaPasada = new Date();
    semanaPasada.setDate(semanaPasada.getDate() - 7);
    const ventasSemana = ventas.filter(v => new Date(v.fechaHora) >= semanaPasada);
    const totalSemana = ventasSemana.reduce((sum, v) => sum + v.total, 0);
    const gananciaSemana = ventasSemana.reduce((sum, v) => {
        const plato = menu.find(p => p.id === v.platoId);
        return sum + (plato ? v.cantidad * (plato.precioVenta - plato.costoProduccion) : 0);
    }, 0);
    
    document.getElementById('ventasSemana').textContent = `S/${totalSemana.toFixed(2)}`;
    document.getElementById('gananciaSemana').textContent = `S/${gananciaSemana.toFixed(2)}`;
    
    // Ventas Mes
    const mesActual = new Date().getMonth();
    const añoActual = new Date().getFullYear();
    const ventasMes = ventas.filter(v => {
        const fechaVenta = new Date(v.fechaHora);
        return fechaVenta.getMonth() === mesActual && fechaVenta.getFullYear() === añoActual;
    });
    const totalMes = ventasMes.reduce((sum, v) => sum + v.total, 0);
    const gananciaMes = ventasMes.reduce((sum, v) => {
        const plato = menu.find(p => p.id === v.platoId);
        return sum + (plato ? v.cantidad * (plato.precioVenta - plato.costoProduccion) : 0);
    }, 0);
    
    document.getElementById('ventasMes').textContent = `S/${totalMes.toFixed(2)}`;
    document.getElementById('gananciaMes').textContent = `S/${gananciaMes.toFixed(2)}`;
    
    // Plato Más Vendido
    const platosCount = {};
    ventas.forEach(v => {
        platosCount[v.platoId] = (platosCount[v.platoId] || 0) + v.cantidad;
    });
    
    let platoPopularId = null;
    let maxVentas = 0;
    for (const platoId in platosCount) {
        if (platosCount[platoId] > maxVentas) {
            maxVentas = platosCount[platoId];
            platoPopularId = platoId;
        }
    }
    
    if (platoPopularId) {
        const platoPopular = menu.find(p => p.id == platoPopularId);
        document.getElementById('platoPopular').textContent = platoPopular.nombre;
        document.getElementById('margenPlatoPopular').textContent = `${platoPopular.margenReal.toFixed(2)}%`;
    } else {
        document.getElementById('platoPopular').textContent = '-';
        document.getElementById('margenPlatoPopular').textContent = '-';
    }
}



function limpiarVenta() {
    document.getElementById('platoVenta').value = '';
    document.getElementById('cantidadVenta').value = '1';
    document.getElementById('precioUnitarioVenta').value = '';
    document.getElementById('totalVenta').value = '';
}

function eliminarVenta(id) {
    if (confirm('¿Está seguro que desea eliminar esta venta?')) {
        ventas = ventas.filter(venta => venta.id !== id);
        actualizarTablaVentas();
        actualizarEstadisticasVentas();
        mostrarAlerta('Venta eliminada correctamente', 'success', 'alertasVentas');
    }
}
   
   
   
   
   
