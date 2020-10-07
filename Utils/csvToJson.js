function convertToJson(csv_data) {
  let obj = {};
  let lines = csv_data.split("\n");
  let attributes = lines[0].split(",");
  let data = lines.slice(1, lines.length);

  attributes.forEach((attribute) => {
    let key = attribute.trim("\r");
    obj[key] = [];
  });
  let keys = Object.keys(obj);

  for (let i = 0; i < data.length; i++) {
    let current_row = data[i];
    let values = current_row.split(",");
    for (let j = 0; j < values.length; j++) {
      let key = keys[j];
      let value = values[j].trim();
      obj[key].push(value);
    }
  }
  return obj;
}
module.exports = convertToJson;

/*let data = `a,b,c,d,e,f,g
1,2,3,4,5,6,7
8,9,10,11,12,14,15`;
convertToJson(data);*/
