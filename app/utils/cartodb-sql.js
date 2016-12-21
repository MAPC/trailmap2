import squel from 'npm:squel';

export default function cartodbSql(context, filters, alias, fields) {
  // squel.useFlavour('postgres');
  squel.cls.DefaultQueryBuilderOptions.tableAliasQuoteCharacter = '';

  let query = squel.select();

  let queryTable = '';
  let tableFilters = filters.filterBy('alias', alias);
  
  if (tableFilters[0])  {
    queryTable = tableFilters[0].table;  
  }

  

  if (fields) {
    query.field('*');
    let subQuery = squel.select();
    subQuery.field('*');
    fields.forEach((el) => {
      subQuery.field(el) 
    });
    subQuery.from(queryTable);
    query.from(subQuery, 'tablealias');
    queryTable = 'tablealias';
  } else {
    query.from(queryTable);
  }

  tableFilters.forEach((el) => {
    let column = `${queryTable}.${el['name']}`;
    let value = context.get(el['alias']);

    if (value || (el['type'] == 'list') || (el['type'] == 'toggle')) {
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
          //non-blank string
          if(value) {
            query.where(column + " IN " + `(${value})`);  
          } 

          // blank string
          else if (value == '' && (typeof value == "string")) {
            query.where(column + " IN " + `(-1)`);  
          } 
          break;
        case "toggle":
          if(!value) {
            query.limit(1);
          }
          break;
      }
    }


  });
  
  return query.toString();
}