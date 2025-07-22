
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wyld Safari - Sistema de Gestión</title>
    <style>
    
    * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #2d4a22, #3e5a32);
    color: #333;
    min-height: 100vh;
}

.header {
    background: linear-gradient(135deg, #1a2e15, #2d4a22);
    color: white;
    padding: 20px 0;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.header h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.header p {
    font-size: 1.2em;
    opacity: 0.9;
}

.nav-container {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    padding: 15px 0;
    border-bottom: 1px solid rgba(255,255,255,0.2);
}

.nav-tabs {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.nav-tab {
    background: rgba(255,255,255,0.2);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    backdrop-filter: blur(10px);
}

.nav-tab:hover {
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
}

.nav-tab.active {
    background: linear-gradient(135deg, #4a7c59, #5a8f68);
    box-shadow: 0 4px 15px rgba(74,124,89,0.4);
}

.main-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 30px 20px;
}

.section {
    display: none;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    padding: 30px;
    margin-bottom: 30px;
    animation: fadeIn 0.5s ease-in-out;
}

.section.active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.section h2 {
    color: #2d4a22;
    font-size: 2em;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 3px solid #4a7c59;
}

/* FORM STYLES */
.form-grid {
    display: grid;
    gap: 20px;
    margin-bottom: 30px;
}

.form-group {
    display: flex;
    flex-direction: column;
    position: relative; /* Added for datalist positioning */
}

.form-group label {
    font-weight: 600;
    margin-bottom: 8px;
    color: #2d4a22;
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

/* DATALIST STYLES */
datalist {
    position: absolute;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 0 0 10px 10px;
    background: white;
    width: calc(100% - 2px);
    z-index: 1000;
    top: 100%;
    margin-top: -10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

datalist option {
    padding: 8px 12px;
    cursor: pointer;
    transition: background-color 0.2s;
}

datalist option:hover {
    background-color: #f5f5f5;
}

/* Highlight matching text in datalist options */
datalist option mark {
    background-color: #ffeb3b;
    color: #333;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #4a7c59;
    box-shadow: 0 0 0 3px rgba(74,124,89,0.1);
}

/* BUTTON STYLES */
.btn {
    background: linear-gradient(135deg, #4a7c59, #5a8f68);
    color: white;
    padding: 12px 30px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    margin: 10px 5px;
}

.btn:hover {
    background: linear-gradient(135deg, #5a8f68, #6ba177);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(74,124,89,0.3);
}

.btn-secondary {
    background: linear-gradient(135deg, #6c757d, #868e96);
}

.btn-secondary:hover {
    background: linear-gradient(135deg, #868e96, #adb5bd);
}

.btn-danger {
    background: linear-gradient(135deg, #dc3545, #e4606d);
}

.btn-danger:hover {
    background: linear-gradient(135deg, #e4606d, #ea868f);
}

/* TABLE STYLES */
.table-container {
    overflow-x: auto;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

table {
    width: 100%;
    border-collapse: collapse;
    background: white;
}

th {
    background: linear-gradient(135deg, #2d4a22, #4a7c59);
    color: white;
    padding: 15px;
    text-align: left;
    font-weight: 600;
}

td {
    padding: 12px 15px;
    border-bottom: 1px solid #e0e0e0;
}

tr:hover {
    background: #f8f9fa;
}

/* STATS CARD STYLES */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    border-radius: 15px;
    padding: 25px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
}

.stat-card h3 {
    color: #2d4a22;
    font-size: 1.2em;
    margin-bottom: 10px;
}

.stat-card .value {
    font-size: 2.5em;
    font-weight: 700;
    color: #4a7c59;
}

.stat-card .profit {
    margin-top: 8px;
    font-size: 0.9em;
    color: #4a7c59;
    font-weight: 500;
}

.stat-card .profit span {
    font-weight: 600;
}

/* SEARCH BAR STYLES */
.search-bar {
    margin-bottom: 20px;
}

.search-bar input {
    width: 100%;
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 25px;
    font-size: 16px;
    background: #f8f9fa;
}

/* ALERT STYLES */
.alert {
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    font-weight: 500;
}

.alert-success {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.alert-warning {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
}

/* INGREDIENT LIST STYLES */
.ingredient-list {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 15px;
    margin-bottom: 15px;
}

.ingredient-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
}

.ingredient-item:last-child {
    border-bottom: none;
}

/* REPORT STYLES */
.monthly-report {
    background: linear-gradient(135deg, #e8f5e8, #f0f8f0);
    border-radius: 15px;
    padding: 25px;
    margin-bottom: 20px;
}

/* RESPONSIVE STYLES */
@media (max-width: 768px) {
    .nav-tabs {
        flex-direction: column;
        align-items: center;
    }
    
    .nav-tab {
        width: 200px;
        text-align: center;
    }
    
    .main-container {
        padding: 20px 10px;
    }
    
    .section {
        padding: 20px;
    }

    /* Adjust datalist for mobile */
    datalist {
        width: 100%;
        max-height: 150px;
    }
}
    
    </style>
</head>
<body>
    <div class="header">
        <h1>🦁 Wyld Safari</h1>
        <p>Sistema de Gestión Restaurante</p>
    </div>
    
    <div class="nav-container">
        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showSection('inventario', event)">📦 Inventario</button>
            <button class="nav-tab" onclick="showSection('menu', event)">🍽 Menú</button>
             <button class="nav-tab" onclick="showSection('bar', event)">🍸 Bar</button> <!-- New tab -->
            <button class="nav-tab" onclick="showSection('ventas', event)">💰 Ventas</button>
            <button class="nav-tab" onclick="showSection('proveedores', event)">🏪 Proveedores</button>
            <button class="nav-tab" onclick="showSection('compras', event)">🛒 Compras</button>
            <button class="nav-tab" onclick="showSection('reportes', event)">📊 Reportes</button>
        </div>
    </div>
    
    <div class="main-container">
        <!-- INVENTARIO -->
<!-- INVENTARIO -->
<div id="inventario" class="section active">
    <h2>📦 Inventario de Materias Primas</h2>
    
    <div class="form-grid">
        <!-- Campos básicos del producto -->
        <div class="form-group">
            <label>Producto:</label>
            <input type="text" id="producto" placeholder="Nombre del producto" required>
        </div>
        <div class="form-group">
            <label>Categoría:</label>
            <select id="categoria" required>
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
            <select id="unidad" required>
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
            <input type="number" id="stockMinimo" placeholder="0" step="0.01" min="0" required>
        </div>

        <!-- PROVEEDOR 1 (Obligatorio) -->
        <h3 style="grid-column: span 4;">Proveedor Principal</h3>
        <div class="form-group">
            <label>Nombre:</label>
            <input type="text" id="proveedor1Nombre" list="proveedoresList" placeholder="Nombre proveedor" required>
            <datalist id="proveedoresList">
                <!-- Options will be populated by JavaScript -->
            </datalist>
        </div>
        <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" id="proveedor1Cantidad" placeholder="0" step="0.01" min="0.01" required>
        </div>
        <div class="form-group">
            <label>Precio Unitario (S/):</label>
            <input type="number" id="proveedor1Precio" placeholder="0.00" step="0.01" min="0.01" required>
        </div>
        <div class="form-group">
            <label>Fecha de Compra:</label>
            <input type="date" id="proveedor1Fecha" required>
        </div>

        <!-- PROVEEDOR 2 (Opcional) -->
        <h3 style="grid-column: span 4;">Proveedor Secundario</h3>
        <div class="form-group">
            <label>Nombre:</label>
            <input type="text" id="proveedor2Nombre" list="proveedoresList" placeholder="Nombre proveedor">
            <datalist id="proveedoresList">
                <!-- Same datalist as above (shared for all supplier inputs) -->
            </datalist>
        </div>
        <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" id="proveedor2Cantidad" placeholder="0" step="0.01" min="0">
        </div>
        <div class="form-group">
            <label>Precio Unitario (S/):</label>
            <input type="number" id="proveedor2Precio" placeholder="0.00" step="0.01" min="0">
        </div>
        <div class="form-group">
            <label>Fecha de Compra:</label>
            <input type="date" id="proveedor2Fecha">
        </div>

        <!-- PROVEEDOR 3 (Opcional) -->
        <h3 style="grid-column: span 4;">Proveedor Terciario</h3>
        <div class="form-group">
            <label>Nombre:</label>
            <input type="text" id="proveedor3Nombre" list="proveedoresList" placeholder="Nombre proveedor">
            <datalist id="proveedoresList">
                <!-- Same datalist as above (shared for all supplier inputs) -->
            </datalist>
        </div>
        <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" id="proveedor3Cantidad" placeholder="0" step="0.01" min="0">
        </div>
        <div class="form-group">
            <label>Precio Unitario (S/):</label>
            <input type="number" id="proveedor3Precio" placeholder="0.00" step="0.01" min="0">
        </div>
        <div class="form-group">
            <label>Fecha de Compra:</label>
            <input type="date" id="proveedor3Fecha">
        </div>
    </div>

    <button class="btn" onclick="agregarProducto()">➕ Agregar Producto</button>
    <button class="btn btn-secondary" onclick="limpiarFormularioInventario()">🧹 Limpiar</button>
    
    <div class="search-bar">
        <input type="text" id="buscarProducto" placeholder="🔍 Buscar productos..." onkeyup="buscarEnInventario()">
    </div>
    
    <div id="alertasInventario"></div>
    
    <div class="table-container">
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
            <tbody></tbody>
        </table>
    </div>
</div>
     
        <!-- MENU -->
        <div id="menu" class="section">
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
            
            <button class="btn" onclick="guardarPlato()">Guardar Plato</button>
            <button class="btn btn-secondary" onclick="limpiarFormularioMenu()">Limpiar</button>
            
            <div class="search-bar">
                <input type="text" id="buscarPlato" placeholder="🔍 Buscar platos..." onkeyup="buscarEnMenu()">
            </div>
            
            <div id="alertasMenu"></div>
            
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
                    <tbody></tbody>
                </table>
            </div>
        </div>
        <!-- BAR -->
<div id="bar" class="section">
    <h2>🍸 Bar</h2>
    
    <div class="form-grid">
        <div class="form-group">
            <label>Nombre del Bebida/Cóctel:</label>
            <input type="text" id="nombreBar" placeholder="Nombre de la bebida o cóctel">
        </div>
        <div class="form-group">
            <label>Tipo:</label>
            <select id="tipoBar">
                <option value="">Seleccionar tipo</option>
                <option value="bebida">Bebida</option>
                <option value="cocktail">Cóctel</option>
            </select>
        </div>
        <div class="form-group">
            <label>Descripción:</label>
            <textarea id="descripcionBar" placeholder="Descripción" rows="3"></textarea>
        </div>
        <div class="form-group">
            <label>Precio de Venta:</label>
            <input type="number" id="precioVentaBar" placeholder="0.00" step="0.01">
        </div>
        <div class="form-group">
            <label>Margen Deseado (%):</label>
            <input type="number" id="margenDeseadoBar" placeholder="0" step="0.01">
        </div>
    </div>
    
    <h3>Ingredientes</h3>
    <div class="form-grid">
        <div class="form-group">
            <label>Ingrediente:</label>
            <select id="ingredienteSelectBar">
                <option value="">Seleccionar ingrediente</option>
            </select>
        </div>
        <div class="form-group">
            <label>Cantidad Necesaria:</label>
            <input type="number" id="cantidadIngredienteBar" placeholder="0" step="0.01">
        </div>
        <div class="form-group">
            <label>Costo por Unidad:</label>
            <input type="number" id="costoIngredienteBar" placeholder="0.00" step="0.01" readonly>
        </div>
    </div>
    
    <button class="btn btn-secondary" onclick="agregarIngredienteBar()">Agregar Ingrediente</button>
    
    <div id="listaIngredientesBar" class="ingredient-list"></div>
    
    <button class="btn" onclick="guardarBar()">Guardar Bebida/Cóctel</button>
    <button class="btn btn-secondary" onclick="limpiarFormularioBar()">Limpiar</button>
    
    <div class="search-bar">
        <input type="text" id="buscarBar" placeholder="🔍 Buscar bebidas/cócteles..." onkeyup="buscarEnBar()">
    </div>
    
    <div id="alertasBar"></div>
    
    <div class="table-container">
        <table id="tablaBar">
            <thead>
                <tr>
                    <th>Bebida/Cóctel</th>
                    <th>Tipo</th>
                    <th>Costo Producción</th>
                    <th>Precio Venta</th>
                    <th>Margen Real</th>
                    <th>Ganancia</th>
                    <th>Ingredientes</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>
        <!-- VENTAS -->
<div id="ventas" class="section">
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
    
    <div class="form-grid">
        <div class="form-group">
            <label>Plato:</label>
            <select id="platoVenta">
                <option value="">Seleccionar plato</option>
            </select>
        </div>
        <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" id="cantidadVenta" placeholder="1" min="1" value="1">
        </div>
        <div class="form-group">
            <label>Precio Unitario:</label>
            <input type="number" id="precioUnitarioVenta" placeholder="0.00" step="0.01" readonly>
        </div>
        <div class="form-group">
            <label>Total:</label>
            <input type="number" id="totalVenta" placeholder="0.00" step="0.01" readonly>
        </div>
    </div>
    
    <button class="btn" onclick="agregarVenta()">Agregar Venta</button>
    <button class="btn btn-secondary" onclick="limpiarVenta()">Limpiar</button>
    
    <div id="alertasVentas"></div>
    
    <h3>Ventas del Día</h3>
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
            <tbody></tbody>
        </table>
    </div>
</div>
        
        <!-- PROVEEDORES -->
        
        <div id="proveedores" class="section">
    <h2>🏪 Proveedores</h2>
    
    <button class="btn" onclick="mostrarFormularioProveedor()">➕ Agregar Proveedor</button>
    
    <div id="formularioProveedor" style="display: none; margin-top: 20px;">
        <div class="form-grid">
            <div class="form-group">
                <label>Nombre:</label>
                <input type="text" id="nuevoProveedorNombre" placeholder="Nombre del proveedor">
            </div>
            <div class="form-group">
                <label>Contacto:</label>
                <input type="text" id="nuevoProveedorContacto" placeholder="Persona de contacto">
            </div>
            <div class="form-group">
                <label>Teléfono:</label>
                <input type="text" id="nuevoProveedorTelefono" placeholder="Número de teléfono">
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="nuevoProveedorEmail" placeholder="Correo electrónico">
            </div>
        </div>
        <button class="btn" onclick="agregarProveedor()">💾 Guardar Proveedor</button>
        <button class="btn btn-secondary" onclick="ocultarFormularioProveedor()">❌ Cancelar</button>
    </div>
    
    <div class="search-bar">
        <input type="text" id="buscarProveedor" placeholder="🔍 Buscar proveedores..." onkeyup="buscarProveedores()">
    </div>
    
    <div id="alertasProveedores"></div>
    
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
            <tbody></tbody>
        </table>
    </div>
</div>
        <!-- COMPRAS -->
<div id="compras" class="section">
    <h2>🛒 Compras a Proveedores</h2>
    
    <div class="form-grid">
        <div class="form-group">
            <label>Producto:</label>
            <select id="productoCompra" onchange="actualizarProveedoresProducto()">
                <option value="">Seleccionar producto</option>
                <!-- Se llena con JS -->
            </select>
        </div>
        <div class="form-group">
            <label>Proveedor:</label>
            <select id="proveedorCompra">
                <option value="">Seleccionar proveedor</option>
                <!-- Se llena dinámicamente -->
            </select>
        </div>
        <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" id="cantidadCompra" placeholder="0" step="0.01" min="0.01">
        </div>
        <div class="form-group">
            <label>Precio Unitario (S/):</label>
            <input type="number" id="precioCompra" placeholder="0.00" step="0.01" min="0.01">
        </div>
    </div>
    
    <button class="btn" onclick="registrarCompra()">💾 Registrar Compra</button>
    <button class="btn btn-secondary" onclick="limpiarCompra()">🧹 Limpiar</button>
    
    <div id="alertasCompras"></div>
    
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
            <tbody></tbody>
        </table>
    </div>
</div>
        <!-- REPORTES -->
        <div id="reportes" class="section">
            <h2>📊 Reportes</h2>
            <div class="alert alert-warning">
                Sección de reportes en desarrollo. Próximamente...
            </div>
        </div>
    </div>

    
<!---
<script src="acciones.js"></script>
!--->

 <?php include 'acciones.php'; ?>
    
</body>
</html>

