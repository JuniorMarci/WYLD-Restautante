 <link rel="stylesheet" href="Estilo.css">
 <?php include 'nav.php'; ?>
 
 
        <!-- PROVEEDORES -->
<div id="proveedores" class="section active">
    <h2>🏪 Proveedores</h2>
    
    <button class="btn" onclick="mostrarFormularioProveedor()">➕ Agregar Proveedor</button>
    
<div id="formularioProveedor" style="display: none; margin-top: 20px;">
    <form action="salvar_proveedores.php" method="POST">
        <div class="form-grid">
            <div class="form-group">
                <label for="nuevoProveedorNombre">Nombre:</label>
                <input type="text" id="nuevoProveedorNombre" name="nombre" placeholder="Nombre del proveedor" required>
            </div>
            <div class="form-group">
                <label for="nuevoProveedorContacto">Contacto:</label>
                <input type="text" id="nuevoProveedorContacto" name="contacto" placeholder="Persona de contacto" required>
            </div>
            <div class="form-group">
                <label for="nuevoProveedorTelefono">Teléfono:</label>
                <input type="text" id="nuevoProveedorTelefono" name="telefono" placeholder="Número de teléfono" required>
            </div>
            <div class="form-group">
                <label for="nuevoProveedorEmail">Email:</label>
                <input type="email" id="nuevoProveedorEmail" name="email" placeholder="Correo electrónico" required>
            </div>
        </div>
        <button type="submit" class="btn">💾 Guardar Proveedor</button>
        <button class="btn btn-secondary" onclick="ocultarFormularioProveedor()">❌ Cancelar</button>
    </form>
</div>

    
    <div class="search-bar">
        <input type="text" id="buscarProveedor" placeholder="🔍 Buscar proveedores..." onkeyup="buscarProveedores()">
    </div>
    
    <div id="alertasProveedores"></div>
    
<?php
// Lê o conteúdo do arquivo JSON
$jsonData = file_get_contents('proveedores.json');
$proveedores = json_decode($jsonData, true);
?>

<div class="table-container">
    <table id="tablaProveedores">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Productos</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($proveedores as $index => $item): ?>
                <tr>
                    <td><?php echo htmlspecialchars($item['id']); ?></td>
                    <td><?php echo htmlspecialchars($item['nombre']); ?></td>
                    <td><?php echo htmlspecialchars($item['contacto']); ?></td>
                    <td><?php echo htmlspecialchars($item['telefono']); ?></td>
                    <td><?php echo htmlspecialchars($item['email']); ?></td>
                    <td><?php echo htmlspecialchars(implode(", ", $item['productos'])); ?></td>
                    
                    
                    <td>
            <form method="POST" action="remover.php">
                <input type="hidden" name="index" value="<?php echo $index; ?>">
                <input type="hidden" name="file" value="proveedores.json">
                <input type="hidden" name="redirect" value="proveedores.php">
                <button type="button" class="btn btn-danger" onclick="confirmarRemocao(<?php echo $index; ?>)">🗑 Eliminar</button>
            </form>
					</td>
                    
                    
                    
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

        
        
