const PATTERNS = {
  name: ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona', 'George', 'Hannah', 'Ivan', 'Julia', 'Kevin', 'Laura', 'Michael', 'Nina', 'Oscar', 'Patricia', 'Quinn', 'Rachel', 'Samuel', 'Tina', 'Ulysses', 'Victoria', 'William', 'Xena', 'Yuri', 'Zara'],
  lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Moore', 'Allen'],
  email_domains: ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'company.com', 'work.org'],
  cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte'],
  countries: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'India', 'Brazil', 'Mexico'],
  departments: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product', 'Support', 'Legal'],
  products: ['Laptop', 'Phone', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Headphones', 'Camera', 'Speaker', 'Charger'],
  statuses: ['Active', 'Inactive', 'Pending', 'Completed', 'Cancelled'],
};

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomDate(startYear = 2020, endYear = 2025) {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function randomPhone() {
  return `+1-${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
}

function generateEmailFromName(name) {
  if (!name) return `user${randomInt(1, 9999)}@${randomFromArray(PATTERNS.email_domains)}`;
  const cleaned = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${cleaned}@${randomFromArray(PATTERNS.email_domains)}`;
}

function detectColumnType(columnName, sampleValues) {
  const name = columnName.toLowerCase();
  const values = sampleValues.filter(v => v !== null && v !== undefined && v !== '');

  if (name.includes('first') && name.includes('name')) return 'firstName';
  if (name.includes('last') && name.includes('name')) return 'lastName';
  if (name.includes('name') || name.includes('person')) return 'fullName';

  if (name.includes('email') || name.includes('mail')) return 'email';
  if (name.includes('phone') || name.includes('mobile') || name.includes('tel')) return 'phone';

  if (name.includes('city') || name.includes('town')) return 'city';
  if (name.includes('country') || name.includes('nation')) return 'country';
  if (name.includes('address') || name.includes('street')) return 'address';
  if (name.includes('zip') || name.includes('postal')) return 'zipCode';

  if (name.includes('date') || name.includes('time') || name.includes('created') || name.includes('updated')) return 'date';

  if (name.includes('status') || name.includes('state')) return 'status';
  if (name.includes('department') || name.includes('dept')) return 'department';
  if (name.includes('product') || name.includes('item')) return 'product';

  if (name.includes('age')) return 'age';
  if (name.includes('salary') || name.includes('income') || name.includes('pay')) return 'salary';
  if (name.includes('price') || name.includes('cost') || name.includes('amount')) return 'price';
  if (name.includes('quantity') || name.includes('qty') || name.includes('count')) return 'quantity';
  if (name.includes('score') || name.includes('rating')) return 'score';
  if (name.includes('id') && name.length <= 4) return 'id';

  if (values.length > 0 && values.every(v => !isNaN(parseFloat(v)))) {
    const nums = values.map(Number);
    const max = Math.max(...nums);
    if (max <= 1) return 'percentage';
    if (Number.isInteger(nums[0])) return 'integer';
    return 'float';
  }

  const uniqueValues = [...new Set(values)];
  if (uniqueValues.length <= 10 && uniqueValues.length > 0) return 'categorical';

  return 'text';
}

function generateValue(type, columnName, sampleValues, rowIndex, rowContext) {
  switch (type) {
    case 'firstName':
      return randomFromArray(PATTERNS.name);
    case 'lastName':
      return randomFromArray(PATTERNS.lastName);
    case 'fullName':
      return `${randomFromArray(PATTERNS.name)} ${randomFromArray(PATTERNS.lastName)}`;
    case 'email': {

      const nameValue = rowContext.__generatedName || null;
      return generateEmailFromName(nameValue);
    }
    case 'phone':
      return randomPhone();
    case 'city':
      return randomFromArray(PATTERNS.cities);
    case 'country':
      return randomFromArray(PATTERNS.countries);
    case 'address':
      return `${randomInt(100, 9999)} ${randomFromArray(['Main', 'Oak', 'Pine', 'Elm', 'Cedar', 'Maple'])} ${randomFromArray(['St', 'Ave', 'Blvd', 'Dr', 'Ln'])}`;
    case 'zipCode':
      return String(randomInt(10000, 99999));
    case 'date':
      return randomDate();
    case 'status':
      return sampleValues.length > 0 ? randomFromArray([...new Set(sampleValues.filter(Boolean))]) : randomFromArray(PATTERNS.statuses);
    case 'department':
      return randomFromArray(PATTERNS.departments);
    case 'product':
      return randomFromArray(PATTERNS.products);
    case 'age':
      return randomInt(18, 75);
    case 'salary':
      return randomInt(30000, 150000);
    case 'price':
      return randomFloat(1, 999);
    case 'quantity':
      return randomInt(1, 100);
    case 'score':
      return randomFloat(0, 10, 1);
    case 'id':
      return rowIndex + 1;
    case 'percentage':
      return randomFloat(0, 1, 4);
    case 'integer': {
      const nums = sampleValues.filter(v => !isNaN(v)).map(Number);
      const min = nums.length > 0 ? Math.min(...nums) : 0;
      const max = nums.length > 0 ? Math.max(...nums) : 100;
      const range = max - min || 10;
      return randomInt(Math.max(0, min - Math.floor(range * 0.2)), max + Math.floor(range * 0.2));
    }
    case 'float': {
      const nums = sampleValues.filter(v => !isNaN(v)).map(Number);
      const min = nums.length > 0 ? Math.min(...nums) : 0;
      const max = nums.length > 0 ? Math.max(...nums) : 100;
      const range = max - min || 10;
      return randomFloat(min - range * 0.2, max + range * 0.2);
    }
    case 'categorical': {
      const uniqueVals = [...new Set(sampleValues.filter(Boolean))];
      return uniqueVals.length > 0 ? randomFromArray(uniqueVals) : `Category_${randomInt(1, 5)}`;
    }
    case 'text':
    default: {
      if (sampleValues.length > 0) {
        const filtered = sampleValues.filter(Boolean);
        if (filtered.length > 0) return randomFromArray(filtered);
      }
      return `${columnName}_${randomInt(1, 1000)}`;
    }
  }
}

export function generateSyntheticData(columns, sampleData, numRecords) {

  const columnTypes = {};
  columns.forEach(col => {
    const sampleValues = sampleData.map(row => row[col]).filter(v => v !== undefined);
    columnTypes[col] = detectColumnType(col, sampleValues);
  });

  const nameColumns = columns.filter(col =>
    ['firstName', 'lastName', 'fullName'].includes(columnTypes[col])
  );
  const emailColumns = columns.filter(col => columnTypes[col] === 'email');

  const generatedData = [];
  for (let i = 0; i < numRecords; i++) {
    const row = {};
    const rowContext = { __generatedName: null };

    const orderedColumns = [
      ...nameColumns,
      ...columns.filter(col => !nameColumns.includes(col)),
    ];

    orderedColumns.forEach(col => {
      const sampleValues = sampleData.map(r => r[col]).filter(v => v !== undefined && v !== '');
      row[col] = generateValue(columnTypes[col], col, sampleValues, i, rowContext);

      if (['firstName', 'lastName', 'fullName'].includes(columnTypes[col])) {
        if (rowContext.__generatedName) {
          rowContext.__generatedName += ' ' + row[col];
        } else {
          rowContext.__generatedName = row[col];
        }
      }
    });

    generatedData.push(row);
  }

  return generatedData;
}

export default generateSyntheticData;