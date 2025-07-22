// Variables globales
// Cambiar la estructura de inventario a:
let inventario = [
    {
        id: 1,
        producto: "Pollo entero",
        categoria: "carnes",
        unidad: "kg",
        proveedores: [
            { 
                proveedorId: 1, 
                nombre: "Carnes S.A.", 
                cantidad: 10, 
                precioUnitario: 12.5, 
                fechaCompra: "2023-05-01" 
            },
            { 
                proveedorId: 2, 
                nombre: "Distribuciones XYZ", 
                cantidad: 5, 
                precioUnitario: 11.8, 
                fechaCompra: "2023-05-10" 
            }
        ],
        stockMinimo: 10
    }
];
        
        let menu = [];
        let ingredientesPlatoActual = [];
        let ventas = [];
        let compras = [];
        let proveedores = [];

        // Función para mostrar secciones

function showSection(sectionId, event) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update active tabs
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (event) {
        event.currentTarget.classList.add('active');
    }
    
    // Special handling for each section
    switch(sectionId) {
        case 'menu':
            actualizarSelectIngredientes();
            break;
            
        case 'bar':
            actualizarSelectIngredientesBar();
            break;
            
        case 'compras':
            // Force refresh of both dropdowns
            actualizarSelectProductosCompra();
            actualizarSelectProveedoresCompras();
            break;
            
        case 'ventas':
            actualizarSelectPlatosVenta();
            break;
    }
}

        // funciones para compras
        
        function actualizarSelectProveedores() {
    const select = document.getElementById('proveedorCompra');
    select.innerHTML = '<option value="">Seleccionar proveedor</option>';
    
    proveedores.forEach(prov => {
        const option = document.createElement('option');
        option.value = prov.id;
        option.textContent = `${prov.nombre} (${prov.productos.join(', ')})`;
        select.appendChild(option);
    });
}

function actualizarProductosProveedor() {
    const proveedorId = document.getElementById('proveedorCompra').value;
    const select = document.getElementById('productoCompra');
    select.innerHTML = '<option value="">Seleccionar producto</option>';
    
    if (!proveedorId) return;
    
    const prov = proveedores.find(p => p.id == proveedorId);
    prov.productos.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto;
        option.textContent = producto;
        select.appendChild(option);
    });
}

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
    
    // Sincronizar proveedores
    sincronizarProveedoresDesdeInventario();
    
    // Actualizar TODAS las interfaces necesarias
    actualizarTablaCompras();
    actualizarTablaInventario();
    actualizarTablaProveedores();
    actualizarSelectProductosCompra(); // Actualizar selects
    
    // Mostrar mensaje de éxito
    mostrarAlerta(`Compra registrada: ${cantidad} ${producto.unidad} de ${producto.producto} - Total: S/${compra.total.toFixed(2)}`, 'success', 'alertasCompras');
    
    // Limpiar formulario (excepto producto seleccionado)
    document.getElementById('cantidadCompra').value = '';
    document.getElementById('precioCompra').value = '';
    
    // DEBUG: Verificar estado actual de compras
    console.log("Lista completa de compras:", compras);
}
function refrescarUICompras() {
    actualizarSelectProductosCompra();
    
    // If a product is selected, refresh its suppliers dropdown
    const productoSelect = document.getElementById('productoCompra');
    if (productoSelect.value) {
        actualizarProveedoresProducto();
    }
}

function actualizarSelectProductosCompra() {
    const select = document.getElementById('productoCompra');
    const currentSelectedValue = select.value; // Remember current selection
    
    // Clear and rebuild options
    select.innerHTML = '<option value="">Seleccionar producto</option>';
    
    inventario.forEach(producto => {
        if (producto.proveedores && producto.proveedores.length > 0) {
            const option = document.createElement('option');
            option.value = producto.id;
            option.textContent = `${producto.producto} (${producto.unidad})`;
            select.appendChild(option);
        }
    });
    
    // Restore selection if still valid
    if (currentSelectedValue && Array.from(select.options).some(o => o.value === currentSelectedValue)) {
        select.value = currentSelectedValue;
        // Trigger supplier update
        actualizarProveedoresProducto();
    }
}
// Función que se ejecuta al seleccionar un producto

function actualizarProveedoresProducto() {
    mostrarAlerta("actualizarProveedoresProducto() fue llamado", "info", "alertasCompras");
    console.log("actualizarProveedoresProducto() fue llamado");

    const productoId = document.getElementById('productoCompra').value;
    const selectProveedor = document.getElementById('proveedorCompra');
    const inputPrecio = document.getElementById('precioCompra');
    
    // Clear dropdown
    selectProveedor.innerHTML = '<option value="">Seleccionar proveedor</option>';
    
    if (!productoId) {
        // Show all suppliers if no product selected
        proveedores.forEach(prov => {
            const option = document.createElement('option');
            option.value = prov.id;
            option.textContent = prov.nombre;
            selectProveedor.appendChild(option);
        });
        return;
    }

    const producto = inventario.find(p => p.id == productoId);
    if (!producto) return;

    // 1. PROVEEDORES ACTUALES
    const optGroupCurrent = document.createElement('optgroup');
    optGroupCurrent.label = "Proveedores actuales";
    
    const currentSupplierIds = [...new Set(producto.proveedores.map(p => p.proveedorId))];
    
    producto.proveedores.forEach(prov => {
        const proveedor = proveedores.find(p => p.id == prov.proveedorId);
        if (proveedor) {
            const option = document.createElement('option');
            option.value = prov.proveedorId;
            option.textContent = `${proveedor.nombre} (S/${prov.precioUnitario.toFixed(2)})`;
            option.dataset.precio = prov.precioUnitario;
            optGroupCurrent.appendChild(option);
        }
    });

    // 2. OTROS PROVEEDORES
    const optGroupOthers = document.createElement('optgroup');
    optGroupOthers.label = "Otros proveedores";
    
    proveedores.forEach(prov => {
        if (!currentSupplierIds.includes(prov.id)) {
            const option = document.createElement('option');
            option.value = prov.id;
            option.textContent = prov.nombre;
            optGroupOthers.appendChild(option);
        }
    });

    // Build dropdown - CHANGED THIS SECTION
    if (optGroupCurrent.children.length > 0) {
        selectProveedor.appendChild(optGroupCurrent);
    }
    
    if (optGroupOthers.children.length > 0) {
        // Add separator only if both groups have items
        if (optGroupCurrent.children.length > 0 && optGroupOthers.children.length > 0) {
            const separator = document.createElement('option');
            separator.disabled = true;
            separator.textContent = "----------------------";
            selectProveedor.appendChild(separator);
        }
        selectProveedor.appendChild(optGroupOthers);
    }
}

function limpiarCompra() {
    document.getElementById('proveedorCompra').value = '';
    document.getElementById('productoCompra').innerHTML = '<option value="">Seleccionar producto</option>';
    document.getElementById('cantidadCompra').value = '';
    document.getElementById('precioCompra').value = '';
    document.getElementById('fechaCompra').value = '';
}

function actualizarTablaCompras() {
    const tbody = document.querySelector('#tablaCompras tbody');
    if (!tbody) {
        console.error("No se encontró el tbody de tablaCompras");
        return;
    }
    tbody.innerHTML = '';
    
    // Ordenar compras por fecha (más reciente primero)
    compras.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    if (compras.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" style="text-align:center;">No hay compras registradas</td>`;
        tbody.appendChild(row);
        return;
    }
    
    compras.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${c.fecha}</td>
            <td>${c.productoNombre}</td>
            <td>${c.proveedorNombre}</td>
            <td>${c.cantidad}</td>
            <td>S/${c.precioUnitario.toFixed(2)}</td>
            <td>S/${c.total.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger" onclick="eliminarCompra(${c.id})">🗑</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    console.log("Tabla de compras actualizada", compras); // Debug line
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

function actualizarSelectIngredientesBar() {
    const select = document.getElementById('ingredienteSelectBar');
    select.innerHTML = '<option value="">Seleccionar ingrediente</option>';
    
    inventario.forEach(producto => {
        const totalStock = producto.proveedores.reduce((sum, p) => sum + p.cantidad, 0);
        const valorTotal = producto.proveedores.reduce((sum, p) => sum + (p.cantidad * p.precioUnitario), 0);
        const precioPromedio = totalStock > 0 ? valorTotal / totalStock : 0;
        
        const option = document.createElement('option');
        option.value = producto.id;
        option.textContent = `${producto.producto} (${producto.unidad}) - S/${precioPromedio.toFixed(2)}`;
        option.dataset.precio = precioPromedio.toFixed(2);
        select.appendChild(option);
    });
    
    select.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        document.getElementById('costoIngredienteBar').value = selectedOption.value ? selectedOption.dataset.precio : '';
    });
}

function agregarIngredienteBar() {
    const ingredienteId = document.getElementById('ingredienteSelectBar').value;
    const cantidad = parseFloat(document.getElementById('cantidadIngredienteBar').value);
    
    if (!ingredienteId || isNaN(cantidad) || cantidad <= 0) {
        mostrarAlerta('Seleccione un ingrediente y cantidad válida', 'error', 'alertasBar');
        return;
    }

    const producto = inventario.find(p => p.id == ingredienteId);
    if (!producto) {
        mostrarAlerta('Producto no encontrado en inventario', 'error', 'alertasBar');
        return;
    }

    const totalStock = producto.proveedores.reduce((sum, p) => sum + p.cantidad, 0);
    const valorTotal = producto.proveedores.reduce((sum, p) => sum + (p.cantidad * p.precioUnitario), 0);
    const precioPromedio = totalStock > 0 ? valorTotal / totalStock : 0;

    const ingrediente = {
        id: producto.id,
        nombre: producto.producto,
        cantidad: cantidad,
        unidad: producto.unidad,
        costoUnitario: precioPromedio,
        costoTotal: cantidad * precioPromedio
    };

    const existingIndex = ingredientesBarActual.findIndex(i => i.id === ingrediente.id);
    if (existingIndex >= 0) {
        ingredientesBarActual[existingIndex] = ingrediente;
    } else {
        ingredientesBarActual.push(ingrediente);
    }
    
    actualizarListaIngredientesBar();
    document.getElementById('cantidadIngredienteBar').value = '';
}

function actualizarListaIngredientesBar() {
    const lista = document.getElementById('listaIngredientesBar');
    lista.innerHTML = '';

    if (ingredientesBarActual.length === 0) {
        lista.innerHTML = '<div style="padding: 10px; text-align: center; color: #666;">No hay ingredientes agregados</div>';
        return;
    }

    const costoTotal = ingredientesBarActual.reduce((sum, ing) => sum + ing.costoTotal, 0);
    
    ingredientesBarActual.forEach((ing, index) => {
        const item = document.createElement('div');
        item.className = 'ingredient-item';
        item.innerHTML = `
            <div style="flex: 1;">
                <strong>${ing.nombre}</strong><br>
                <small>${ing.cantidad} ${ing.unidad} × S/${ing.costoUnitario.toFixed(2)} = S/${ing.costoTotal.toFixed(2)}</small>
            </div>
            <button class="btn btn-danger" onclick="eliminarIngredienteBar(${index})">🗑</button>
        `;
        lista.appendChild(item);
    });

    const totalRow = document.createElement('div');
    totalRow.className = 'ingredient-item';
    totalRow.style.background = '#f0f0f0';
    totalRow.innerHTML = `
        <div style="flex: 1; text-align: right;">
            <strong>Costo Total de Producción:</strong>
        </div>
        <div style="font-weight: bold;">
            S/${costoTotal.toFixed(2)}
        </div>
    `;
    lista.appendChild(totalRow);
}

function eliminarIngredienteBar(index) {
    ingredientesBarActual.splice(index, 1);
    actualizarListaIngredientesBar();
}

function guardarBar() {
    const nombre = document.getElementById('nombreBar').value;
    const tipo = document.getElementById('tipoBar').value;
    const descripcion = document.getElementById('descripcionBar').value;
    const precioVenta = parseFloat(document.getElementById('precioVentaBar').value);
    const margenDeseado = parseFloat(document.getElementById('margenDeseadoBar').value);

    if (!nombre || !tipo || ingredientesBarActual.length === 0 || isNaN(precioVenta)) {
        mostrarAlerta('Complete todos los campos y agregue ingredientes', 'error', 'alertasBar');
        return;
    }

    let costoProduccion = 0;
    ingredientesBarActual.forEach(ing => {
        costoProduccion += ing.costoTotal;
    });

    const margenReal = ((precioVenta - costoProduccion) / costoProduccion) * 100;
    const ganancia = precioVenta - costoProduccion;

    const nuevoItemBar = {
        id: Date.now(),
        nombre,
        tipo,
        descripcion,
        precioVenta,
        margenDeseado: isNaN(margenDeseado) ? 0 : margenDeseado,
        costoProduccion,
        margenReal,
        ganancia,
        ingredientes: [...ingredientesBarActual],
        fechaCreacion: new Date().toLocaleDateString(),
        esBar: true // Flag to identify bar items
    };

    menu.push(nuevoItemBar);
    actualizarTablaBar();
    mostrarAlerta('Bebida/Cóctel guardado correctamente', 'success', 'alertasBar');
    limpiarFormularioBar();
    actualizarSelectPlatosVenta();
    
}

function actualizarTablaBar() {
    const tbody = document.querySelector('#tablaBar tbody');
    tbody.innerHTML = '';

    // Only show drinks/cocktails
    const itemsBar = menu.filter(item => 
        item.tipo === 'bebida' || 
        item.tipo === 'cocktail'
    );
    
    itemsBar.forEach(item => {
        let ingredientesHTML = '<ul style="margin: 0; padding-left: 20px;">';
        item.ingredientes.forEach(ing => {
            ingredientesHTML += `<li>${ing.nombre}: ${ing.cantidad} ${ing.unidad}</li>`;
        });
        ingredientesHTML += '</ul>';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.tipo === 'bebida' ? 'Bebida' : 'Cóctel'}</td>
            <td>S/${item.costoProduccion.toFixed(2)}</td>
            <td>S/${item.precioVenta.toFixed(2)}</td>
            <td>${item.margenReal.toFixed(2)}%</td>
            <td>S/${item.ganancia.toFixed(2)}</td>
            <td>${ingredientesHTML}</td>
            <td>
                <button class="btn btn-secondary" onclick="editarBar(${item.id})">✏</button>
                <button class="btn btn-danger" onclick="eliminarBar(${item.id})">🗑</button>
            </td>
        `;
        tbody.appendChild(row);
    });
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

// Agregar nuevo proveedor

function agregarProveedor() {
    const nombre = document.getElementById('nuevoProveedorNombre').value.trim();
    const contacto = document.getElementById('nuevoProveedorContacto').value.trim();
    const telefono = document.getElementById('nuevoProveedorTelefono').value.trim();
    const email = document.getElementById('nuevoProveedorEmail').value.trim();
    
    if (!nombre) {
        mostrarAlerta('El nombre del proveedor es obligatorio', 'error', 'alertasProveedores');
        return;
    }
    
    // Verificar si el proveedor ya existe
    const existeProveedor = proveedores.some(p => p.nombre.toLowerCase() === nombre.toLowerCase());
    if (existeProveedor) {
        mostrarAlerta('Este proveedor ya está registrado', 'error', 'alertasProveedores');
        return;
    }
    
    // Crear nuevo proveedor
    const nuevoProveedor = {
        id: generarIdProveedor(nombre),
        nombre: nombre,
        contacto: contacto || '-',
        telefono: telefono || '-',
        email: email || '-',
        productos: []
    };
    
    proveedores.push(nuevoProveedor);
    
    // Actualizar todas las interfaces relacionadas
    actualizarTablaProveedores();
    actualizarDatalistProveedores();
    
    // ACTUALIZACIÓN CRUCIAL: Refrescar el select de proveedores en Compras
    actualizarSelectProveedoresCompras();
    
    // Si hay un producto seleccionado en Compras, actualizar sus proveedores también
    const productoSelect = document.getElementById('productoCompra');
    if (productoSelect.value) {
        actualizarProveedoresProducto();
    }
    
    mostrarAlerta('Proveedor agregado correctamente', 'success', 'alertasProveedores');
    ocultarFormularioProveedor();
}
function actualizarDatalistProveedores() {
    const datalist = document.getElementById('proveedoresList');
    datalist.innerHTML = '';
    
    proveedores.forEach(proveedor => {
        const option = document.createElement('option');
        option.value = proveedor.nombre;
        option.dataset.id = proveedor.id;
        datalist.appendChild(option);
    });
}

function editarProveedor(id) {
    const proveedor = proveedores.find(p => p.id == id);
    if (!proveedor) return;
    
    document.getElementById('editProveedorId').value = proveedor.id;
    document.getElementById('editProveedorNombre').value = proveedor.nombre;
    document.getElementById('editProveedorContacto').value = proveedor.contacto || '';
    document.getElementById('editProveedorTelefono').value = proveedor.telefono || '';
    document.getElementById('editProveedorEmail').value = proveedor.email || '';
    
    document.getElementById('modalProveedor').style.display = 'block';
}
function guardarEdicionProveedor() {
    const id = document.getElementById('editProveedorId').value;
    const proveedor = proveedores.find(p => p.id == id);
    
    if (proveedor) {
        proveedor.nombre = document.getElementById('editProveedorNombre').value;
        proveedor.contacto = document.getElementById('editProveedorContacto').value;
        proveedor.telefono = document.getElementById('editProveedorTelefono').value;
        proveedor.email = document.getElementById('editProveedorEmail').value;
        
        actualizarTablaProveedores();
        cerrarModal();
        mostrarAlerta('Proveedor actualizado', 'success', 'alertasProveedores');
    }
}

// Función para agregar proveedores automáticamente desde inventario

function sincronizarProveedoresDesdeInventario() {
    inventario.forEach(producto => {
        producto.proveedores.forEach(provInventario => {
            // Buscar proveedor existente
            let proveedorExistente = proveedores.find(p => p.id == provInventario.proveedorId);
            
            if (!proveedorExistente) {
                // Crear nuevo proveedor si no existe
                proveedores.push({
                    id: provInventario.proveedorId,
                    nombre: provInventario.nombre,
                    contacto: '-',
                    telefono: '-',
                    email: '-',
                    productos: [producto.producto]
                });
            } else {
                // Actualizar nombre si cambió
                if (proveedorExistente.nombre !== provInventario.nombre) {
                    proveedorExistente.nombre = provInventario.nombre;
                }
                
                // Agregar producto si no está en la lista
                if (!proveedorExistente.productos.includes(producto.producto)) {
                    proveedorExistente.productos.push(producto.producto);
                }
            }
        });
    });
    
    actualizarTablaProveedores();
    actualizarDatalistProveedores();
    actualizarSelectProveedoresCompras();
}

function actualizarSelectProveedoresCompras() {
    const selectProveedor = document.getElementById('proveedorCompra');
    const selectProducto = document.getElementById('productoCompra');
    const inputPrecio = document.getElementById('precioCompra');
    
    // Guardar selección actual
    const selectedProveedorId = selectProveedor.value;
    
    // Limpiar select
    selectProveedor.innerHTML = '<option value="">Seleccionar proveedor</option>';
    
    const productoId = selectProducto.value;
    if (!productoId) {
        // Si no hay producto seleccionado, mostrar todos los proveedores
        proveedores.forEach(prov => {
            const option = document.createElement('option');
            option.value = prov.id;
            option.textContent = prov.nombre;
            selectProveedor.appendChild(option);
        });
    } else {
        // Buscar el producto en el inventario
        const producto = inventario.find(p => p.id == productoId);
        if (producto && producto.proveedores && producto.proveedores.length > 0) {
            // 1. Grupo para proveedores actuales
            const optGroupCurrent = document.createElement('optgroup');
            optGroupCurrent.label = "Proveedores actuales";
            
            // Agregar proveedores de este producto
            producto.proveedores.forEach(prov => {
                const proveedor = proveedores.find(p => p.id == prov.proveedorId);
                if (proveedor) {
                    const option = document.createElement('option');
                    option.value = proveedor.id;
                    option.textContent = `${proveedor.nombre} (S/${prov.precioUnitario.toFixed(2)})`;
                    option.dataset.precio = prov.precioUnitario;
                    optGroupCurrent.appendChild(option);
                }
            });
            
            selectProveedor.appendChild(optGroupCurrent);
            
            // 2. Grupo para otros proveedores
            const optGroupOthers = document.createElement('optgroup');
            optGroupOthers.label = "Otros proveedores";
            
            // Agregar proveedores que no son actuales
            const currentSupplierIds = producto.proveedores.map(p => p.proveedorId);
            proveedores.forEach(prov => {
                if (!currentSupplierIds.includes(prov.id)) {
                    const option = document.createElement('option');
                    option.value = prov.id;
                    option.textContent = prov.nombre;
                    optGroupOthers.appendChild(option);
                }
            });
            
            if (optGroupOthers.options.length > 0) {
                // Agregar separador
                const separator = document.createElement('option');
                separator.disabled = true;
                separator.textContent = "----------------------";
                selectProveedor.appendChild(separator);
                
                selectProveedor.appendChild(optGroupOthers);
            }
        } else {
            mostrarAlerta('Este producto no tiene proveedores registrados', 'warning', 'alertasCompras');
        }
    }
    
    // Restaurar selección anterior si todavía existe
    if (selectedProveedorId && Array.from(selectProveedor.options).some(opt => opt.value === selectedProveedorId)) {
        selectProveedor.value = selectedProveedorId;
        // Actualizar precio si corresponde
        const selectedOption = selectProveedor.options[selectProveedor.selectedIndex];
        if (selectedOption.dataset.precio) {
            inputPrecio.value = selectedOption.dataset.precio;
        }
    }
}

function actualizarTablaProveedores() {
    const tbody = document.querySelector('#tablaProveedores tbody');
    tbody.innerHTML = '';
    
    proveedores.forEach(prov => {
        const row = document.createElement('tr');
        
        // Create products list with bullet points
        let productosHTML = '<ul style="margin: 0; padding-left: 20px;">';
        prov.productos.forEach(producto => {
            productosHTML += `<li>${producto}</li>`;
        });
        productosHTML += '</ul>';
        
        row.innerHTML = `
            <td>${prov.id}</td>
            <td>${prov.nombre}</td>
            <td>${prov.contacto || '-'}</td>
            <td>${prov.telefono || '-'}</td>
            <td>${prov.email || '-'}</td>
            <td>${productosHTML}</td>
            <td>
                <button class="btn btn-secondary" onclick="editarProveedor(${prov.id})">✏️ Editar</button>
                <button class="btn btn-danger" onclick="eliminarProveedor(${prov.id})">🗑 Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
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
        function agregarProducto() {
    // Get basic product info
    const producto = document.getElementById('producto').value;
    const categoria = document.getElementById('categoria').value;
    const unidad = document.getElementById('unidad').value;
    const stockMinimo = parseFloat(document.getElementById('stockMinimo').value) || 0;

    // Validate basic fields
    if (!producto || !categoria || !unidad || isNaN(stockMinimo)) {
        mostrarAlerta('Complete los campos básicos del producto', 'error', 'alertasInventario');
        return;
    }

    // Proveedor 1 (obligatorio)
    const prov1Nombre = document.getElementById('proveedor1Nombre').value;
    const prov1Cant = parseFloat(document.getElementById('proveedor1Cantidad').value);
    const prov1Precio = parseFloat(document.getElementById('proveedor1Precio').value);
    const prov1Fecha = document.getElementById('proveedor1Fecha').value || new Date().toISOString().split('T')[0];
    
    if (!prov1Nombre || isNaN(prov1Cant) || isNaN(prov1Precio)) {
        mostrarAlerta('Complete los datos del Proveedor 1', 'error', 'alertasInventario');
        return;
    }
    
    // Check if supplier exists or create new one
    let prov1Id;
    const existingProv1 = proveedores.find(p => p.nombre.toLowerCase() === prov1Nombre.toLowerCase());
    
    if (existingProv1) {
        prov1Id = existingProv1.id;
        // Add product to supplier's product list if not already there
        if (!existingProv1.productos.includes(producto)) {
            existingProv1.productos.push(producto);
        }
    } else {
        // Create new supplier
        prov1Id = generarIdProveedor(prov1Nombre);
        proveedores.push({
            id: prov1Id,
            nombre: prov1Nombre,
            contacto: '',
            telefono: '',
            email: '',
            productos: [producto]
        });
    }

    // Create array of suppliers (now treats same supplier with different prices as separate entries)
    const proveedoresProducto = [{
        proveedorId: prov1Id,
        nombre: prov1Nombre,
        cantidad: prov1Cant,
        precioUnitario: prov1Precio,
        fechaCompra: prov1Fecha
    }];

    // Proveedor 2 (opcional) - now checks price too
    const prov2Nombre = document.getElementById('proveedor2Nombre').value;
    if (prov2Nombre) {
        const prov2Cant = parseFloat(document.getElementById('proveedor2Cantidad').value) || 0;
        const prov2Precio = parseFloat(document.getElementById('proveedor2Precio').value) || 0;
        const prov2Fecha = document.getElementById('proveedor2Fecha').value || new Date().toISOString().split('T')[0];
        
        if (prov2Cant > 0 && prov2Precio > 0) {
            let prov2Id;
            const existingProv2 = proveedores.find(p => p.nombre.toLowerCase() === prov2Nombre.toLowerCase());
            
            if (existingProv2) {
                prov2Id = existingProv2.id;
                if (!existingProv2.productos.includes(producto)) {
                    existingProv2.productos.push(producto);
                }
            } else {
                prov2Id = generarIdProveedor(prov2Nombre);
                proveedores.push({
                    id: prov2Id,
                    nombre: prov2Nombre,
                    contacto: '',
                    telefono: '',
                    email: '',
                    productos: [producto]
                });
            }
            
            // Add as new entry even if same supplier but different price
            proveedoresProducto.push({
                proveedorId: prov2Id,
                nombre: prov2Nombre,
                cantidad: prov2Cant,
                precioUnitario: prov2Precio,
                fechaCompra: prov2Fecha
            });
        }
    }

    // Proveedor 3 (opcional) - now checks price too
    const prov3Nombre = document.getElementById('proveedor3Nombre').value;
    if (prov3Nombre) {
        const prov3Cant = parseFloat(document.getElementById('proveedor3Cantidad').value) || 0;
        const prov3Precio = parseFloat(document.getElementById('proveedor3Precio').value) || 0;
        const prov3Fecha = document.getElementById('proveedor3Fecha').value || new Date().toISOString().split('T')[0];
        
        if (prov3Cant > 0 && prov3Precio > 0) {
            let prov3Id;
            const existingProv3 = proveedores.find(p => p.nombre.toLowerCase() === prov3Nombre.toLowerCase());
            
            if (existingProv3) {
                prov3Id = existingProv3.id;
                if (!existingProv3.productos.includes(producto)) {
                    existingProv3.productos.push(producto);
                }
            } else {
                prov3Id = generarIdProveedor(prov3Nombre);
                proveedores.push({
                    id: prov3Id,
                    nombre: prov3Nombre,
                    contacto: '',
                    telefono: '',
                    email: '',
                    productos: [producto]
                });
            }
            
            // Add as new entry even if same supplier but different price
            proveedoresProducto.push({
                proveedorId: prov3Id,
                nombre: prov3Nombre,
                cantidad: prov3Cant,
                precioUnitario: prov3Precio,
                fechaCompra: prov3Fecha
            });
        }
    }

    // Create new product
    const nuevoProducto = {
        id: Date.now(),
        producto,
        categoria,
        unidad,
        proveedores: proveedoresProducto,
        stockMinimo
    };

    // Add to inventory
    inventario.push(nuevoProducto);

    // Update UI
    actualizarTablaInventario();
    actualizarDatalistProveedores();
    actualizarTablaProveedores();
    actualizarSelectProductosCompra();
    mostrarAlerta('Producto agregado correctamente', 'success', 'alertasInventario');
    limpiarFormularioInventario();
    refrescarUICompras();
}
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

function actualizarTablaInventario() {
    const tbody = document.querySelector('#tablaInventario tbody');
    tbody.innerHTML = '';

    inventario.forEach(producto => {
        const row = document.createElement('tr');
        
        // Calculate values
        const totalStock = producto.proveedores.reduce((sum, p) => sum + p.cantidad, 0);
        const valorTotal = producto.proveedores.reduce((sum, p) => sum + (p.cantidad * p.precioUnitario), 0);
        const precioPromedio = totalStock > 0 ? valorTotal / totalStock : 0;
        
        // Stock status (keep existing)
        let stockStatus = '✅ Suficiente';
        if (totalStock < producto.stockMinimo) {
            stockStatus = '⚠ Bajo stock';
        } else if (totalStock <= 0) {
            stockStatus = '❌ Agotado';
        }

        // MODIFIED: Show each supplier-price combination in its own column
        let proveedoresHTML = '';
        // Get first 3 supplier-price combinations (sorted by date?)
        const proveedoresMostrar = [...producto.proveedores]
            .sort((a,b) => new Date(a.fechaCompra) - new Date(b.fechaCompra))
            .slice(0, 3);
        
        // Fill columns (up to 3)
        for (let i = 0; i < 3; i++) {
            const prov = proveedoresMostrar[i] || null;
            proveedoresHTML += `<td>${
                prov ? `${prov.cantidad} ${producto.unidad} @ S/${prov.precioUnitario.toFixed(2)} (${prov.nombre})` 
                     : '-'
            }</td>`;
        }

        row.innerHTML = `
            <td>${producto.producto}</td>
            <td>${producto.categoria}</td>
            ${proveedoresHTML}
            <td>S/${precioPromedio.toFixed(2)}</td>
            <td>${totalStock} ${producto.unidad}</td>
            <td>S/${valorTotal.toFixed(2)}</td>
            <td>${stockStatus}</td>
            <td>
                <button class="btn btn-secondary" onclick="editarProducto(${producto.id})">✏</button>
                <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">🗑</button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
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
    function actualizarSelectIngredientes() {
    const select = document.getElementById('ingredienteSelect');
    select.innerHTML = '<option value="">Seleccionar ingrediente</option>';
    
    inventario.forEach(producto => {
        // Calculate average price from all suppliers
        const totalStock = producto.proveedores.reduce((sum, p) => sum + p.cantidad, 0);
        const valorTotal = producto.proveedores.reduce((sum, p) => sum + (p.cantidad * p.precioUnitario), 0);
        const precioPromedio = totalStock > 0 ? valorTotal / totalStock : 0;
        
        const option = document.createElement('option');
        option.value = producto.id;
        option.textContent = `${producto.producto} (${producto.unidad}) - S/${precioPromedio.toFixed(2)}`;
        
        // Store the average price as a data attribute
        option.dataset.precio = precioPromedio.toFixed(2);
        
        select.appendChild(option);
    });
    
    // Update unit cost when an ingredient is selected
    select.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.value) {
            document.getElementById('costoIngrediente').value = selectedOption.dataset.precio;
        } else {
            document.getElementById('costoIngrediente').value = '';
        }
    });
}
    function agregarIngrediente() {
    const ingredienteId = document.getElementById('ingredienteSelect').value;
    const cantidad = parseFloat(document.getElementById('cantidadIngrediente').value);
    
    if (!ingredienteId || isNaN(cantidad) || cantidad <= 0) {
        mostrarAlerta('Seleccione un ingrediente y cantidad válida', 'error', 'alertasMenu');
        return;
    }

    const producto = inventario.find(p => p.id == ingredienteId);
    if (!producto) {
        mostrarAlerta('Producto no encontrado en inventario', 'error', 'alertasMenu');
        return;
    }

    // Calculate average price from all suppliers
    const totalStock = producto.proveedores.reduce((sum, p) => sum + p.cantidad, 0);
    const valorTotal = producto.proveedores.reduce((sum, p) => sum + (p.cantidad * p.precioUnitario), 0);
    const precioPromedio = totalStock > 0 ? valorTotal / totalStock : 0;

    const costoTotal = cantidad * precioPromedio;

    const ingrediente = {
        id: producto.id,
        nombre: producto.producto,
        cantidad: cantidad,
        unidad: producto.unidad,
        costoUnitario: precioPromedio,
        costoTotal: costoTotal
    };

    // Check if ingredient already exists
    const existingIndex = ingredientesPlatoActual.findIndex(i => i.id === ingrediente.id);
    if (existingIndex >= 0) {
        // Update existing ingredient
        ingredientesPlatoActual[existingIndex] = ingrediente;
    } else {
        // Add new ingredient
        ingredientesPlatoActual.push(ingrediente);
    }
    
    actualizarListaIngredientes();
    
    // Clear quantity field but keep the ingredient selected
    document.getElementById('cantidadIngrediente').value = '';
}
     function actualizarListaIngredientes() {
    const lista = document.getElementById('listaIngredientes');
    lista.innerHTML = '';

    if (ingredientesPlatoActual.length === 0) {
        lista.innerHTML = '<div style="padding: 10px; text-align: center; color: #666;">No hay ingredientes agregados</div>';
        return;
    }

    // Calculate total cost
    const costoTotal = ingredientesPlatoActual.reduce((sum, ing) => sum + ing.costoTotal, 0);
    
    ingredientesPlatoActual.forEach((ing, index) => {
        const item = document.createElement('div');
        item.className = 'ingredient-item';
        item.innerHTML = `
            <div style="flex: 1;">
                <strong>${ing.nombre}</strong><br>
                <small>${ing.cantidad} ${ing.unidad} × S/${ing.costoUnitario.toFixed(2)} = S/${ing.costoTotal.toFixed(2)}</small>
            </div>
            <button class="btn btn-danger" onclick="eliminarIngrediente(${index})">🗑</button>
        `;
        lista.appendChild(item);
    });

    // Add total row
    const totalRow = document.createElement('div');
    totalRow.className = 'ingredient-item';
    totalRow.style.background = '#f0f0f0';
    totalRow.style.borderRadius = '0 0 8px 8px';
    totalRow.style.marginTop = '10px';
    totalRow.innerHTML = `
        <div style="flex: 1; text-align: right;">
            <strong>Costo Total de Producción:</strong>
        </div>
        <div style="font-weight: bold;">
            S/${costoTotal.toFixed(2)}
        </div>
    `;
    lista.appendChild(totalRow);
}
      function eliminarIngrediente(index) {
    ingredientesPlatoActual.splice(index, 1);
    actualizarListaIngredientes();
}

        function guardarPlato() {
            const nombre = document.getElementById('nombrePlato').value;
            const tipo = document.getElementById('tipoPlato').value;
            const descripcion = document.getElementById('descripcionPlato').value;
            const precioVenta = parseFloat(document.getElementById('precioVenta').value);
            const margenDeseado = parseFloat(document.getElementById('margenDeseado').value);

            // Validación
            if (!nombre || !tipo || ingredientesPlatoActual.length === 0 || isNaN(precioVenta)) {
                mostrarAlerta('Por favor complete todos los campos y agregue ingredientes', 'error', 'alertasMenu');
                return;
            }

            // Calcular costo total de producción
            let costoProduccion = 0;
            ingredientesPlatoActual.forEach(ing => {
                costoProduccion += ing.costoTotal;
            });

            // Calcular margen real y ganancia
            const margenReal = ((precioVenta - costoProduccion) / costoProduccion) * 100;
            const ganancia = precioVenta - costoProduccion;

            // Crear objeto plato
            const nuevoPlato = {
                id: Date.now(),
                nombre,
                tipo,
                descripcion,
                precioVenta,
                margenDeseado: isNaN(margenDeseado) ? 0 : margenDeseado,
                costoProduccion,
                margenReal,
                ganancia,
                ingredientes: [...ingredientesPlatoActual],
                fechaCreacion: new Date().toLocaleDateString()
            };

            // Agregar al menú
            menu.push(nuevoPlato);

            // Actualizar tabla
            actualizarTablaMenu();

            // Mostrar mensaje de éxito
            mostrarAlerta('Plato guardado correctamente', 'success', 'alertasMenu');

            // Limpiar formulario
            limpiarFormularioMenu();
            actualizarSelectPlatosVenta();
            
        }

function actualizarTablaMenu() {
    const tbody = document.querySelector('#tablaMenu tbody');
    tbody.innerHTML = '';

    // Only show food items (exclude drinks/cocktails)
    const platosComida = menu.filter(item => 
        item.tipo === 'entrada' || 
        item.tipo === 'plato-principal' || 
        item.tipo === 'postre'
    );

    platosComida.forEach(plato => {
        let ingredientesHTML = '<ul style="margin: 0; padding-left: 20px;">';
        plato.ingredientes.forEach(ing => {
            ingredientesHTML += `<li>${ing.nombre}: ${ing.cantidad} ${ing.unidad}</li>`;
        });
        ingredientesHTML += '</ul>';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${plato.nombre}</td>
            <td>${plato.tipo}</td>
            <td>S/${plato.costoProduccion.toFixed(2)}</td>
            <td>S/${plato.precioVenta.toFixed(2)}</td>
            <td>${plato.margenReal.toFixed(2)}%</td>
            <td>S/${plato.ganancia.toFixed(2)}</td>
            <td>${ingredientesHTML}</td>
            <td>
                <button class="btn btn-secondary" onclick="editarPlato(${plato.id})">✏</button>
                <button class="btn btn-danger" onclick="eliminarPlato(${plato.id})">🗑</button>
            </td>
        `;
        tbody.appendChild(row);
    });
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



        // Inicialización al cargar la página
        
        document.addEventListener('DOMContentLoaded', function() {
    // Initialize all sections
    actualizarTablaInventario();
    actualizarTablaMenu();
    actualizarTablaBar();
    actualizarSelectIngredientes();
    actualizarSelectIngredientesBar();
    
    // Initialize suppliers and purchases
    actualizarTablaProveedores();
    actualizarDatalistProveedores();
    actualizarSelectProductosCompra();  // This will also trigger proveedores update
    actualizarSelectProveedoresCompras();
    
    // Initialize sales
    actualizarSelectPlatosVenta();
    document.getElementById('cantidadVenta').addEventListener('input', calcularTotalVenta);
    actualizarEstadisticasVentas();
    
    // Load sample data if empty
    if (proveedores.length === 0 || inventario.length === 0) {
        cargarDatosEjemplo();
    }
});

        
    // ========== FUNCIONES DE VENTAS ==========
function actualizarSelectPlatosVenta() {
    const select = document.getElementById('platoVenta');
    select.innerHTML = '<option value="">Seleccionar plato/bebida</option>';
    
    // Add food items (from Menu tab)
    const platosComida = menu.filter(item => 
        item.tipo === 'entrada' || 
        item.tipo === 'plato-principal' || 
        item.tipo === 'postre'
    );
    
    if (platosComida.length > 0) {
        // Add separator for food items
        const optgroupComida = document.createElement('optgroup');
        optgroupComida.label = "🍽 Platos";
        select.appendChild(optgroupComida);
        
        platosComida.forEach(plato => {
            const option = document.createElement('option');
            option.value = plato.id;
            option.textContent = `${plato.nombre} - S/${plato.precioVenta.toFixed(2)}`;
            optgroupComida.appendChild(option);
        });
    }
    
    // Add drink items (from Bar tab)
    const platosBar = menu.filter(item => 
        item.tipo === 'bebida' || 
        item.tipo === 'cocktail'
    );
    
    if (platosBar.length > 0) {
        // Add separator for drink items
        const optgroupBar = document.createElement('optgroup');
        optgroupBar.label = "🍸 Bebidas/Cócteles";
        select.appendChild(optgroupBar);
        
        platosBar.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.nombre} - S/${item.precioVenta.toFixed(2)}`;
            optgroupBar.appendChild(option);
        });
    }
    
    // Update price when selection changes
    select.addEventListener('change', function() {
        const selectedId = this.value;
        const platoSeleccionado = menu.find(p => p.id == selectedId);
        
        if (platoSeleccionado) {
            document.getElementById('precioUnitarioVenta').value = platoSeleccionado.precioVenta.toFixed(2);
            calcularTotalVenta();
        } else {
            document.getElementById('precioUnitarioVenta').value = '';
            document.getElementById('totalVenta').value = '';
        }
    });
}

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

function agregarVenta() {
    const platoId = document.getElementById('platoVenta').value;
    const cantidad = parseInt(document.getElementById('cantidadVenta').value);
    
    if (!platoId || isNaN(cantidad) || cantidad < 1) {
        mostrarAlerta('Seleccione un plato y cantidad válida', 'error', 'alertasVentas');
        return;
    }

    // Verificar y descontar inventario
    const inventarioActualizado = descontarInventario(platoId, cantidad);
    if (!inventarioActualizado) {
        return; // El error ya se mostró en descontarInventario()
    }

    const plato = menu.find(p => p.id == platoId);
    if (!plato) {
        mostrarAlerta('Error: Plato no encontrado', 'error', 'alertasVentas');
        return;
    }

    const precioUnitario = plato.precioVenta;
    const total = cantidad * precioUnitario;
    const fechaHora = new Date();

    const venta = {
        id: Date.now(),
        platoId: plato.id,
        platoNombre: plato.nombre,
        cantidad: cantidad,
        precioUnitario: precioUnitario,
        total: total,
        fechaHora: fechaHora
    };

    ventas.push(venta);
    actualizarTablaVentas();
    actualizarEstadisticasVentas();
    mostrarAlerta(`Venta registrada: ${cantidad} ${plato.nombre} - Total: S/${total.toFixed(2)}`, 'success', 'alertasVentas');
    limpiarVenta();
}

function actualizarTablaVentas() {
    const tbody = document.querySelector('#tablaVentas tbody');
    tbody.innerHTML = '';

    // Función para comparar fechas ignorando la hora
    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    const hoy = new Date();
    const ventasHoy = ventas.filter(v => isSameDay(new Date(v.fechaHora), hoy));
    
    if (ventasHoy.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="6" style="text-align:center;">No hay ventas registradas hoy</td>`;
        tbody.appendChild(row);
        return;
    }

    ventasHoy.forEach(venta => {
        const row = document.createElement('tr');
        // Formateamos la fecha para mostrarla mejor
        const fechaFormateada = new Date(venta.fechaHora).toLocaleString();
        
        row.innerHTML = `
            <td>${fechaFormateada}</td>
            <td>${venta.platoNombre}</td>
            <td>${venta.cantidad}</td>
            <td>S/${venta.precioUnitario.toFixed(2)}</td>
            <td>S/${venta.total.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger" onclick="eliminarVenta(${venta.id})">🗑</button>
            </td>
        `;
        tbody.appendChild(row);
    });
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
