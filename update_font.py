import os

font_mapping = {
    "Syne, sans-serif": "Inter, sans-serif",
    "Syne": "Inter",
    "syne": "inter"
}

def walk_and_replace(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".jsx") or file.endswith(".css"):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    content = f.read()

                modified = content
                
                # Specifically update index.css to load Inter instead of Syne
                if file == "index.css":
                    modified = modified.replace("family=Syne:wght@400;500;600;700;800&", "family=Inter:wght@400;500;600;700;800&")
                
                for k, v in font_mapping.items():
                    modified = modified.replace(k, v)
                
                if modified != content:
                    with open(path, 'w') as f:
                        f.write(modified)
                    print(f"Updated {path}")

walk_and_replace("src")
