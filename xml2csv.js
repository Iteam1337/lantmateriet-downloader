const fs = require('fs')
const { XMLParser } = require('fast-xml-parser')
const gps = require('swe-coords')

/* convert '6563450.0 334454.0' -> ['N 6563450', 'E 334454'] */
const sweRef = (position) => 
  [`N ${position.split(' ')[0].split('.')[0]}`, `E ${position.split(' ')[1].split('.')[0]}`]

const mapper = ({
    objektidentitet: id, 

    Adressplatsattribut: {
      postort, 
      postnummer, 
      Adressplatsbeteckning: {
        adressplatsnummer: nr,
        bokstavstillagg
      },
      adressplatstyp: typ,
      Adressplatspunkt: {
        'gml:Point': {'gml:pos': position}
      }
    } = {}, 
    Adressomrade: {
      faststalltNamn: gata,
      Kommundel: {
        faststalltNamn: kommun  
      } = {}
    } = {}
  }) => ({
    id, 
    gata, 
    nr, 
    bokstavstillagg, 
    postnummer, 
    postort, 
    kommun, 
    position: gps.toLatLng(sweRef(position)[0], sweRef(position)[1])
  })

const parse = (file) => {
  const binary = fs.readFileSync(file)
  const parser = new XMLParser()
  const xml = parser.parse(binary.toString())
  
  const addresses = xml['BelagenhetsadressResponse']['BelagenhetsadressMember']
  return addresses.map(a => a.Belagenhetsadress).map(mapper)

}

const header = () => 'id,name,street,number,zipcode,city,lat,lon,source,layer'
  

const toCsv = ({ id, 
  gata, 
  nr, bokstavstillagg, postnummer, postort, kommun, position }) =>
([
  id,
  JSON.stringify(gata + ' ' + (nr ?? '') + (bokstavstillagg ?? '')), 
  JSON.stringify(gata), 
  (nr ?? '') + (bokstavstillagg ?? ''), 
  postnummer, 
  postort, 
  position.lat, 
  position.lng, 
  'Lantmateriet', 
  'address'].join(','))
  
module.exports = {
  parse,
  toCsv,
  header
}