<?php
/**
 * REVOGUE - Web Technology Laboratory (WTL) Practical 12
 * Objective: Native PHP Session Management & State Persistence
 * Syllabus Mapping: Practical 12 - PHP Sessions, Cookies, and State
 */

// Start session
session_start();

// Handle Logout
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
    header("Location: login.php?msg=logged_out");
    exit;
}

$loginErr = "";
$demoUsers = [
    "admin@revogue.demo" => ["password" => "revogue123", "name" => "Admin Controller", "role" => "Admin"],
    "seller@revogue.demo" => ["password" => "revogue123", "name" => "Aarav Mehta", "role" => "Seller"],
    "buyer@revogue.demo" => ["password" => "revogue123", "name" => "Ananya Deshmukh", "role" => "Buyer"]
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (isset($demoUsers[$email]) && $demoUsers[$email]['password'] === $password) {
        // Regenerate session ID to prevent session fixation
        session_regenerate_id(true);

        $_SESSION['authenticated'] = true;
        $_SESSION['user_email'] = $email;
        $_SESSION['user_name'] = $demoUsers[$email]['name'];
        $_SESSION['user_role'] = $demoUsers[$email]['role'];
        $_SESSION['login_time'] = time();
        $_SESSION['session_token'] = bin2hex(random_bytes(16));

        header("Location: login.php");
        exit;
    } else {
        $loginErr = "Invalid credentials. Try demo email (admin@revogue.demo) and password (revogue123).";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revogue - PHP Session Management (Practical 12)</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafaf9; color: #1c1917; margin: 0; padding: 2rem; }
        .card { max-width: 540px; margin: 0 auto; background: #ffffff; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e7e5e4; }
        h1 { font-size: 1.4rem; color: #0f172a; margin-top: 0; }
        .meta { color: #78716c; font-size: 0.85rem; margin-bottom: 1.5rem; }
        .session-info { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; }
        .session-info h3 { margin-top: 0; color: #166534; font-size: 1rem; }
        .kv { display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.35rem 0; border-bottom: 1px solid #dcfce7; }
        .form-group { margin-bottom: 1.2rem; }
        label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.3rem; }
        input[type="email"], input[type="password"] { width: 100%; padding: 0.75rem; border: 1px solid #d6d3d1; border-radius: 6px; box-sizing: border-box; }
        .btn { background: #0f172a; color: #fff; padding: 0.75rem 1.5rem; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; width: 100%; }
        .btn-danger { background: #dc2626; color: #fff; padding: 0.5rem 1rem; text-decoration: none; border-radius: 6px; font-size: 0.85rem; display: inline-block; }
        .error { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.85rem; }
    </style>
</head>
<body>

<div class="card">
    <h1>REVOGUE • Native PHP Session Engine</h1>
    <div class="meta">WTL Practical 12: Session Initialization, State Storage, and Destruction</div>

    <?php if (isset($_GET['msg']) && $_GET['msg'] === 'logged_out'): ?>
        <div style="background: #f0fdfa; color: #0d9488; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.85rem;">
            You have successfully destroyed your PHP session.
        </div>
    <?php endif; ?>

    <?php if (!empty($loginErr)): ?>
        <div class="error"><?= $loginErr; ?></div>
    <?php endif; ?>

    <?php if (!empty($_SESSION['authenticated'])): ?>
        <div class="session-info">
            <h3>✓ Active PHP Session (ID: <?= session_id(); ?>)</h3>
            <div class="kv"><span>Logged in User:</span> <strong><?= htmlspecialchars($_SESSION['user_name']); ?></strong></div>
            <div class="kv"><span>Email:</span> <strong><?= htmlspecialchars($_SESSION['user_email']); ?></strong></div>
            <div class="kv"><span>Role:</span> <strong><?= htmlspecialchars($_SESSION['user_role']); ?></strong></div>
            <div class="kv"><span>Session Started:</span> <strong><?= date("Y-m-d H:i:s", $_SESSION['login_time']); ?></strong></div>
            <div class="kv"><span>Secure Token:</span> <code><?= htmlspecialchars($_SESSION['session_token']); ?></code></div>
        </div>

        <p style="font-size: 0.85rem; color: #57534e;">
            This demonstrates server-side state preservation across page reloads without querying the database each time.
        </p>
        <a href="login.php?action=logout" class="btn-danger">Destroy Session (Logout)</a>
    <?php else: ?>
        <form method="POST">
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value="seller@revogue.demo" required>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" name="password" value="revogue123" required>
            </div>
            <button type="submit" class="btn">Establish PHP Session (Login)</button>
        </form>
    <?php endif; ?>
</div>

</body>
</html>
