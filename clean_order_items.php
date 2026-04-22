<?php
// ============================================
// ONE-TIME CLEANUP: Fix order_items for order #1
// Only DEMO-PROD1 was actually ordered (₹2)
// The other 3 items are ghost data from old cart
// ============================================

$host = "localhost";
$db   = "u241066033_mindfuels";
$user = "u241066033_mindfuels";
$pass = "Trilochan##22";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Step 1: Show current state
    $before = $pdo->query("SELECT * FROM order_items WHERE order_id = 1")->fetchAll(PDO::FETCH_ASSOC);
    echo "<h3>BEFORE cleanup (" . count($before) . " items):</h3><pre>";
    print_r($before);
    echo "</pre>";

    // Step 2: Delete all order_items for order 1 EXCEPT DEMO-PROD1
    $stmt = $pdo->prepare("DELETE FROM order_items WHERE order_id = 1 AND product_id != 'DEMO-PROD1'");
    $stmt->execute();
    $deleted = $stmt->rowCount();

    // Step 3: Also clear any leftover items in the cart table to prevent this from happening again
    $pdo->exec("DELETE FROM cart");

    // Step 4: Show result
    $after = $pdo->query("SELECT * FROM order_items WHERE order_id = 1")->fetchAll(PDO::FETCH_ASSOC);
    echo "<h3>AFTER cleanup (" . count($after) . " items):</h3><pre>";
    print_r($after);
    echo "</pre>";

    echo "<hr>";
    echo "<h2 style='color:green;'>✅ SUCCESS — Deleted $deleted ghost items. Only DEMO-PROD1 remains.</h2>";
    echo "<p>Cart table also cleared to prevent future duplicates.</p>";
    echo "<p><strong>You can now go back to your <a href='order_history.html'>Order History</a> and refresh.</strong></p>";

} catch (Exception $e) {
    echo "<h2 style='color:red;'>❌ Error: " . $e->getMessage() . "</h2>";
}
