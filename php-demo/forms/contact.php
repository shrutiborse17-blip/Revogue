<?php
/**
 * REVOGUE - Web Technology Laboratory (WTL) Practical 12
 * Objective: Native PHP Form Handling, Input Validation, and String Manipulation
 * Syllabus Mapping: Practical 12 - PHP Form Validation & String Operations
 */

// Initialize variables
$name = $email = $category = $message = "";
$nameErr = $emailErr = $categoryErr = $messageErr = "";
$successMsg = "";
$stringAnalysis = [];

// Helper function to sanitize user input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Process POST request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Validate Name
    if (empty($_POST["name"])) {
        $nameErr = "Full Name is required.";
    } else {
        $name = sanitize_input($_POST["name"]);
        // Check if name contains only letters and whitespace
        if (!preg_match("/^[a-zA-Z-' ]*$/", $name)) {
            $nameErr = "Only letters and white space allowed in name.";
        }
    }

    // 2. Validate Email
    if (empty($_POST["email"])) {
        $emailErr = "Valid email address is required.";
    } else {
        $email = sanitize_input($_POST["email"]);
        // Validate e-mail address syntax using filter_var
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $emailErr = "Invalid email format. Example: user@revogue.demo";
        }
    }

    // 3. Validate Support Category
    if (empty($_POST["category"])) {
        $categoryErr = "Please select a query category.";
    } else {
        $category = sanitize_input($_POST["category"]);
    }

    // 4. Validate Message
    if (empty($_POST["message"])) {
        $messageErr = "Message query cannot be blank.";
    } else {
        $message = sanitize_input($_POST["message"]);
        if (strlen($message) < 15) {
            $messageErr = "Message must contain at least 15 characters for detailed support.";
        }
    }

    // If no validation errors, perform String Manipulation functions
    if (empty($nameErr) && empty($emailErr) && empty($categoryErr) && empty($messageErr)) {
        // String Manipulation demonstration required for Practical 12:
        $stringAnalysis = [
            "Formatted Full Name (Title Case)" => ucwords(strtolower($name)),
            "Upper Case Name" => strtoupper($name),
            "Length of Message" => strlen($message) . " characters",
            "Word Count of Message" => str_word_count($message) . " words",
            "Masked Email" => substr($email, 0, 3) . "***@" . explode("@", $email)[1],
            "Generated Support Ticket Slug" => "REV-TICKET-" . strtoupper(substr(md5(uniqid(rand(), true)), 0, 8)),
            "Sanitized Message Preview" => nl2br($message)
        ];

        $successMsg = "Thank you, " . ucwords(strtolower($name)) . "! Your query has been logged successfully.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revogue - PHP Form Handling & String Manipulation (Practical 12)</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fdfbf7; color: #1c1917; margin: 0; padding: 2rem; }
        .container { max-width: 640px; margin: 0 auto; background: #ffffff; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e7e5e4; }
        h1 { font-size: 1.5rem; color: #0f172a; margin-bottom: 0.5rem; }
        .subtitle { color: #78716c; font-size: 0.9rem; margin-bottom: 1.5rem; border-bottom: 1px solid #f5f5f4; padding-bottom: 0.75rem; }
        .form-group { margin-bottom: 1.25rem; }
        label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem; color: #44403c; }
        input[type="text"], input[type="email"], select, textarea { width: 100%; padding: 0.75rem; border: 1px solid #d6d3d1; border-radius: 6px; box-sizing: border-box; font-size: 0.95rem; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #0f172a; ring: 2px solid #0f172a; }
        .error { color: #dc2626; font-size: 0.8rem; margin-top: 0.25rem; }
        .success-banner { background: #f0fdf4; border: 1px solid #86efac; color: #166534; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; }
        .analysis-card { background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 8px; padding: 1.25rem; margin-top: 1.5rem; }
        .analysis-card h3 { margin-top: 0; font-size: 1rem; color: #1c1917; }
        .analysis-item { display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px dashed #e7e5e4; font-size: 0.85rem; }
        .btn-submit { background: #0f172a; color: #ffffff; padding: 0.75rem 1.5rem; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; width: 100%; font-size: 0.95rem; }
        .btn-submit:hover { background: #1e293b; }
    </style>
</head>
<body>

<div class="container">
    <h1>REVOGUE • Seller & Buyer Support</h1>
    <div class="subtitle">WTL Practical 12: Server-Side Form Handling, Data Sanitation, and String Manipulation</div>

    <?php if (!empty($successMsg)): ?>
        <div class="success-banner">
            <strong>Success:</strong> <?= $successMsg; ?>
        </div>
    <?php endif; ?>

    <form method="POST" action="<?= htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
        <div class="form-group">
            <label for="name">Full Name *</label>
            <input type="text" id="name" name="name" value="<?= htmlspecialchars($name); ?>" placeholder="e.g. Shruti Borse">
            <div class="error"><?= $nameErr; ?></div>
        </div>

        <div class="form-group">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="email" value="<?= htmlspecialchars($email); ?>" placeholder="e.g. shruti@revogue.demo">
            <div class="error"><?= $emailErr; ?></div>
        </div>

        <div class="form-group">
            <label for="category">Inquiry Subject *</label>
            <select id="category" name="category">
                <option value="">-- Select Inquiry Type --</option>
                <option value="Product Authenticity" <?= ($category == "Product Authenticity") ? "selected" : ""; ?>>Product Authenticity / Verification</option>
                <option value="Seller Payout" <?= ($category == "Seller Payout") ? "selected" : ""; ?>>Seller Payout & Commission</option>
                <option value="Delivery Tracking" <?= ($category == "Delivery Tracking") ? "selected" : ""; ?>>Courier & Delivery Tracking</option>
                <option value="Listing Approval" <?= ($category == "Listing Approval") ? "selected" : ""; ?>>New Listing Approval Status</option>
                <option value="Other" <?= ($category == "Other") ? "selected" : ""; ?>>Other Assistance</option>
            </select>
            <div class="error"><?= $categoryErr; ?></div>
        </div>

        <div class="form-group">
            <label for="message">Detailed Message *</label>
            <textarea id="message" name="message" rows="4" placeholder="Describe your query in detail..."><?= htmlspecialchars($message); ?></textarea>
            <div class="error"><?= $messageErr; ?></div>
        </div>

        <button type="submit" class="btn-submit">Submit Support Query</button>
    </form>

    <?php if (!empty($stringAnalysis)): ?>
        <div class="analysis-card">
            <h3>Practical 12 String Functions Executed:</h3>
            <?php foreach ($stringAnalysis as $key => $val): ?>
                <div class="analysis-item">
                    <span style="font-weight: 500; color: #57534e;"><?= $key; ?>:</span>
                    <span style="font-weight: 600; color: #0f172a;"><?= $val; ?></span>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

</body>
</html>
