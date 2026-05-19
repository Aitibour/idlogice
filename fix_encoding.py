import os

replacements = [
    ("â", "—"),   # â€" -> em dash
    ("â", "’"),   # â€™ -> right single quote
    ("â", "“"),   # â€œ -> left double quote
    ("â", "”"),   # â€ -> right double quote
    ("â¦", "…"),   # â€¦ -> ellipsis
    ("Â·", "·"),         # Â· -> middle dot
    ("MontrÃ©al", "Montréal"),  # MontrÃ©al -> Montréal
    ("Ã©", "é"),         # Ã© -> é
    ("â", "★"),   # â˜… -> star
    ("â", "✉"),   # âœ‰ -> envelope
    ("ð", "\U0001f4de"),  # ðŸ"ž -> phone
]

root = r"C:\Users\Abdel\Documents\Claude Code\IDLOGICE\app\src"
exts = (".tsx", ".ts", ".js", ".json")
fixed = []

for dirpath, dirs, files in os.walk(root):
    dirs[:] = [d for d in dirs if d != "node_modules"]
    for fname in files:
        if not fname.endswith(exts):
            continue
        path = os.path.join(dirpath, fname)
        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            new = content
            for bad, good in replacements:
                new = new.replace(bad, good)
            if new != content:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new)
                fixed.append(path.replace(root + os.sep, ""))
        except Exception as e:
            print(f"SKIP {fname}: {e}")

print(f"Fixed {len(fixed)} files:")
for p in fixed:
    print(" ", p)
