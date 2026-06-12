<?php
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Active configuration: Booking details and contact messages are sent directly to info@hotelorchidchitwan.com
// Configure headers for raw JSON API access and cross-origin resource sharing
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Gracefully exit complex preflight sequences
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 1. GET requests for reading the tracked JSON logs dynamically (read-only fallback if logs already exist)
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

// 3. Admin clear actions (kept for CPanel UI consistency)
if ($action === 'clear_bookings') {
    $logFile = __DIR__ . '/bookings_log.json';
    if (file_exists($logFile)) {
        file_put_contents($logFile, json_encode([]));
    }
    echo json_encode(["success" => true, "message" => "All tracked bookings cleared successfully."]);
    exit;
}

if ($action === 'clear_contacts') {
    $logFile = __DIR__ . '/contacts_log.json';
    if (file_exists($logFile)) {
        file_put_contents($logFile, json_encode([]));
    }
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

// 4. Formulate the authoritative envelope sender domain to ensure delivery directly to cPanel SMTP/Webmail boxes
$domain = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'hotelorchidchitwan.com';
$domain = preg_replace('/:[0-9]+$/', '', $domain);

if ($domain === 'localhost' || $domain === '127.0.0.1' || empty($domain)) {
    $domain = 'hotelorchidchitwan.com';
}

$fromEmail = "no-reply@" . $domain;

// 5. Handle different transaction pipelines
if ($type === 'booking') {
    $recipientEmail = "info@hotelorchidchitwan.com";
    
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

    $subject = "🏨 New Booking Confirmed: #{$bookingId} - {$guestName}";

    // Highly responsive, elegant email design styled with crisp contrasting tones
    $messageHtml = "
    <html>
    <head>
      <title>Hotel Orchid Reservation Alert</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f9fc; color: #1e293b; margin: 0; padding: 20px; }
        .wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background-color: #0b2545; color: #f4ebe1; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.05em; color: #f4ebe1; }
        .header p { margin: 5px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #f4b2a6; }
        .content { padding: 40px; }
        .badge { display: inline-block; background-color: #d97706; color: #ffffff; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
        .intro { font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 30px; }
        .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #d946ef; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px; }
        .grid { display: table; width: 100%; margin-bottom: 20px; }
        .row { display: table-row; }
        .label { display: table-cell; width: 35%; padding: 10px 0; font-size: 13px; font-weight: bold; color: #64748b; border-bottom: 1px solid #f8fafc; }
        .value { display: table-cell; padding: 10px 0; font-size: 13px; color: #0f172a; border-bottom: 1px solid #f8fafc; }
        .special-note { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; font-size: 13px; font-style: italic; color: #78350f; margin-top: 20px; }
        .footer { background-color: #f8fafc; padding: 25px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class='wrapper'>
        <div class='header'>
          <h1>Hotel Orchid</h1>
          <p>Sauraha, Chitwan, Nepal</p>
        </div>
        <div class='content'>
          <span class='badge'>Guest Reservation Auto-Log</span>
          <p class='intro'>Hello Jitu Tamang / Hotel Orchid Team,</p>
          <p class='intro'>An online visitor has initiated a direct self-booking reservation transaction on your web platform. Below are the parsed booking specifications:</p>
          
          <div class='section-title'>Guest Contact File</div>
          <div class='grid'>
            <div class='row'>
              <div class='label'>Guest Name</div>
              <div class='value'><strong>{$guestName}</strong></div>
            </div>
            <div class='row'>
              <div class='label'>Email / Call No.</div>
              <div class='value'>{$emailOrPhone}</div>
            </div>
          </div>
          
          <div class='section-title'>Booking Specifications</div>
          <div class='grid'>
            <div class='row'>
              <div class='label'>Room Option</div>
              <div class='value'><strong>{$roomName}</strong></div>
            </div>
            <div class='row'>
              <div class='label'>Booking ID</div>
              <div class='value'><code style='background-color:#f1f5f9; padding:2px 6px; border-radius:3px; color:#ef4444; font-weight:bold;'>{$bookingId}</code></div>
            </div>
            <div class='row'>
              <div class='label'>Check-In</div>
              <div class='value'>{$checkIn}</div>
            </div>
            <div class='row'>
              <div class='label'>Check-Out</div>
              <div class='value'>{$checkOut}</div>
            </div>
            <div class='row'>
              <div class='label'>Nights Reserved</div>
              <div class='value'>{$nights} Nights</div>
            </div>
            <div class='row'>
              <div class='label'>Guests Count</div>
              <div class='value'>{$guests} Person(s)</div>
            </div>
            <div class='row'>
              <div class='label'>Total Price</div>
              <div class='value' style='color:#dc2626; font-size:15px; font-weight:bold;'>NPR " . number_format((float)$totalPrice) . "</div>
            </div>
          </div>";

    if (!empty($specialRequests) && $specialRequests !== 'None') {
        $messageHtml .= "
          <div class='section-title'>Special Requests</div>
          <div class='special-note'>
            \"" . nl2br($specialRequests) . "\"
          </div>";
    }

    $messageHtml .= "
          <p style='margin-top: 30px; font-size: 12px; color: #94a3b8; line-height: 1.5;'>
            * This transaction was processed and dispatched securely. Please follow up directly with the guest at <strong>{$emailOrPhone}</strong> to confirm check-in times and arrange booking deposits.
          </p>
        </div>
        <div class='footer'>
          <p>Dispatched dynamically from Hotel Orchid cPanel Host platform.</p>
          <p>&copy; " . date('Y') . " Hotel Orchid Sauraha. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>";

    $replyTo = filter_var($emailOrPhone, FILTER_VALIDATE_EMAIL) ? $emailOrPhone : $recipientEmail;

    $headers = [
        "MIME-Version: 1.0",
        "Content-type: text/html; charset=UTF-8",
        "From: Hotel Orchid <{$fromEmail}>",
        "Reply-To: {$replyTo}",
        "X-Mailer: PHP/" . phpversion()
    ];

    $mailSent = mail($recipientEmail, $subject, $messageHtml, implode("\r\n", $headers));

    echo json_encode([
        "success" => $mailSent, 
        "message" => $mailSent ? "Direct mail dispatched successfully to {$recipientEmail}" : "Underlying php-mail service failed."
    ]);
    exit;

} else if ($type === 'contact') {
    $recipientEmail = "jitutamang403@gmail.com";
    
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

    $subject = "✉️ New Guest Message: {$guestName}";

    $messageHtml = "
    <html>
    <head>
      <title>New Guest Message Received</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f9fc; color: #1e293b; margin: 0; padding: 20px; }
        .wrapper { max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background-color: #0b2545; color: #f4ebe1; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 0.05em; color: #f4ebe1; }
        .header p { margin: 5px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #f4b2a6; }
        .content { padding: 40px; }
        .badge { display: inline-block; background-color: #d946ef; color: #ffffff; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
        .grid { display: table; width: 100%; margin-bottom: 25px; }
        .row { display: table-row; }
        .label { display: table-cell; width: 30%; padding: 10px 0; font-size: 13px; font-weight: bold; color: #64748b; border-bottom: 1px solid #f8fafc; }
        .value { display: table-cell; padding: 10px 0; font-size: 13px; color: #0f172a; border-bottom: 1px solid #f8fafc; }
        .mess-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 20px; font-size: 14px; line-height: 1.6; color: #334155; margin-top: 20px; white-space: pre-line; }
        .footer { background-color: #f8fafc; padding: 25px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class='wrapper'>
        <div class='header'>
          <h1>Hotel Orchid</h1>
          <p>Sauraha, Chitwan, Nepal</p>
        </div>
        <div class='content'>
          <span class='badge'>GUEST MESSAGE DISPATCH</span>
          <p style='font-size: 15px; margin-bottom: 25px;'>Hello Hotel Orchid Team,</p>
          <p style='font-size: 14px; color: #475569;'>A visitor has compiled a contact form enquiry on your web platform with the following parameters:</p>
          
          <div class='grid'>
            <div class='row'>
              <div class='label'>Sender Name</div>
              <div class='value'><strong>{$guestName}</strong></div>
            </div>
            <div class='row'>
              <div class='label'>Email Address</div>
              <div class='value'><a href='mailto:{$guestEmail}'>{$guestEmail}</a></div>
            </div>
          </div>
          
          <div style='font-size: 13px; font-weight: bold; text-transform: uppercase; color: #64748b;'>Message Copy:</div>
          <div class='mess-box'>\"{$message}\"</div>
          
          <p style='margin-top: 30px; font-size: 12px; color: #94a3b8;'>
            You can respond directly to this email message to query or greet the sender.
          </p>
        </div>
        <div class='footer'>
          <p>Dispatched dynamically from Hotel Orchid cPanel Host platform.</p>
          <p>&copy; " . date('Y') . " Hotel Orchid Sauraha. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>";

    $replyTo = filter_var($guestEmail, FILTER_VALIDATE_EMAIL) ? $guestEmail : $recipientEmail;

    $headers = [
        "MIME-Version: 1.0",
        "Content-type: text/html; charset=UTF-8",
        "From: Hotel Orchid Contacts <{$fromEmail}>",
        "Reply-To: {$replyTo}",
        "X-Mailer: PHP/" . phpversion()
    ];

    $mailSent = mail($recipientEmail, $subject, $messageHtml, implode("\r\n", $headers));

    echo json_encode([
        "success" => $mailSent, 
        "message" => $mailSent ? "Contact email dispatched successfully to {$recipientEmail}" : "Underlying php-mail service failed."
    ]);
    exit;
} else {
    echo json_encode([
        "success" => false, 
        "error" => "Invalid transaction criteria or type specified."
    ]);
    exit;
}
