<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lê o conteúdo atual do arquivo compras.json
    $jsonData = file_get_contents('compras.json');
    $compras = json_decode($jsonData, true);

    // Cria um novo registro de compra
    $novaCompra = [
        'fecha' => date('Y-m-d H:i:s'), // Data e hora atual
        'producto' => $_POST['productoCompra'],
        'proveedor' => $_POST['proveedorCompra'],
        'cantidad' => $_POST['cantidadCompra'],
        'precioUnitario' => $_POST['precioCompra'],
        'total' => $_POST['cantidadCompra'] * $_POST['precioCompra'] // Cálculo do total
    ];

    // Adiciona a nova compra ao array
    $compras[] = $novaCompra;

    // Salva o array atualizado de volta no arquivo compras.json
    file_put_contents('compras.json', json_encode($compras, JSON_PRETTY_PRINT));

    // Redireciona ou exibe uma mensagem de sucesso
    header('Location: compras.php'); // Redireciona para uma página de sucesso
    exit;
}
?>
