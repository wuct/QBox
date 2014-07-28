/index.html
/styles/app.css
/scripts/main.js
/scripts/vendor.js


 convert Qbox-no-background.png  -bordercolor white -border 0 \
          \( -clone 0 -resize 16x16 \) \
          \( -clone 0 -resize 32x32 \) \
          \( -clone 0 -resize 48x48 \) \
          \( -clone 0 -resize 64x64 \) \
          -delete 0 -alpha off -colors 256 favicon.ico

 convert Qbox-no-background.png  \
          \( -clone 0 -resize 16x16 -write favicon16.png \) \
          \( -clone 0 -resize 32x32 -write favicon32.png \) \
          \( -clone 0 -resize 512x512 -write favicon512.png \) \
          \( -clone 0 -resize 120x120 -write favicon120.png \) \
          \( -clone 0 -resize 76x76 -write favicon76.png \) \
          null:
