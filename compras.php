  <link rel="stylesheet" href="Estilo.css">
 <?php include 'nav.php'; ?>
 
 
 
        <!-- COMPRAS -->
<div id="compras" class="section active">
    <h2>🛒 Compras a Proveedores</h2>
    
																																<form method="POST" action="salvar_compras.php">
    <div class="form-grid">
        <?php
        // Lê o conteúdo do arquivo inventario.json
        $jsonDataInventario = file_get_contents('inventario.json');
        $inventario = json_decode($jsonDataInventario, true);

        // Lê o conteúdo do arquivo proveedores.json
        $jsonDataProveedores = file_get_contents('proveedores.json');
        $proveedores = json_decode($jsonDataProveedores, true);
        ?>

        <div class="form-group">
            <label>Producto:</label>
            <select name="productoCompra" id="productoCompra" onchange="actualizarProveedoresProducto()">
                <option value="">Seleccionar producto</option>
                <?php foreach ($inventario as $item): ?>
                    <option value="<?php echo htmlspecialchars($item['producto']); ?>">
                        <?php echo htmlspecialchars($item['producto']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="form-group">
            <label>Proveedor:</label>
            <select name="proveedorCompra" id="proveedorCompra">
                <option value="">Seleccionar proveedor</option>
                <?php foreach ($proveedores as $item): ?>
                    <option value="<?php echo htmlspecialchars($item['nombre']); ?>">
                        <?php echo htmlspecialchars($item['nombre']); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>

        <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" name="cantidadCompra" id="cantidadCompra" placeholder="0" step="0.01" min="0.01" required>
        </div>
        <div class="form-group">
            <label>Precio Unitario (S/):</label>
            <input type="number" name="precioCompra" id="precioCompra" placeholder="0.00" step="0.01" min="0.01" required>
        </div>
    </div>
    
    <button type="submit" class="btn">💾 Registrar Compra</button>
																																		</form>	

    
    
    <button class="btn btn-secondary" onclick="limpiarCompra()">🧹 Limpiar</button>
    
    <div id="alertasCompras"></div>
    
<?php
// Lê o conteúdo do arquivo JSON
$jsonData = file_get_contents('compras.json');
$compras = json_decode($jsonData, true);
?>

<div class="table-container">
    <table id="tablaCompras">
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Proveedor</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Total</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($compras as $index => $item): ?>
                <tr>
                    <td><?php echo htmlspecialchars($item['fecha']); ?></td>
                    <td><?php echo htmlspecialchars($item['producto']); ?></td>
                    <td><?php echo htmlspecialchars($item['proveedor']); ?></td>
                    <td><?php echo htmlspecialchars($item['cantidad']); ?></td>
                    <td><?php echo htmlspecialchars($item['precioUnitario']); ?></td>
                    <td><?php echo htmlspecialchars($item['total']); ?></td>
                    
                    <td>
            <form method="POST" action="remover.php">
                <input type="hidden" name="index" value="<?php echo $index; ?>">
                <input type="hidden" name="file" value="compras.json">
                <input type="hidden" name="redirect" value="compras.php">
                <button type="button" class="btn btn-danger" onclick="confirmarRemocao(<?php echo $index; ?>)">🗑 Eliminar</button>
            </form>
					</td>
                    
                    
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

        
