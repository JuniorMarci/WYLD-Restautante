 <link rel="stylesheet" href="Estilo.css">
 <?php include 'nav.php'; ?>
 
 
        <!-- VENTAS -->
<div id="ventas" class="section active">
    <h2>💰 Ventas</h2>
    
    <div class="stats-grid">
    <!-- Ventas Hoy -->
    <div class="stat-card">
        <h3>Ventas Hoy</h3>
        <div class="value" id="ventasHoy">S/0.00</div>
        <div class="profit">Ganancia: <span id="gananciaHoy">S/0.00</span></div>
    </div>
    
    <!-- Ventas Semana -->
    <div class="stat-card">
        <h3>Ventas Semana</h3>
        <div class="value" id="ventasSemana">S/0.00</div>
        <div class="profit">Ganancia: <span id="gananciaSemana">S/0.00</span></div>
    </div>
    
    <!-- Ventas Mes -->
    <div class="stat-card">
        <h3>Ventas Mes</h3>
        <div class="value" id="ventasMes">S/0.00</div>
        <div class="profit">Ganancia: <span id="gananciaMes">S/0.00</span></div>
    </div>
    
    <!-- Plato Más Vendido -->
    <div class="stat-card">
        <h3>Plato Más Vendido</h3>
        <div class="value" id="platoPopular">-</div>
        <div class="profit">Margen: <span id="margenPlatoPopular">-</span></div>
    </div>
</div>
    




<form action="salvar_ventas.php" method="POST">
    <div class="form-grid">
        <div class="form-group">
            <label>Plato:</label>
            <select id="platoVenta" name="platoVenta" required>
                <option value="">Seleccionar plato</option>
            </select>
        </div>
        <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" id="cantidadVenta" name="cantidadVenta" placeholder="1" min="1" value="1" required onchange="calcularTotalVenta()">
        </div>
        <div class="form-group">
            <label>Precio Unitario:</label>
            <input type="number" id="precioUnitarioVenta" name="precioUnitarioVenta" placeholder="0.00" step="0.01" readonly>
        </div>
        <div class="form-group">
            <label>Total:</label>
            <input type="number" id="totalVenta" name="totalVenta" placeholder="0.00" step="0.01" readonly>
        </div>
    </div>
    
    <button type="submit" class="btn">Agregar Venta</button>
</form>

    
     
    <h3>Ventas del Día</h3>
<?php
// Lê o conteúdo do arquivo JSON
$jsonData = file_get_contents('ventas.json');
$ventas = json_decode($jsonData, true);
?>

<div class="table-container">
    <table id="tablaVentas">
        <thead>
            <tr>
                <th>Fecha/Hora</th>
                <th>Plato</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Total</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($ventas as $index => $item): ?>
                <tr>
                    <td><?php echo htmlspecialchars($item['fechaHora']); ?></td>
                    <td><?php echo htmlspecialchars($item['plato']); ?></td>
                    <td><?php echo htmlspecialchars($item['cantidad']); ?></td>
                    <td><?php echo htmlspecialchars($item['precioUnitario']); ?></td>
                    <td><?php echo htmlspecialchars($item['total']); ?></td>
                    
                    
                    
                    
                   <td>
            <form method="POST" action="remover.php">
                <input type="hidden" name="index" value="<?php echo $index; ?>">
                <input type="hidden" name="file" value="ventas.json">
                <input type="hidden" name="redirect" value="ventas.php">
                <button type="button" class="btn btn-danger" onclick="confirmarRemocao(<?php echo $index; ?>)">🗑 Eliminar</button>
            </form>
					</td>
                    
                    
                    
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>



<script>


function actualizarSelectPlatosVenta() {
    const select = document.getElementById('platoVenta');
    select.innerHTML = '<option value="">Seleccionar plato/bebida</option>';
    
    
    if (platosComida.length > 0) {
        // Add separator for food items
        const optgroupComida = document.createElement('optgroup');
        optgroupComida.label = "🍽 Platos";
        select.appendChild(optgroupComida);
        
        platosComida.forEach(plato => {
            const option = document.createElement('option');
            option.value = plato.nombre;
            option.textContent = `${plato.nombre} - S/${plato.precioVenta.toFixed(2)}`;
            optgroupComida.appendChild(option);
        });
    }
    

    
    if (platosBar.length > 0) {
        // Add separator for drink items
        const optgroupBar = document.createElement('optgroup');
        optgroupBar.label = "🍸 Bebidas/Cócteles";
        select.appendChild(optgroupBar);
        
        platosBar.forEach(item => {
            const option = document.createElement('option');
            option.value = item.nombre;
            option.textContent = `${item.nombre} - S/${item.precioVenta.toFixed(2)}`;
            optgroupBar.appendChild(option);
        });
    }
    
    // Update price when selection changes
    select.addEventListener('change', function() {
        const selectedId = this.value;
        const platoSeleccionado = menu.find(p => p.nombre == selectedId);
        
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



function actualizarEstadisticasVentas() {
    const hoy = new Date().toLocaleDateString();
    
    // Ventas Hoy
    const ventasHoy = ventas.filter(v => new Date(v.fechaHora).toLocaleDateString() === hoy);
    const totalHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);
    const gananciaHoy = ventasHoy.reduce((sum, v) => {
        const plato = menu.find(p => p.nombre === v.plato);
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
        const plato = menu.find(p => p.nombre === v.plato);
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
        const plato = menu.find(p => p.nombre === v.plato);
        return sum + (plato ? v.cantidad * (plato.precioVenta - plato.costoProduccion) : 0);
    }, 0);
    
    document.getElementById('ventasMes').textContent = `S/${totalMes.toFixed(2)}`;
    document.getElementById('gananciaMes').textContent = `S/${gananciaMes.toFixed(2)}`;
    
    // Plato Más Vendido
    const platosCount = {};
    ventas.forEach(v => {
        platosCount[v.plato] = (platosCount[v.plato] || 0) + v.cantidad;       
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
        const platoPopular = menu.find(p => p.nombre == platoPopularId);
        document.getElementById('platoPopular').textContent = platoPopularId;
        document.getElementById('margenPlatoPopular').textContent = `${platoPopular.margenReal.toFixed(2)}%`;
    } else {
        document.getElementById('platoPopular').textContent = '-';
        document.getElementById('margenPlatoPopular').textContent = '-';
    }
}




<?php
// Lê os arquivos JSON
$menuJson = file_get_contents('menu.json');
$barJson = file_get_contents('bar.json');
$ventasJson = file_get_contents('ventas.json');

// Decodifica os JSON em arrays associativos
$menuArray = json_decode($menuJson, true);
$barArray = json_decode($barJson, true);
$ventasArray = json_decode($ventasJson, true);

// Combina os dois arrays em um único array
$menu = array_merge($barArray, $menuArray);

// Converte o array PHP de volta para JSON
$menuJsonOutput = json_encode($menu);
$menuArray = json_encode($menuArray);
$barArray = json_encode($barArray);
$ventasArray = json_encode($ventasArray);

// Exibe o código JavaScript
echo "let menu = $menuJsonOutput;";
echo "let platosComida = $menuArray;";
echo "let platosBar = $barArray;";
echo "let ventas = $ventasArray;";
?>



actualizarSelectPlatosVenta();
actualizarEstadisticasVentas();

</script>
