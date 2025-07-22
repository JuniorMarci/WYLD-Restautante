<?php
// guardarDatos.php

$input = json_decode(file_get_contents('php://input'), true);

$archivo = $input['archivo'];
$datos = $input['datos'];


// Verificar se datos é JSON e decodificar se necessário
if (json_decode($datos) !== null) {
    $datos = json_decode($datos, true); // true para array associativo
    // Se quiser salvar como JSON formatado:
    $datos = json_encode($datos, JSON_PRETTY_PRINT);
}

if (isset($archivo) && isset($datos)) {
    $resultado = file_put_contents($archivo, $datos);
    
    if ($resultado !== false) {
        echo "Dados salvos com sucesso no arquivo $archivo";
    } else {
        echo "Erro ao salvar os dados no arquivo";
    }
} else {
    echo "Dados incompletos recebidos do cliente";
}


print_r ($datos);
?>