const fs = require('fs');
const zipper = require('zip-local');
const cmd = require('node-cmd');
const path = require("path");
const { minify } = require('html-minifier-terser');
const UglifyJS = require("uglify-js");

async function build() {
//Remove old build stuff
fs.rmSync(__dirname + "/temp/", { recursive: true, force: true });
fs.rmSync("build.zip", { force: true });

//Clone to public folder
fs.cpSync(__dirname + "/public/", __dirname + "/temp/", { recursive: true })

//bundle js
cmd.runSync("rollup temp/index.js --format iife --file temp/index.js")

//Remove old kontra.min.mjs file
fs.rmSync("temp/kontra.min.mjs", { force: true });

//Minify HTML, CSS, JS
const minifyAllFiles = async (dir) => {
  let files = fs.readdirSync(dir)
  for (let file of files) {
    let absolute = path.join(dir, file)
    if (fs.statSync(absolute).isDirectory()) {
        minifyAllFiles(absolute)
    } else {
        if (absolute.endsWith(".html")) {
          let data = fs.readFileSync(absolute, 'utf8')
          let result = await minify(data, {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            decodeEntities: true,
            html5: true,
            minifyCSS: true,
            minifyJS: true,
            processConditionalComments: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            sortAttributes: true,
            sortClassName: true,
            trimCustomFragments: true,
            useShortDoctype: true,
          })
          fs.writeFileSync(absolute, result)
        } else if (absolute.endsWith(".css")) {
          let data = fs.readFileSync(absolute, 'utf8')
          let result = data.replace(/(\/\*[^]+?\*\/|\s)+/g," ").replace(/^ |([ ;]*)([^\w:*.#% -])([ ;]*)|\*?(:) */g,"$2$4")
          fs.writeFileSync(absolute, result)
        } else if (absolute.endsWith(".js")) {
          let data = fs.readFileSync(absolute, 'utf8')
          let result = UglifyJS.minify(data)
          fs.writeFileSync(absolute, result.code || data)
          cmd.runSync("npx roadroller " + absolute +  " -o " + absolute)
        }
    }
  }
}

var finished = await minifyAllFiles("temp/")

//Zip it
zipper.sync.zip(__dirname + "/temp/").compress().save("build.zip")

//Delete temp folder
fs.rmSync(__dirname + "/temp/", { recursive: true, force: true });
  
//Get size
var size = fs.statSync("build.zip").size

//Built message
console.log("Built Game")

if (size > 13312) {
  console.log("\tGAME TO LARGE")
  console.log("\t" + (size - 13312) + " over")
}

console.log("\t" + size + " of 13312 bytes used")
var percent = (size / 13312) * 100
console.log("\t" + Number(Number(percent).toFixed(2)) + "% used")
}

build()