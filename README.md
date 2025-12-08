# BP_HTML_09TWND

A clean and minimal starter template for building static HTML projects using **Tailwind CSS**.  
This repo is designed for simple prototypes, landing pages, student projects, or any environment where you want Tailwind without complex frameworks.

---

# 🚀 Getting Started

## 1. Download the Project (No Git Required)

If you don’t want to use Git, you can download the project as a ZIP:

1. Go to the repository page  
   https://github.com/bureaupixel/BP_HTML_09TWND
2. Click the green **Code** button  
3. Choose **Download ZIP**  
4. Extract the ZIP file on your computer  

Now you have the project folder ready to use.

---

# 📦 Install Dependencies

Open the extracted folder in your terminal:

cd BP_HTML_09TWND

Then install everything needed:
npm install

# Build Tailwind (Watch Mode)
Run:
npm run build

This will:
Read the Tailwind directives from src/input.css
Build the final CSS into dist/output.css
Watch for changes in your HTML/CSS files
Keep this running while you're working.

# Using terminal
open index.html


# How Tailwind Works Here

You write classes directly in index.html
Tailwind scans the project based on:
content: ["./*.html"]
Tailwind outputs the generated CSS into:
dist/output.css

The HTML links to this file:
<link href="./dist/output.css" rel="stylesheet">

# Customization
Edit Tailwind Settings
Modify tailwind.config.js to:
Add custom colors
Extend fonts
Add spacing
Enable plugins