<?php
// Define o caminho do arquivo JSON
$filePath = 'ventas.json';

// Verifica se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtém os dados do formulário
    $plato = $_POST['platoVenta'];
    $cantidad = (int)$_POST['cantidadVenta'];
    $precioUnitario = (float)$_POST['precioUnitarioVenta'];
    $total = $cantidad * $precioUnitario;
    $fechaHora = date('Y-m-d H:i'); // Obtém a data e hora atual

    // Cria um array com os dados da venda
    $venta = [
        'fechaHora' => $fechaHora,
        'plato' => $plato,
        'cantidad' => $cantidad,
        'precioUnitario' => $precioUnitario,
        'total' => $total
    ];

    // Verifica se o arquivo JSON já existe
    if (file_exists($filePath)) {
        // Lê o conteúdo existente do arquivo
        $currentData = json_decode(file_get_contents($filePath), true);
    } else {
        // Se o arquivo não existir, inicializa um array vazio
        $currentData = [];
    }

    // Adiciona a nova venda ao array existente
    $currentData[] = $venta;

    // Salva o array atualizado de volta no arquivo JSON
    file_put_contents($filePath, json_encode($currentData, JSON_PRETTY_PRINT));

    // Redireciona ou exibe uma mensagem de sucesso
    echo "Venda salva com sucesso!";
    //print_r $venta;
    
    // Redireciona ou exibe uma mensagem de sucesso
    header('Location: ventas.php'); // Redireciona para uma página de sucesso
    exit;
}
?>
