Lantmäteriet downloader
===

Use this to download and convert Belägenhetsadresser from Lantmäteriet and convert them to a format compatible with Pelias.

## How to use

Add these keys to an .env file
    
    ORDER_ID=
    ORDER_KEY=

Then use this command to download and store your csv

    node index.js > out.csv

## How to get the keys

Request your data here:
https://kundportalen.etjanster.lantmateriet.se/bestallning/kundkategori

Wait for the email. Use the information from the email to download your data:
Example:

    Orderid: 50012345_600001 <- this is your order_id 
    Ordernyckel: 0123432-5678-9765b-a4e0-f4dbc56addb7 <- this is your order_key - FALSE: go to the download area and copy this guid from the url
