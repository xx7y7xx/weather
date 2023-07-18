#!/bin/bash -x

#
# download
#

curl -s -o new_radar.gif "https://weather.bangkok.go.th/Images/Radar/radar.gif"
ls -l

#
# split
#

# Split GIF into static images
convert -coalesce new_radar.gif new_radar_frame_%d.png
ls -l

# Extract timestamp and rename static images
for file in new_radar_frame_*.png; do
  # Crop the image using the specified coordinates and dimensions
  convert "${file}" -crop 120x19+838+728 "cropped_${file}"

  timestamp=$(tesseract "cropped_${file}" stdout -c tessedit_char_whitelist='0123456789-: ' --dpi 150 --psm 6 | tr -d '[:space:]')
  if [ ! -z "$timestamp" ]; then
    # timestamp="2023-07-1421:35:00"
    # formatted_timestamp="2023-07-14 21:35:00"
    formatted_timestamp=$(echo "${timestamp}" | sed 's/\([0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\)/\1 /')
    mv "${file}" "radar_frame_timestamp_${formatted_timestamp}.png"
  fi

  rm "cropped_${file}"
done
ls -l
