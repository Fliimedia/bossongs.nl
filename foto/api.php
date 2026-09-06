<?php
// Fotoalbum voor de bruiloft. Geen database en geen framework: per foto een
// afbeelding, een miniatuur en een klein JSON bestand. De bestanden staan bij
// voorkeur buiten de webroot, zodat een deploy vanuit GitHub er nooit bij kan.
declare(strict_types=1);

const MAX_BYTES   = 15 * 1024 * 1024;
const MAX_CAPTION = 160;
const TYPES = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

header('X-Content-Type-Options: nosniff');

$action = (string) ($_GET['a'] ?? 'list');

switch ($action) {
    case 'list':   action_list();   break;
    case 'update': action_update(); break;
    case 'upload': action_upload(); break;
    case 'img':    action_img();    break;
    case 'delete': action_delete(); break;
    case 'status': action_status(); break;
    default:       json_out(['ok' => false, 'error' => 'Onbekende actie'], 400);
}

/* ---------- opslag ---------- */

function candidate_dirs(): array
{
    return [
        [dirname(__DIR__, 2) . '/bruiloft-fotos', 'buiten webroot'],
        [__DIR__ . '/uploads', 'binnen webroot'],
    ];
}

// De eerste map waar geschreven kan worden. Buiten de webroot als het kan.
function write_dir(): array
{
    foreach (candidate_dirs() as [$path, $label]) {
        if (!is_dir($path)) {
            @mkdir($path, 0755, true);
        }
        if (is_dir($path) && is_writable($path)) {
            return [$path, $label];
        }
    }
    return [null, 'geen'];
}

// Alle mappen die bestaan, zodat lezen ook werkt als de voorkeur ooit wisselt.
function read_dirs(): array
{
    $dirs = [];
    foreach (candidate_dirs() as [$path]) {
        if (is_dir($path)) {
            $dirs[] = $path;
        }
    }
    return $dirs;
}

/* ---------- eigenaarschap ----------
   Elk toestel houdt een eigen sleutel in localStorage. De server bewaart daar
   alleen een hash van, zodat een gestolen bestand niemand toegang geeft. Dit is
   geen echte login: het is genoeg om te voorkomen dat gasten elkaars foto's
   aanraken, en niet meer dan dat. */

function owner_token(): string
{
    $raw = (string) ($_POST['owner'] ?? $_GET['owner'] ?? '');
    return preg_match('/^[a-f0-9]{32}$/', $raw) === 1 ? $raw : '';
}

function owner_hash(string $token): string
{
    return $token === '' ? '' : hash('sha256', 'bruiloft:' . $token);
}

function viewer_hash(): string
{
    return owner_hash(owner_token());
}

function owns(array $meta): bool
{
    $viewer = viewer_hash();
    return $viewer !== '' && hash_equals((string) ($meta['owner'] ?? ''), $viewer);
}

/* ---------- hulpfuncties ---------- */

function json_out(array $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function valid_id(string $id): bool
{
    return (bool) preg_match('/^[a-f0-9]{24}$/', $id);
}

function read_meta(string $dir, string $id): ?array
{
    $file = $dir . '/' . $id . '.json';
    if (!is_file($file)) {
        return null;
    }
    $meta = json_decode((string) file_get_contents($file), true);
    return is_array($meta) ? $meta : null;
}

function sniff(string $path): string
{
    if (function_exists('finfo_open')) {
        $fi = finfo_open(FILEINFO_MIME_TYPE);
        if ($fi) {
            $mime = finfo_file($fi, $path);
            finfo_close($fi);
            if (is_string($mime)) {
                return $mime;
            }
        }
    }
    $size = @getimagesize($path);
    return ($size && !empty($size['mime'])) ? (string) $size['mime'] : 'application/octet-stream';
}

function clean_caption(string $raw): string
{
    $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $raw) ?? '';
    $text = trim(preg_replace('/\s+/u', ' ', $text) ?? '');
    if (function_exists('mb_substr')) {
        return mb_substr($text, 0, MAX_CAPTION, 'UTF-8');
    }
    return substr($text, 0, MAX_CAPTION);
}

function public_item(array $meta): array
{
    return [
        'id'      => (string) $meta['id'],
        'caption' => (string) ($meta['caption'] ?? ''),
        'ts'      => (int) ($meta['ts'] ?? 0),
        'w'       => (int) ($meta['w'] ?? 0),
        'h'       => (int) ($meta['h'] ?? 0),
        'mine'    => owns($meta),
    ];
}

function write_meta(string $dir, array $meta): void
{
    file_put_contents(
        $dir . '/' . $meta['id'] . '.json',
        json_encode($meta, JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );
}

/* ---------- acties ---------- */

function action_list(): void
{
    $items = [];
    foreach (read_dirs() as $dir) {
        foreach (glob($dir . '/*.json') ?: [] as $file) {
            $meta = json_decode((string) file_get_contents($file), true);
            if (!is_array($meta) || empty($meta['id'])) {
                continue;
            }
            $items[] = public_item($meta);
        }
    }
    usort($items, function (array $a, array $b): int {
        return $b['ts'] <=> $a['ts'];
    });
    json_out(['ok' => true, 'count' => count($items), 'items' => $items]);
}

function action_upload(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        json_out(['ok' => false, 'error' => 'POST verwacht'], 405);
    }
    [$dir] = write_dir();
    if ($dir === null) {
        json_out(['ok' => false, 'error' => 'De opslag is niet beschrijfbaar'], 500);
    }

    $photo = $_FILES['photo'] ?? null;
    if (!is_array($photo) || (int) ($photo['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        json_out(['ok' => false, 'error' => 'Geen foto ontvangen'], 400);
    }
    if ((int) $photo['size'] > MAX_BYTES) {
        json_out(['ok' => false, 'error' => 'De foto is te groot'], 413);
    }
    $mime = sniff((string) $photo['tmp_name']);
    if (!isset(TYPES[$mime])) {
        json_out(['ok' => false, 'error' => 'Alleen JPEG, PNG of WebP'], 415);
    }
    $size = @getimagesize((string) $photo['tmp_name']);
    if (!$size || (int) $size[0] < 1 || (int) $size[1] < 1) {
        json_out(['ok' => false, 'error' => 'Het bestand is geen geldige afbeelding'], 415);
    }

    // De miniatuur is optioneel; zonder wordt de grote versie gebruikt.
    $thumb = $_FILES['thumb'] ?? null;
    $tmime = null;
    if (is_array($thumb) && (int) ($thumb['error'] ?? 1) === UPLOAD_ERR_OK && (int) $thumb['size'] <= MAX_BYTES) {
        $candidate = sniff((string) $thumb['tmp_name']);
        if (isset(TYPES[$candidate]) && @getimagesize((string) $thumb['tmp_name'])) {
            $tmime = $candidate;
        }
    }

    $caption = clean_caption((string) ($_POST['caption'] ?? ''));

    // Twaalf hex tekens tijd in milliseconden plus twaalf willekeurig.
    $id   = sprintf('%012x', (int) floor(microtime(true) * 1000)) . bin2hex(random_bytes(6));
    $base = $dir . '/' . $id;

    if (!move_uploaded_file((string) $photo['tmp_name'], $base . '.' . TYPES[$mime])) {
        json_out(['ok' => false, 'error' => 'Opslaan is mislukt'], 500);
    }
    if ($tmime !== null && !move_uploaded_file((string) $thumb['tmp_name'], $base . '.thumb.' . TYPES[$tmime])) {
        $tmime = null;
    }

    // Het JSON bestand komt als laatste, zodat een half geschreven foto nooit in de lijst staat.
    $meta = [
        'id'      => $id,
        'caption' => $caption,
        'ts'      => time(),
        'w'       => (int) $size[0],
        'h'       => (int) $size[1],
        'mime'    => $mime,
        'tmime'   => $tmime,
        'owner'   => owner_hash(owner_token()),
    ];
    write_meta($dir, $meta);

    json_out(['ok' => true, 'item' => public_item($meta)]);
}

function action_update(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        json_out(['ok' => false, 'error' => 'POST verwacht'], 405);
    }
    $id = (string) ($_POST['id'] ?? '');
    if (!valid_id($id)) {
        json_out(['ok' => false, 'error' => 'Ongeldig id'], 400);
    }
    foreach (read_dirs() as $dir) {
        $meta = read_meta($dir, $id);
        if ($meta === null) {
            continue;
        }
        if (!owns($meta) && !admin_ok()) {
            json_out(['ok' => false, 'error' => 'Dit is niet jouw foto'], 403);
        }
        $meta['caption'] = clean_caption((string) ($_POST['caption'] ?? ''));
        write_meta($dir, $meta);
        json_out(['ok' => true, 'item' => public_item($meta)]);
    }
    json_out(['ok' => false, 'error' => 'Foto niet gevonden'], 404);
}

function action_img(): void
{
    $id   = (string) ($_GET['id'] ?? '');
    $size = ((string) ($_GET['s'] ?? 'full')) === 'thumb' ? 'thumb' : 'full';
    if (!valid_id($id)) {
        http_response_code(400);
        exit;
    }
    foreach (read_dirs() as $dir) {
        $meta = read_meta($dir, $id);
        if ($meta === null) {
            continue;
        }
        $mime = (string) ($meta['mime'] ?? 'image/jpeg');
        $file = $dir . '/' . $id . '.' . (TYPES[$mime] ?? 'jpg');
        if ($size === 'thumb' && !empty($meta['tmime'])) {
            $mime = (string) $meta['tmime'];
            $file = $dir . '/' . $id . '.thumb.' . (TYPES[$mime] ?? 'jpg');
        }
        if (!is_file($file)) {
            break;
        }
        header('Content-Type: ' . $mime);
        header('Content-Length: ' . (string) filesize($file));
        header('Cache-Control: public, max-age=31536000, immutable');
        header('Content-Disposition: inline; filename="' . $id . '.' . (TYPES[$mime] ?? 'jpg') . '"');
        readfile($file);
        exit;
    }
    http_response_code(404);
    exit;
}

// Verwijderen kan alleen met de sleutel uit het bestand .beheer in de opslagmap.
// Bestaat dat bestand niet, dan staat verwijderen volledig uit.
function admin_ok(): bool
{
    $key = admin_key();
    if ($key === null) {
        return false;
    }
    $given = (string) ($_POST['key'] ?? '');
    return $given !== '' && hash_equals($key, $given);
}

function action_delete(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        json_out(['ok' => false, 'error' => 'POST verwacht'], 405);
    }
    $id = (string) ($_POST['id'] ?? '');
    if (!valid_id($id)) {
        json_out(['ok' => false, 'error' => 'Ongeldig id'], 400);
    }
    $allowed = admin_ok();
    if (!$allowed) {
        foreach (read_dirs() as $dir) {
            $meta = read_meta($dir, $id);
            if ($meta !== null) {
                $allowed = owns($meta);
                break;
            }
        }
    }
    if (!$allowed) {
        json_out(['ok' => false, 'error' => 'Dit is niet jouw foto'], 403);
    }
    $removed = false;
    foreach (read_dirs() as $dir) {
        foreach (glob($dir . '/' . $id . '.*') ?: [] as $file) {
            if (@unlink($file)) {
                $removed = true;
            }
        }
    }
    json_out(['ok' => $removed, 'error' => $removed ? null : 'Foto niet gevonden'], $removed ? 200 : 404);
}

function admin_key(): ?string
{
    foreach (read_dirs() as $dir) {
        $file = $dir . '/.beheer';
        if (is_file($file)) {
            $key = trim((string) file_get_contents($file));
            return $key !== '' ? $key : null;
        }
    }
    return null;
}

function action_status(): void
{
    [$dir, $label] = write_dir();
    $count = 0;
    foreach (read_dirs() as $d) {
        $count += count(glob($d . '/*.json') ?: []);
    }
    json_out([
        'ok'             => $dir !== null,
        'opslag'         => $label,
        'beschrijfbaar'  => $dir !== null,
        'fotos'          => $count,
        'beheer'         => admin_key() !== null,
        'php'            => PHP_VERSION,
        'fileinfo'       => function_exists('finfo_open'),
        'upload_max'     => ini_get('upload_max_filesize'),
        'post_max'       => ini_get('post_max_size'),
    ]);
}
