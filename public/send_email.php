<?php
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Configure headers for raw JSON API access and cross-origin resource sharing
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Gracefully exit complex preflight sequences
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 1. GET requests for reading the tracked JSON logs dynamically
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    
    if ($action === 'get_bookings') {
        $logFile = __DIR__ . '/bookings_log.json';
        if (file_exists($logFile)) {
            echo file_get_contents($logFile);
        } else {
            echo json_encode([]);
        }
        exit;
    }
    
    if ($action === 'get_contacts') {
        $logFile = __DIR__ . '/contacts_log.json';
        if (file_exists($logFile)) {
            echo file_get_contents($logFile);
        } else {
            echo json_encode([]);
        }
        exit;
    }
    
    echo json_encode(["status" => "online", "message" => "Hotel Orchid cPanel API dynamic gateway ready."]);
    exit;
}

// 2. Parse JSON payloads or standard form inputs natively
$inputRaw = file_get_contents("php://input");
$data = json_decode($inputRaw, true);

if (!$data) {
    // Form data fallback
    $data = $_POST;
}

$type = isset($data['type']) ? trim($data['type']) : '';
$action = isset($data['action']) ? trim($data['action']) : '';

// 3. Admin clear actions
if ($action === 'clear_bookings') {
    $logFile = __DIR__ . '/bookings_log.json';
    file_put_contents($logFile, json_encode([]));
    echo json_encode(["success" => true, "message" => "All tracked bookings cleared successfully."]);
    exit;
}

if ($action === 'clear_contacts') {
    $logFile = __DIR__ . '/contacts_log.json';
    file_put_contents($logFile, json_encode([]));
    echo json_encode(["success" => true, "message" => "All tracked contacts/enquiries cleared successfully."]);
    exit;
}

if (empty($type)) {
    echo json_encode([
        "success" => false, 
        "error" => "Transaction criteria or type missing."
    ]);
    exit;
}

// 4. Handle different transaction pipelines and WRITE them to local logs on the cPanel directory
if ($type === 'booking') {
    // Extract client-side booking configurations
    $guestName = isset($data['name']) ? htmlspecialchars(trim($data['name'])) : '';
    $emailOrPhone = isset($data['emailOrPhone']) ? htmlspecialchars(trim($data['emailOrPhone'])) : '';
    $checkIn = isset($data['checkIn']) ? htmlspecialchars(trim($data['checkIn'])) : '';
    $checkOut = isset($data['checkOut']) ? htmlspecialchars(trim($data['checkOut'])) : '';
    $guests = isset($data['guests']) ? (int)$data['guests'] : 2;
    $specialRequests = isset($data['specialRequests']) ? htmlspecialchars(trim($data['specialRequests'])) : 'None';
    
    $roomName = isset($data['roomName']) ? htmlspecialchars(trim($data['roomName'])) : 'Standard Premium Room';
    $totalPrice = isset($data['totalPrice']) ? htmlspecialchars(trim($data['totalPrice'])) : '';
    $nights = isset($data['nights']) ? (int)$data['nights'] : 1;
    $bookingId = isset($data['bookingId']) ? htmlspecialchars(trim($data['bookingId'])) : ('ORC-' . rand(100000, 999999));

    if (empty($guestName) || empty($emailOrPhone) || empty($checkIn) || empty($checkOut)) {
        echo json_encode([
            "success" => false, 
            "error" => "Required booking credentials missing."
        ]);
        exit;
    }

    // Capture and write booking logs
    $logFile = __DIR__ . '/bookings_log.json';
    $bookings = [];
    if (file_exists($logFile)) {
        $content = file_get_contents($logFile);
        $bookings = json_decode($content, true);
        if (!is_array($bookings)) {
            $bookings = [];
        }
    }
    
    $newBooking = [
        'bookingId' => $bookingId,
        'name' => $guestName,
        'emailOrPhone' => $emailOrPhone,
        'checkIn' => $checkIn,
        'checkOut' => $checkOut,
        'guests' => $guests,
        'roomName' => $roomName,
        'nights' => $nights,
        'totalPrice' => $totalPrice,
        'specialRequests' => $specialRequests,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    array_unshift($bookings, $newBooking); // Prepend new at top so latest is displayed first
    file_put_contents($logFile, json_encode($bookings, JSON_PRETTY_PRINT));

    echo json_encode([
        "success" => true, 
        "message" => "Booking was successfully logged and captured by the cPanel tracker.",
        "booking" => $newBooking
    ]);
    exit;

} else if ($type === 'contact') {
    $guestName = isset($data['name']) ? htmlspecialchars(trim($data['name'])) : '';
    $guestEmail = isset($data['email']) ? htmlspecialchars(trim($data['email'])) : '';
    $message = isset($data['message']) ? htmlspecialchars(trim($data['message'])) : '';

    if (empty($guestName) || empty($guestEmail) || empty($message)) {
        echo json_encode([
            "success" => false, 
            "error" => "Required contact fields are missing."
        ]);
        exit;
    }

    // Capture and write contacts log
    $logFile = __DIR__ . '/contacts_log.json';
    $contacts = [];
    if (file_exists($logFile)) {
        $content = file_get_contents($logFile);
        $contacts = json_decode($content, true);
        if (!is_array($contacts)) {
            $contacts = [];
        }
    }
    
    $newContact = [
        'name' => $guestName,
        'email' => $guestEmail,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    
    array_unshift($contacts, $newContact);
    file_put_contents($logFile, json_encode($contacts, JSON_PRETTY_PRINT));

    echo json_encode([
        "success" => true, 
        "message" => "Contact enquiry was successfully logged and captured by the cPanel tracker.",
        "contact" => $newContact
    ]);
    exit;
} else {
    echo json_encode([
        "success" => false, 
        "error" => "Invalid transaction criteria or type specified."
    ]);
    exit;
}
