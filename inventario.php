 <link rel="stylesheet" href="Estilo.css">
 <?php include 'nav.php'; ?>

        
<!-- INVENTARIO -->
<div id="inventario" class="section active">
    <h2>📦 Inventario de Materias Primas</h2>
    
<form method="post" action="salvar_inventario.php">
    <div class="form-grid">
        <!-- Campos básicos del producto -->
        <div class="form-group">
            <label>Producto:</label>
            <input type="text" id="producto" name="producto" placeholder="Nombre del producto" required>
        </div>
        <div class="form-group">
            <label>Categoría:</label>
            <select id="categoria" name="categoria" required>
                <option value="">Seleccionar categoría</option>
                <option value="carnes">Carnes</option>
                <option value="vegetales">Vegetales</option>
                <option value="lacteos">Lácteos</option>
                <option value="cereales">Cereales</option>
                <option value="bebidas">Bebidas</option>
                <option value="condimentos">Condimentos</option>
                <option value="otros">Otros</option>
            </select>
        </div>
        <div class="form-group">
            <label>Unidad:</label>
            <select id="unidad" name="unidad" required>
                <option value="">Seleccionar unidad</option>
                <option value="kg">Kilogramos</option>
                <option value="g">Gramos</option>
                <option value="l">Litros</option>
                <option value="ml">Mililitros</option>
                <option value="piezas">Piezas</option>
                <option value="paquetes">Paquetes</option>
            </select>
        </div>
        <div class="form-group">
            <label>Stock Mínimo:</label>
            <input type="number" id="stockMinimo" name="stockMinimo" placeholder="0" step="0.01" min="0" required>
        </div>

        <!-- PROVEEDOR 1 (Obligatorio) -->
        <h3 style="grid-column: span 4;">Proveedor Principal</h3>
        <div class="form-group">
            <label>Nombre:</label>
            <input type="text" id="proveedor1Nombre" name="proveedor1Nombre" list="proveedoresList" placeholder="Nombre proveedor" required>
            <datalist id="proveedoresList">
                <!-- Options will be populated by JavaScript, ou manualmente -->
            </datalist>
        </div>
        <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" id="proveedor1Cantidad" name="proveedor1Cantidad" placeholder="0" step="0.01" min="0.01" required>
        </div>
        <div class="form-group">
            <label>Precio Unitario (S/):</label>
            <input type="number" id="proveedor1Precio" name="proveedor1Precio" placeholder="0.00" step="0.01" min="0.01" required>
        </div>
        <div class="form-group">
            <label>Fecha de Compra:</label>
            <input type="date" id="proveedor1Fecha" name="proveedor1Fecha" required>
        </div>

        <!-- PROVEEDOR 2 (Opcional) -->
        <h3 style="grid-column: span 4;">Proveedor Secundario</h3>
        <div class="form-group">
            <label>Nombre:</label>
            <input type="text" id="proveedor2Nombre" name="proveedor2Nombre" list="proveedoresList" placeholder="Nombre proveedor">
        </div>
        <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" id="proveedor2Cantidad" name="proveedor2Cantidad" placeholder="0" step="0.01" min="0">
        </div>
        <div class="form-group">
            <label>Precio Unitario (S/):</label>
            <input type="number" id="proveedor2Precio" name="proveedor2Precio" placeholder="0.00" step="0.01" min="0">
        </div>
        <div class="form-group">
            <label>Fecha de Compra:</label>
            <input type="date" id="proveedor2Fecha" name="proveedor2Fecha">
        </div>

        <!-- PROVEEDOR 3 (Opcional) -->
        <h3 style="grid-column: span 4;">Proveedor Terciario</h3>
        <div class="form-group">
            <label>Nombre:</label>
            <input type="text" id="proveedor3Nombre" name="proveedor3Nombre" list="proveedoresList" placeholder="Nombre proveedor">
        </div>
        <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" id="proveedor3Cantidad" name="proveedor3Cantidad" placeholder="0" step="0.01" min="0">
        </div>
        <div class="form-group">
            <label>Precio Unitario (S/):</label>
            <input type="number" id="proveedor3Precio" name="proveedor3Precio" placeholder="0.00" step="0.01" min="0">
        </div>
        <div class="form-group">
            <label>Fecha de Compra:</label>
            <input type="date" id="proveedor3Fecha" name="proveedor3Fecha">
        </div>
    </div>

    <button class="btn" type="submit">➕ Agregar Producto</button>
</form>


    <button class="btn btn-secondary" onclick="limpiarFormularioInventario()">🧹 Limpiar</button>
    
    <div class="search-bar">
        <input type="text" id="buscarProducto" placeholder="🔍 Buscar productos..." onkeyup="buscarEnInventario()">
    </div>
    
    <div id="alertasInventario"></div>
    
<?php
// Ler o arquivo JSON
$jsonFile = file_get_contents('inventario.json');
$inventario = json_decode($jsonFile, true);
?>

<table id="tablaInventario">
    <thead>
        <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Proveedor 1 (Cant/Precio)</th>
            <th>Proveedor 2 (Cant/Precio)</th>
            <th>Proveedor 3 (Cant/Precio)</th>
            <th>Precio Promedio</th>
            <th>Total Stock</th>
            <th>Valor Total</th>
            <th>Stock</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($inventario as $index => $item): ?>
            <tr>
                <td><?php echo htmlspecialchars($item['producto']); ?></td>
                <td><?php echo htmlspecialchars($item['categoria']); ?></td>
                <td><?php echo htmlspecialchars($item['proveedores'][0]); ?></td>
                <td><?php echo htmlspecialchars($item['proveedores'][1]); ?></td>
                <td><?php echo htmlspecialchars($item['proveedores'][2]); ?></td>
                <td><?php echo htmlspecialchars($item['precioPromedio']); ?></td>
                <td><?php echo htmlspecialchars($item['totalStock']); ?></td>
                <td><?php echo htmlspecialchars($item['valorTotal']); ?></td>
                <td><?php echo htmlspecialchars($item['stock']); ?></td>
                
                
                                    <td>
            <form method="POST" action="remover.php">
                <input type="hidden" name="index" value="<?php echo $index; ?>">
                <input type="hidden" name="file" value="inventario.json">
                <input type="hidden" name="redirect" value="inventario.php">
                <button type="button" class="btn btn-danger" onclick="confirmarRemocao(<?php echo $index; ?>)">🗑 Eliminar</button>
            </form>
					</td>
                
                
                
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>

</div>

    
