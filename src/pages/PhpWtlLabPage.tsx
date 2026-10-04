import React, { useState } from 'react';
import {
  Code,
  CheckCircle2,
  FileCode,
  Database,
  Terminal,
  Server,
  Play,
  Copy,
  BookOpen
} from 'lucide-react';

export const PhpWtlLabPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'syllabus' | 'php-form' | 'php-session' | 'php-crud' | 'sql'>('syllabus');

  // Interactive Form Simulator State
  const [simName, setSimName] = useState('Shruti Borse');
  const [simEmail, setSimEmail] = useState('shrutiborse2006@gmail.com');
  const [simCategory, setSimCategory] = useState('Product Authenticity');
  const [simMessage, setSimMessage] = useState('I would like to inquire about the Revogue Condition Score verification process for ethnic wear.');
  const [simOutput, setSimOutput] = useState<any>(null);

  const handleSimulatePhpForm = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Practical 12 PHP functions:
    const titleCase = simName.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    const upperName = simName.toUpperCase();
    const charLen = simMessage.length;
    const wordCount = simMessage.trim().split(/\s+/).length;
    const emailParts = simEmail.split('@');
    const maskedEmail = `${emailParts[0].slice(0, 3)}***@${emailParts[1] || 'revogue.demo'}`;
    const ticketSlug = `REV-TICKET-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    setSimOutput({
      success: true,
      titleCase,
      upperName,
      charLen,
      wordCount,
      maskedEmail,
      ticketSlug
    });
  };

  const syllabusPracticals = [
    { num: 1, title: 'HTML5 Headings, Lists & Images', file: 'index.html, src/pages/HomePage.tsx', desc: 'Hierarchy, lazy-loading, semantic picture tags and image galleries.' },
    { num: 2, title: 'Semantic HTML5 Elements', file: 'src/components/Navbar.tsx, src/components/Footer.tsx', desc: '<header>, <nav>, <main>, <section>, <article>, <footer> structuring.' },
    { num: 3, title: 'CSS3 Styling (Inline, Internal, External)', file: 'src/index.css, ConditionScoreMeter.tsx', desc: 'Tailwind utility framework, custom progress bar inline styles.' },
    { num: 4, title: 'Responsive Design (Flexbox & CSS Grid)', file: 'src/pages/MarketplacePage.tsx', desc: 'Mobile-first 12-column responsive layout across phones and desktops.' },
    { num: 5, title: 'CSS Positioning & Sticky Navbar', file: 'src/components/Navbar.tsx', desc: 'Sticky top-0 z-50 navigation, floating condition badges, notification dots.' },
    { num: 6, title: 'JavaScript Array Functions', file: 'src/utils/cartCalculations.ts, MarketplacePage.tsx', desc: '.filter(), .map(), .reduce(), .sort() for dynamic cart and search logic.' },
    { num: 7, title: 'Frontend Form Validation', file: 'src/pages/CheckoutPage.tsx, ProductListingModal.tsx', desc: 'Regex phone, email, PIN code, and price sanity checks.' },
    { num: 8, title: 'React SPA Architecture & JSX', file: 'src/App.tsx', desc: 'Component encapsulation, props, state, zero full-page browser reloads.' },
    { num: 9, title: 'React Hooks (useState, useEffect, useContext)', file: 'src/context/AuthContext.tsx, CartContext.tsx', desc: 'Global reactive state management for authentication and shopping bag.' },
    { num: 10, title: 'Fetch API & RESTful JSON Communication', file: 'src/services/api.ts', desc: 'Asynchronous HTTP requests communicating with Express endpoints.' },
    { num: 11, title: 'DOM Events & Interactive Handlers', file: 'src/components/ImageGallery.tsx', desc: 'Thumbnail click switches, modal dismissals, keyboard triggers.' },
    { num: 12, title: 'Native PHP Form Handling & Sessions', file: 'php-demo/forms/contact.php, php-demo/sessions/login.php', desc: '$_POST sanitization, regex, string functions, session_start().' },
    { num: 13, title: 'PHP + MySQL Database Connectivity & CRUD', file: 'php-demo/crud/categories.php', desc: 'PDO prepared statements against SQL injection, Insert, Read, Delete.' },
    { num: 14, title: 'Node.js + Express Web Server', file: 'server.ts', desc: 'Middleware chain, body-parser, CORS, port 3000 hosting.' },
    { num: 15, title: 'REST API Design Architecture', file: 'server.ts (/api/*)', desc: 'Standard HTTP verbs (GET, POST, PUT, DELETE) returning JSON.' },
    { num: 16, title: 'REVOGUE Resale Capstone Project', file: 'Entire Codebase', desc: 'Integrated circular fashion marketplace submission-grade project.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-stone-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            University Academic Mapping
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif">
            Web Technology Laboratory (WTL) Evaluation Hub
          </h1>
          <p className="text-xs text-stone-400">
            Interactive demonstration of Practical 1 through 16, standalone PHP scripts, and relational MySQL schemas.
          </p>
        </div>

        <div className="flex gap-2">
          <span className="bg-stone-800 border border-stone-700 text-xs font-bold text-stone-300 px-4 py-2 rounded-xl">
            Course Code: WTL-304
          </span>
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="flex border-b border-stone-200 gap-4 sm:gap-6 text-xs sm:text-sm font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveModule('syllabus')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition shrink-0 ${
            activeModule === 'syllabus'
              ? 'border-stone-950 text-stone-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Practical 1–16 Matrix
        </button>

        <button
          onClick={() => setActiveModule('php-form')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition shrink-0 ${
            activeModule === 'php-form'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Code className="w-4 h-4" />
          Practical 12: PHP Form & Strings
        </button>

        <button
          onClick={() => setActiveModule('php-session')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition shrink-0 ${
            activeModule === 'php-session'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Server className="w-4 h-4" />
          Practical 12: PHP Sessions
        </button>

        <button
          onClick={() => setActiveModule('php-crud')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition shrink-0 ${
            activeModule === 'php-crud'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Database className="w-4 h-4" />
          Practical 13: PHP MySQL CRUD
        </button>

        <button
          onClick={() => setActiveModule('sql')}
          className={`pb-3 border-b-2 flex items-center gap-1.5 transition shrink-0 ${
            activeModule === 'sql'
              ? 'border-stone-950 text-stone-950'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Relational SQL Schema & Seeds
        </button>
      </div>

      {/* TAB 1: SYLLABUS MATRIX */}
      {activeModule === 'syllabus' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-bold text-stone-900 text-base">
              Complete Syllabus Implementation Matrix
            </h3>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
              16 of 16 Practicals Complete
            </span>
          </div>

          <div className="divide-y divide-stone-100 overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-stone-400 font-bold uppercase text-[11px] border-b border-stone-200 pb-2">
                  <th className="py-2.5">Practical</th>
                  <th>Syllabus Objective</th>
                  <th>Key Implementation Files</th>
                  <th>Verification Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {syllabusPracticals.map(p => (
                  <tr key={p.num} className="hover:bg-stone-50/50">
                    <td className="py-3 font-bold text-stone-900 whitespace-nowrap">
                      Practical {p.num}
                    </td>
                    <td className="font-semibold text-stone-800">{p.title}</td>
                    <td className="font-mono text-stone-500">{p.file}</td>
                    <td className="text-stone-600">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PHP FORM & STRING MANIPULATION */}
      {activeModule === 'php-form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Interactive Simulation Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Live PHP Form Simulator (Practical 12)
                </h3>
                <p className="text-xs text-stone-500">File: php-demo/forms/contact.php</p>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                Server-Side Validation
              </span>
            </div>

            <form onSubmit={handleSimulatePhpForm} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name (name)</label>
                <input
                  type="text"
                  value={simName}
                  onChange={e => setSimName(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Email Address (email)</label>
                <input
                  type="email"
                  value={simEmail}
                  onChange={e => setSimEmail(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Category (category)</label>
                <select
                  value={simCategory}
                  onChange={e => setSimCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="Product Authenticity">Product Authenticity</option>
                  <option value="Seller Payout">Seller Payout & Commission</option>
                  <option value="Delivery Tracking">Delivery Tracking</option>
                  <option value="Listing Approval">Listing Approval</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Message Query (message)</label>
                <textarea
                  rows={3}
                  value={simMessage}
                  onChange={e => setSimMessage(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                Simulate PHP Processing & String Analysis
              </button>
            </form>

            {simOutput && (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2 text-xs">
                <div className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  PHP Validation Passed (htmlspecialchars + preg_match)
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-600 pt-1">
                  <div>ucwords(strtolower($name)): <strong>{simOutput.titleCase}</strong></div>
                  <div>strtoupper($name): <strong>{simOutput.upperName}</strong></div>
                  <div>strlen($message): <strong>{simOutput.charLen} chars</strong></div>
                  <div>str_word_count($message): <strong>{simOutput.wordCount} words</strong></div>
                  <div className="col-span-2">Masked Email: <code>{simOutput.maskedEmail}</code></div>
                  <div className="col-span-2">Generated Ticket ID: <strong className="font-mono text-amber-800">{simOutput.ticketSlug}</strong></div>
                </div>
              </div>
            )}
          </div>

          {/* Raw PHP Source Code Viewer */}
          <div className="lg:col-span-6 bg-stone-950 text-stone-200 rounded-3xl p-6 border border-stone-800 shadow-xl overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-stone-300">
                    php-demo/forms/contact.php
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 font-mono">PHP 8.2 Native</span>
              </div>

              <pre className="text-[11px] font-mono leading-relaxed text-stone-300 overflow-x-auto max-h-96 pr-2">
{`<?php
// WTL Practical 12: Form Validation & String Functions
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Regular expression validation
    if (!preg_match("/^[a-zA-Z-' ]*$/", $name)) {
        $nameErr = "Only letters and spaces allowed";
    }

    // 2. Email syntax filter
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $emailErr = "Invalid email format";
    }

    // 3. String manipulation functions
    $titleCase = ucwords(strtolower($name));
    $wordCount = str_word_count($message);
    $charLength = strlen($message);
    $ticketSlug = "REV-" . strtoupper(substr(md5(uniqid()), 0, 6));
}
?>`}
              </pre>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400">
              Run locally via CLI: <code>php -S localhost:8000 -t php-demo/</code>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PHP SESSIONS */}
      {activeModule === 'php-session' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">
              PHP Session Engine Mechanics (Practical 12)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Demonstrates native PHP session management using <code>session_start()</code>, <code>$_SESSION</code> arrays, session fixation defense with <code>session_regenerate_id(true)</code>, and explicit cookie destruction via <code>session_destroy()</code>.
            </p>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <div className="font-bold text-stone-800">Demonstrated Session Superglobals:</div>
              <ul className="list-disc pl-5 space-y-1 text-stone-600">
                <li><code>$_SESSION['authenticated'] = true;</code></li>
                <li><code>$_SESSION['user_email'] = $email;</code></li>
                <li><code>$_SESSION['user_role'] = 'Seller';</code></li>
                <li><code>$_SESSION['login_time'] = time();</code></li>
                <li><code>$_SESSION['session_token'] = bin2hex(random_bytes(16));</code></li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-6 bg-stone-950 text-stone-200 rounded-3xl p-6 border border-stone-800 shadow-xl">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-3 mb-3">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-stone-300">
                php-demo/sessions/login.php
              </span>
            </div>
            <pre className="text-[11px] font-mono leading-relaxed text-stone-300 overflow-x-auto max-h-80">
{`<?php
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
    header("Location: login.php");
    exit;
}
?>`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: PHP + MYSQL CRUD */}
      {activeModule === 'php-crud' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">
              PDO Prepared Statements & CRUD (Practical 13)
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Implements secure database queries using PHP Data Objects (PDO). Parameters are bound to prevent SQL Injection attacks.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 font-mono text-[11px]">
                <strong>CREATE:</strong> INSERT INTO categories (category_name, slug, description) VALUES (:name, :slug, :desc)
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 font-mono text-[11px]">
                <strong>READ:</strong> SELECT * FROM categories ORDER BY category_id ASC
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 font-mono text-[11px]">
                <strong>DELETE:</strong> DELETE FROM categories WHERE category_id = :id
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-stone-950 text-stone-200 rounded-3xl p-6 border border-stone-800 shadow-xl">
            <div className="flex items-center gap-2 border-b border-stone-800 pb-3 mb-3">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-stone-300">
                php-demo/crud/categories.php
              </span>
            </div>
            <pre className="text-[11px] font-mono leading-relaxed text-stone-300 overflow-x-auto max-h-80">
{`<?php
// PDO Connection with Error Handling
$dsn = "mysql:host=127.0.0.1;dbname=revogue_db;charset=utf8mb4";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
$pdo = new PDO($dsn, $user, $pass, $options);

// Parameterized Insert
$stmt = $pdo->prepare("INSERT INTO categories (category_name, slug) VALUES (:name, :slug)");
$stmt->execute([':name' => $name, ':slug' => $slug]);
?>`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 5: RELATIONAL SQL SCHEMA */}
      {activeModule === 'sql' && (
        <div className="bg-stone-950 text-stone-200 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <h3 className="font-bold text-white text-base">
                MySQL Relational Schema (18 Tables)
              </h3>
              <p className="text-xs text-stone-400">
                Files: database/schema.sql & database/seed.sql (60+ products, 30+ users)
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
              Foreign Keys & Cascades Enforced
            </span>
          </div>

          <pre className="text-[11px] font-mono leading-relaxed text-stone-300 overflow-x-auto max-h-96 pr-2">
{`-- Normalized Schema Extracts
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role_id INT NOT NULL DEFAULT 1,
    is_seller BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    condition_grade ENUM('Like New', 'Excellent', 'Good', 'Fair'),
    condition_score INT NOT NULL DEFAULT 90,
    times_worn INT DEFAULT 2,
    why_selling VARCHAR(150),
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE delivery_tracking (
    tracking_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status_step VARCHAR(50) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);`}
          </pre>
        </div>
      )}
    </div>
  );
};
