#!/bin/bash -x

uname -a

sudo apt-get update
sudo apt-get install -y gifsicle imagemagick tesseract-ocr tesseract-ocr-eng

## tesseract v4
#sudo apt-get install -y tesseract-ocr tesseract-ocr-eng
# tesseract v5
sudo add-apt-repository -y ppa:alex-p/tesseract-ocr5
sudo apt install -y tesseract-ocr tesseract-ocr-eng

# version check
convert --version
tesseract --version