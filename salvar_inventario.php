<?php

// Função para limpar e converter valores numéricos
function limpiarNumero($num) {
    return is_numeric($num) ? floatval($num) : 0;
}

// Caminho do arquivo JSON
$arquivo = 'inventario.json';

// Lê o inventário atual
$dadosExistentes = file_exists($arquivo) ? json_decode(file_get_contents($arquivo), true) : [];

// Recebe dados do POST
$producto = $_POST['producto'];
$categoria = $_POST['categoria'];
$unidad = $_POST['unidad'];
$stockMinimo = limpiarNumero($_POST['stockMinimo']);

$proveedores = [];

for ($i = 1; $i <= 3; $i++) {
    $nombre = $_POST["proveedor{$i}Nombre"] ?? '';
    $cantidad = limpiarNumero($_POST["proveedor{$i}Cantidad"] ?? 0);
    $precio = limpiarNumero($_POST["proveedor{$i}Precio"] ?? 0);

    if (!empty($nombre) && $cantidad > 0 && $precio > 0) {
        $proveedores[] = [
            'nome' => $nombre,
            'quantidade' => $cantidad,
            'preco' => $precio
        ];
    }
}

// Cálculos
$totalStock = 0;
$valorTotal = 0;

foreach ($proveedores as $prov) {
    $totalStock += $prov['quantidade'];
    $valorTotal += $prov['quantidade'] * $prov['preco'];
}

$precioPromedio = $totalStock > 0 ? $valorTotal / $totalStock : 0;

// Formatar provedores no novo estilo
$provedoresFormatados = [];
foreach ($proveedores as $prov) {
    $provedoresFormatados[] = sprintf(
        "%.2f %s @ S/%.2f (%s)", 
        $prov['quantidade'], 
        $unidad, 
        $prov['preco'], 
        $prov['nome']
    );
}

// Preencher provedores não utilizados com "-"
while (count($provedoresFormatados) < 3) {
    $provedoresFormatados[] = '-';
}

// Status do estoque com nova lógica
if ($totalStock < $stockMinimo) {
    $stockStatus = '⚠ Bajo stock';
} elseif ($totalStock >= $stockMinimo) {
    $stockStatus = '✅ Suficiente';
} else {
    $stockStatus = 'Sin definir';
}

// Monta novo item
$novoProduto = [
    'producto' => $producto,
    'categoria' => $categoria,
    'proveedores' => $provedoresFormatados,
    'precioPromedio' => 'S/' . number_format($precioPromedio, 2),
    'totalStock' => number_format($totalStock, 2) . ' ' . $unidad,
    'valorTotal' => 'S/' . number_format($valorTotal, 2),
    'stock' => $stockStatus
];

// Adiciona ao array existente
$dadosExistentes[] = $novoProduto;

// Salva de volta no arquivo
file_put_contents($arquivo, json_encode($dadosExistentes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Redireciona ou exibe uma mensagem de sucesso
header('Location: inventario.php');
exit;
?>
