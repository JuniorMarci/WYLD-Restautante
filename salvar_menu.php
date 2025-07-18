<?php
// Verifica se a requisição é do tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtém o JSON enviado
    $platosComida = $_POST['platosComida'];

    // Decodifica o JSON para um array associativo
    $platosArray = json_decode($platosComida, true);

	echo ">>>>";
	print_r($platosArray);

    // Caminho do arquivo JSON
    $filePath = 'menu.json';

    // Lê o conteúdo atual do arquivo JSON
    if (file_exists($filePath)) {
        $currentData = json_decode(file_get_contents($filePath), true);
    } else {
        $currentData = [];
    }

    // Adiciona os novos pratos ao array existente
    $currentData = array_merge($currentData, $platosArray);

    // Salva o novo conteúdo de volta no arquivo JSON
    file_put_contents($filePath, json_encode($currentData, JSON_PRETTY_PRINT));

    // Retorna uma resposta (opcional)
    echo json_encode(['status' => 'success', 'message' => 'Menu atualizado com sucesso.']);
} else {
    // Retorna um erro se não for uma requisição POST
    echo json_encode(['status' => 'error', 'message' => 'Método não permitido.']);
}


    // Redireciona ou exibe uma mensagem de sucesso
    header('Location: menu.php'); // Redireciona para uma página de sucesso
    exit;


?>
