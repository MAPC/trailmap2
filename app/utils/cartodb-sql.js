import squel from 'npm:squel';

export default function cartodbSql(context, filters, table, fields) {
  let query = squel.select();
  let queryTable = table;
  query.from(queryTable);

  if (fields) {
    query.field('*');
    fields.forEach((el) => {
      query.field(el) 
    });
  }

  filters.forEach((el) => {
    let column = `${table}.${el['name']}`
    let value = context.get(el['alias']);
    if(!!value && (el['table'] == queryTable)) {
      switch(el['type']) {
        case "boolean":
          query.where(column + " = " + value);
          break;
        case "range":
          let propertyValue = value;
          let parsedRangeArray = JSON.parse(propertyValue);
          query.where(column + " BETWEEN " + parsedRangeArray[0] + " AND " + parsedRangeArray[1]);
          break;
        case "list":
          // not an array for now
          // let joinedArray = value.join();
          if(!!value.length) {
            query.where(column + " IN " + `(${value})`);  
          }
          break;
        default:
          query.where(column + " = '" + value + "'");
      }
    }
  });

  return query.toString();
}