<?php
// Define o caminho do arquivo JSON
$jsonFile = 'proveedores.json';

// Verifica se o arquivo JSON existe
if (file_exists($jsonFile)) {
    // Lê o conteúdo do arquivo JSON
    $data = file_get_contents($jsonFile);
    // Decodifica o JSON em um array associativo
    $proveedores = json_decode($data, true);
} else {
    // Se o arquivo não existir, inicializa um array vazio
    $proveedores = [];
}

// Cria um novo fornecedor a partir dos dados do formulário
$nuevoProveedor = [
    'id' => count($proveedores) + 1, // Gera um novo ID
    'nombre' => $_POST['nombre'],
    'contacto' => $_POST['contacto'],
    'telefono' => $_POST['telefono'],
    'email' => $_POST['email'],
    'productos' => [] // Inicializa a lista de produtos como vazia
];

// Adiciona o novo fornecedor ao array
$proveedores[] = $nuevoProveedor;

// Codifica o array de volta para JSON
$jsonData = json_encode($proveedores, JSON_PRETTY_PRINT);

// Salva o JSON atualizado de volta no arquivo
file_put_contents($jsonFile, $jsonData);

// Redireciona ou exibe uma mensagem de sucesso
echo "Fornecedor salvo com sucesso!";
print_r ($nuevoProveedor);

// Redireciona ou exibe uma mensagem de sucesso
    header('Location: proveedores.php'); // Redireciona para uma página de sucesso
    exit;


?>
