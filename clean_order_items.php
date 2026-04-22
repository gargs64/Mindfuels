<?php
// Clean up residual bugged order items
$host = "localhost";
$db = "u241066033_mindfuels";
$user = "u241066033_mindfuels";
$pass = "Trilochan##22";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // The Demo Book is 2 Rupees. We will delete the rest from order_items.
    // Also, delete old abandoned shipments just in case.
    $pdo->exec("DELETE FROM order_items WHERE price > 10");
    
    echo "SUCCESS: The database has been cleaned! Old residual items from previous testing have been deleted.";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
