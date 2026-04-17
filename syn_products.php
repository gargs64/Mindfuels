<?php

// =============================================
// CONFIGURATION — only edit these 4 lines
// =============================================
$SECRET = "mindfuelssecretkey";   // make up any password, you'll use this in Google Sheet too
$host = "localhost";
$db = "u241066033_mindfuels";       // from hPanel → MySQL Databases
$user = "u241066033_mindfuels";       // from hPanel → MySQL Databases
$pass = "Trilochan##22";   // from hPanel → MySQL Databases
// =============================================

// Block anyone who doesn't have the secret key
$headers = getallheaders();
if (($headers['X-Secret'] ?? '') !== $SECRET) {
    http_response_code(403);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

// Connect to database
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed: " . $e->getMessage()]);
    exit;
}

// Read the data sent from Google Sheet
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['products'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid data received"]);
    exit;
}

// Save each product to database
$pdo->beginTransaction();
try {
    foreach ($data['products'] as $p) {
        $pid = trim($p['product_id'] ?? '');
        if (!$pid)
            continue; // skip rows with no product_id

        $stmt = $pdo->prepare("
            INSERT INTO products
              (product_id, title, tag1, tag2, tag3, mrp, sp, stock_qty, description,
               image1, image2, image3, image4, image5, image6, image7)
            VALUES
              (:pid, :title, :tag1, :tag2, :tag3, :mrp, :sp, :stock, :desc,
               :img1, :img2, :img3, :img4, :img5, :img6, :img7)
            ON DUPLICATE KEY UPDATE
              title=VALUES(title), tag1=VALUES(tag1), tag2=VALUES(tag2), tag3=VALUES(tag3),
              mrp=VALUES(mrp), sp=VALUES(sp), stock_qty=VALUES(stock_qty),
              description=VALUES(description),
              image1=VALUES(image1), image2=VALUES(image2), image3=VALUES(image3),
              image4=VALUES(image4), image5=VALUES(image5), image6=VALUES(image6),
              image7=VALUES(image7)
        ");

        $stmt->execute([
            ':pid' => $pid,
            ':title' => $p['title'] ?? '',
            ':tag1' => $p['tag1'] ?? '',
            ':tag2' => $p['tag2'] ?? '',
            ':tag3' => $p['tag3'] ?? '',
            ':mrp' => is_numeric($p['mrp'] ?? '') ? $p['mrp'] : 0,
            ':sp' => is_numeric($p['sp'] ?? '') ? $p['sp'] : 0,
            ':stock' => is_numeric($p['stock_qty'] ?? '') ? $p['stock_qty'] : 0,
            ':desc' => $p['description'] ?? '',
            ':img1' => $p['image1'] ?? '',
            ':img2' => $p['image2'] ?? '',
            ':img3' => $p['image3'] ?? '',
            ':img4' => $p['image4'] ?? '',
            ':img5' => $p['image5'] ?? '',
            ':img6' => $p['image6'] ?? '',
            ':img7' => $p['image7'] ?? '',
        ]);
    }

    $pdo->commit();
    echo json_encode(["success" => true, "synced" => count($data['products'])]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
