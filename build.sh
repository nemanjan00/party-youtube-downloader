cd ./public

npm install

cd ..

asar p ../ ./app.asar

mkdir -p ./build

mv ./app.asar ./build

cd ./build

# Download packages

if [ ! -f ./electron-v1.2.2-win32-x64.zip ]; then
    wget https://github.com/atom/electron/releases/download/v1.2.2/electron-v1.2.2-win32-x64.zip
fi

if [ ! -f ./electron-v1.2.2-win32-ia32.zip ]; then
    wget https://github.com/atom/electron/releases/download/v1.2.2/electron-v1.2.2-win32-ia32.zip
fi

if [ ! -f ./electron-v1.2.2-linux-x64.zip ]; then
    wget https://github.com/atom/electron/releases/download/v1.2.2/electron-v1.2.2-linux-x64.zip
fi

if [ ! -f ./electron-v1.2.2-linux-ia32.zip ]; then
    wget https://github.com/atom/electron/releases/download/v1.2.2/electron-v1.2.2-linux-ia32.zip
fi

if [ ! -f ./electron-v1.2.2-darwin-x64.zip ]; then
    wget https://github.com/atom/electron/releases/download/v1.2.2/electron-v1.2.2-darwin-x64.zip
fi

mkdir -p ./lw/resources
cp ./app.asar ./lw/resources/app.asar

# Windows

if [ ! -f ./party-youtube-downloader-windows-ia32.zip ]; then
	cp ./electron-v1.2.2-win32-ia32.zip ./party-youtube-downloader-windows-ia32.zip
fi

cd ./lw

zip -r ../party-youtube-downloader-windows-ia32.zip ./

cd ..

if [ ! -f ./party-youtube-downloader-windows-x64.zip ]; then
	cp ./electron-v1.2.2-win32-x64.zip ./party-youtube-downloader-windows-x64.zip
fi

cd ./lw

zip -r ../party-youtube-downloader-windows-x64.zip ./

cd ..

# Linux

if [ ! -f ./party-youtube-downloader-linux-ia32.zip ]; then
	cp ./electron-v1.2.2-linux-ia32.zip ./party-youtube-downloader-linux-ia32.zip
fi

cd ./lw

zip -r ../party-youtube-downloader-linux-ia32.zip ./

cd ..

if [ ! -f ./party-youtube-downloader-linux-x64.zip ]; then
	cp ./electron-v1.2.2-linux-x64.zip ./party-youtube-downloader-linux-x64.zip
fi

cd ./lw

zip -r ../party-youtube-downloader-linux-x64.zip ./

cd ..

rm -rf ./lw

# OSX

if [ ! -f ./party-youtube-downloader-darwin.zip ]; then
	cp ./electron-v1.2.2-darwin-x64.zip ./party-youtube-downloader-darwin.zip
fi

mkdir -p ./darwin/Electron.app/Contents/Resources/

cp ./app.asar ./darwin/Electron.app/Contents/Resources/

cd ./darwin/

zip -r ../party-youtube-downloader-darwin.zip ./

cd ..

rm -rf ./darwin
