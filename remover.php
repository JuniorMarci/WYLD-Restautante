<?php

function remover($indice, $nomeArquivo, $paginaRedirecionamento) {
    // Verificar se o arquivo existe
    if (!file_exists($nomeArquivo)) {
        return "Arquivo não encontrado.";
    }

    // Carregar o conteúdo do arquivo JSON
    $json = file_get_contents($nomeArquivo);
    $proveedores = json_decode($json, true);

    // Verificar se o índice é válido
    if (!isset($proveedores[$indice])) {
        return "Índice inválido.";
    }

    // Remover o item do array
    unset($proveedores[$indice]);

    // Reindexar o array
    $proveedores = array_values($proveedores);

    // Salvar o novo array no arquivo JSON
    file_put_contents($nomeArquivo, json_encode($proveedores, JSON_PRETTY_PRINT));

    return "Item removido com sucesso.";
}

// Verificar se a requisição é POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obter os dados do formulário
    $indice = isset($_POST['index']) ? intval($_POST['index']) : null;
    $nomeArquivo = isset($_POST['file']) ? $_POST['file'] : 'proveedores.json';
    $paginaRedirecionamento = isset($_POST['redirect']) ? $_POST['redirect'] : 'sua_pagina.php';

    // Chamar a função remover
    $resultado = remover($indice, $nomeArquivo, $paginaRedirecionamento);

    // Redirecionar ou exibir mensagem
    header('Location: ' . $paginaRedirecionamento . '?mensagem=' . urlencode($resultado));
    exit;
}
?>
