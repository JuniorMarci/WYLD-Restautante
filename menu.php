 <link rel="stylesheet" href="Estilo.css">
 <?php include 'nav.php'; ?>
 
 
 
 

 
 
 <!-- MENU -->
        <div id="menu" class="section active">
            <h2>🍽 Menú y Costos</h2>
            
            <div class="form-grid">
                <div class="form-group">
                    <label>Nombre del Plato:</label>
                    <input type="text" id="nombrePlato" placeholder="Nombre del plato">
                </div>
                <div class="form-group">
                    <label>Tipo:</label>
                    
                    <select id="tipoPlato">
    <option value="">Seleccionar tipo</option>
    <option value="entrada">Entrada</option>
    <option value="plato-principal">Plato Principal</option>
    <option value="postre">Postre</option>
    <!-- Removed bebida and cocktail options -->
</select>
                </div>
                <div class="form-group">
                    <label>Descripción:</label>
                    <textarea id="descripcionPlato" placeholder="Descripción del plato" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label>Precio de Venta:</label>
                    <input type="number" id="precioVenta" placeholder="0.00" step="0.01">
                </div>
                <div class="form-group">
                    <label>Margen Deseado (%):</label>
                    <input type="number" id="margenDeseado" placeholder="0" step="0.01">
                </div>
            </div>
            
            <h3>Ingredientes del Plato</h3>
            <div class="form-grid">
                <div class="form-group">
                    <label>Ingrediente:</label>
                    <select id="ingredienteSelect">
                        <option value="">Seleccionar ingrediente</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Cantidad Necesaria:</label>
                    <input type="number" id="cantidadIngrediente" placeholder="0" step="0.01">
                </div>
                <div class="form-group">
                    <label>Costo por Unidad:</label>
                    <input type="number" id="costoIngrediente" placeholder="0.00" step="0.01" readonly>
                </div>
            </div>
            
            <button class="btn btn-secondary" onclick="agregarIngrediente()">Agregar Ingrediente</button>
            
            <div id="listaIngredientes" class="ingredient-list"></div>
            
            
            
                   
            
            
            
            
            <form action="salvar_menu.php" method="post" onsubmit="return guardarPlato();">
    <input type="hidden" name="platosComida" id="platosComida" value="">
    <button type="submit" class="btn">Guardar Plato</button>
</form>
            
            
            
            
            
            
            
            <button class="btn btn-secondary" onclick="limpiarFormularioMenu()">Limpiar</button>
            
            <div class="search-bar">
                <input type="text" id="buscarPlato" placeholder="🔍 Buscar platos..." onkeyup="buscarEnMenu()">
            </div>
            
            <div id="alertasMenu"></div>
            
            
            
            
<?php
// Lê o conteúdo do arquivo JSON
$jsonData = file_get_contents('menu.json');

// Decodifica o JSON em um array associativo
$menuItems = json_decode($jsonData, true);
?>

<div class="table-container">
    <table id="tablaMenu">
        <thead>
            <tr>
                <th>Plato</th>
                <th>Tipo</th>
                <th>Costo Producción</th>
                <th>Precio Venta</th>
                <th>Margen Real</th>
                <th>Ganancia</th>
                <th>Ingredientes</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($menuItems as $index => $item): ?>
                <tr>
                    <td><?php echo htmlspecialchars($item['plato'] ?? $item['nombre']); ?></td>
                    <td><?php echo htmlspecialchars($item['tipo']); ?></td>
                    <td><?php echo htmlspecialchars($item['costoProduccion']); ?></td>
                    <td><?php echo htmlspecialchars($item['precioVenta']); ?></td>
                    <td><?php echo htmlspecialchars($item['margenReal']); ?></td>
                    <td><?php echo htmlspecialchars($item['ganancia']); ?></td>
                    <td>
                        <?php
                        // Exibe os ingredientes
                        if (isset($item['ingredientes'])) {
                            if (is_array($item['ingredientes'][0])) {
                                // Se os ingredientes são objetos
                                $ingredientes = array_map(function($ingrediente) {
                                    return htmlspecialchars($ingrediente['nombre']) . " (" . htmlspecialchars($ingrediente['cantidad']) . " " . htmlspecialchars($ingrediente['unidad']) . ")";
                                }, $item['ingredientes']);
                                echo implode(", ", $ingredientes);
                            } else {
                                // Se os ingredientes são strings
                                echo implode(", ", array_map('htmlspecialchars', $item['ingredientes']));
                            }
                        }
                        ?>
                    </td>


                    <td>
            <form method="POST" action="remover.php">
                <input type="hidden" name="index" value="<?php echo $index; ?>">
                <input type="hidden" name="file" value="menu.json">
                <input type="hidden" name="redirect" value="menu.php">
                <button type="button" class="btn btn-danger" onclick="confirmarRemocao(<?php echo $index; ?>)">🗑 Eliminar</button>
            </form>
					</td>


                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

            

            
            
            
            
            
    
    <script>
    
    // VARIAVEIS
    
    
    
    
            // Gera a estrutura de inventario em JavaScript
			// Lê o conteúdo do arquivo JSON
			<?php
			$jsonData = file_get_contents('inventario.json');
			$inventario = json_decode($jsonData, true);
			?>
        let inventario = <?php echo json_encode($inventario); ?>;
    
    
    
   
     
     
     
     
        
        let menu = [];
        let ingredientesPlatoActual = [];
        
        
    
    
    
    
    
    
    
    
    
    function padronizarProdutos(produtos) {
    return produtos.map((produto, index) => ({
        id: index + 1, // Atribui um ID sequencial
        producto: produto.producto,
        categoria: produto.categoria,
        unidad: "unidade", // Defina a unidade conforme necessário
        proveedores: produto.proveedores.map((fornecedor, fornecedorIndex) => ({
            proveedorId: fornecedorIndex + 1, // Atribui um ID sequencial para fornecedores
            nombre: fornecedor.nome,
            cantidad: fornecedor.quantidade,
            precioUnitario: fornecedor.preco,
            fechaCompra: "2023-05-01" // Defina a data de compra conforme necessário
        })),
        stockMinimo: 10 // Defina o valor mínimo de estoque conforme necessário
    }));
}
    
    inventario = padronizarProdutos(inventario);
    
    
    
    
    
    
    
    
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
    
    
    
    
    document.getElementById('platosComida').value = JSON.stringify(platosComida);
    
    console.log(JSON.stringify(platosComida));

    // Retorne true para permitir o envio do formulário
    return true;
    
    
}
    
    
    actualizarSelectIngredientes();
    
    </script>        
            
            
            
            
            
            

            
  
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
