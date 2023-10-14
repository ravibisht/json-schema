const OPERATION_TYPES = {
    LOWER_CASE: 'STR_LOWER_CASE'
}

const SCHEMA_TYPES = {
    JSON_OBJECT: 'JSON_OBJECT'
}

const { JSON_OBJECT} = SCHEMA_TYPES
const { LOWER_CASE} = OPERATION_TYPES


const personalSchema = {
    userFinancialDetails: {
        type: JSON_OBJECT,
        properties: {
            first_name: {
                type: 'string',
                operation: 'lowercase'
            },
            last_name: {
                type: 'string',
                operation: 'uppercase'
            },
            city: {
                type: 'custom',
                operation: async function getCityName(accountNo) {
                    return accountNo + 10
                }
            },
            dateOfBirth: {
               type: 'date',
               format: 'YYYY-MM-DD'
            }
        }
    },
    userPersonalDetails : {
        type : 'object',
        properties:  {
            first_name : {
                type: 'string',
                operation : 'uppercase'
            }
        }
    }
}

async function  transform(schema, data,) {
    console.log(schema)
    
    for (const item in schema) {
        console.log('item',item)
        const currentSchema = schema[item]
        const currentItem = data[item]

        if (currentSchema.type === JSON_OBJECT && typeof currentSchema.type === 'string') {
            data[item] = JSON.parse(data[item])
            schema[item].type = Array.isArray(data[item]) ? 'array' : typeof data[item]
            return transform(schema[item].properties, data[item])
        }

        if (currentSchema.type === 'object') {
            return transform(currentSchema.properties, data[item])
        }

        if (currentSchema.type === 'string') {
            data[item] = stringOperation(currentSchema.operation, data[item])
        }

        if (currentSchema.type === 'custom') {
            data[item] = currentSchema.operation(data[item])
        }
    }
    return data
}


function stringOperation(operationType, data) {
    if ('uppercase' === operationType) return data.toUpperCase()
    if ('lowercase' === operationType) return data.toLowerCase()
}

const data = {
    userFinancialDetails: `{"id":1,"first_name":"Alyss","last_name":"Tomini","email":"atomini0@mlb.com","gender":"Female","ip_address":"228.239.187.152" , "accountNo": 20  }`,
    userPersonalDetails: {
        first_name:"Stark",
        last_name :"Tomini",
        mobileNo:"atomini0@mlb.com",
        gender :"Female"
    },

}
