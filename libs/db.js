import {v4 as uuidv4} from 'uuid';

const db = new Map();

export function connectDb() {
    return db;
}

export class Schema {
    constructor(name, options, db) {
        this.nameScheme = name;
        this.db = db;
        this.options = options;
        this.#checkCollection();
    }

    #checkCollection() {
        if (this.db.get(this.nameScheme)) return
        this.db.set(this.nameScheme, new Map())
    }

    #checkIdInCollection(id) {
        return this.db.get(this.nameScheme).has(id);
    }

    #getAllDocInCollection(nameScheme) {
        const recipeMap = this.db.get(nameScheme).entries();
        const array = [];
        for (let [id, doc] of recipeMap) {
            array.push({_id: id, ...doc})
        }
        return array;
    }
    #valid(docValue, nameOption, option) {
        try {
            if (docValue !== undefined) {
                if ("type" in option) {
                    if (typeof docValue !== option["type"]) {
                        throw new Error(`field '${nameOption}' - property 'type' expects a '${option["type"]}' value`);
                    }
                }

            } else {
                if ("required" in option && option["required"]) {
                    throw new Error(`field '${nameOption}' - property  'required' set to '${option["required"]}'`);
                }
            }

            return {status: true, error: null};
        } catch (e) {
            return {status: false, error: e.message};
        }

    }

    #validProps(doc) {
        const props = Object.getOwnPropertyNames(this.options);
        let res = {
            status: false,
            error: null,
            result: {}
        };
        for (let i = 0; i < props.length; i++) {
            let nameOption = props[i];
            let option = this.options[nameOption];
            let docValue = doc[nameOption];
            let data = this.#valid(docValue, nameOption, option);
            res.status = data.status;
            res.error = data.error;
            if (data.status) {
                if(docValue) res.result[nameOption] = docValue;
            } else {
                return res;
            }
        }
        return res;
    }

    async save(conditions) {
        const valid = this.#validProps(conditions);
        if (!valid.status) throw new Error(valid.error);

        let data = valid.result;
        let _id =  "_id" in conditions ? conditions["_id"] : null;
        if(_id) {
            return new Error('_id parameter cannot be used');
        }
        this.#checkCollection();
        const map = this.db.get(this.nameScheme);
        let id = uuidv4();
        if(this.#checkIdInCollection(id)) {
            id = uuidv4();
        }
        map.set(id, data);
        return { _id: id, ...map.get(id) };
    }

    async findById(_id) {
        const map = this.db.get(this.nameScheme).get(_id);
        if (map) {
            return {_id: _id, ...map};
        }
        return null;
    }

    async find(conditions) {
        let res = [];
        let _id = "_id" in conditions ? conditions["_id"] : null;
        if (_id) {
            let doc = await this.findById(_id);
            if(!doc) return null;

            res.push();
            return res;
        }
        const props = Object.getOwnPropertyNames(conditions);
        if (props.length === 0) return this.#getAllDocInCollection(this.nameScheme)

        const recipeMap = this.db.get(this.nameScheme).entries();

        for (let [id, doc] of recipeMap) {
            for (let i = 0; i < props.length; i++) {
                let prop = props[i];
                if (prop in doc) {
                    if (doc[prop] === conditions[prop]) {
                        res.push(await this.findById(id));
                    } else {
                        break;
                    }
                }
            }
        }
        return res;
    }

    async findOne(conditions) {

        let res = null;
        let _id = "_id" in conditions ? conditions["_id"] : null;
        if (_id) {
            res = await this.findById(_id);
            return res;
        }
        const props = Object.getOwnPropertyNames(conditions);
        const recipeMap = this.db.get(this.nameScheme).entries();

        for (let [id, doc] of recipeMap) {
            for (let i = 0; i < props.length; i++) {
                let prop = props[i];
                if (prop in doc) {
                    if (doc[prop] === conditions[prop]) {
                        res = await this.findById(id);
                        if (i === props.length - 1) return res;
                    } else {
                        break;
                    }
                }
            }
        }
        return res
    }

    async updateOne(filter, conditions) {
        const doc = await this.findOne(filter);
        if (!doc) return null
        let _id = doc._id;
        delete doc._id;

        const map = this.db.get(this.nameScheme);
        map.set(_id, {...doc, ...conditions});
        return await this.findById(_id);
    }

    async deleteOne(filter) {
        const doc = await this.findOne(filter);
        if (!doc) return null
        let _id = doc._id;
        const map = this.db.get(this.nameScheme);
        map.delete(_id);
        return doc;
    }
}


// export const userScheme = new Schema("User", {
//     username: {
//         type: "string",
//         required: true
//     },
//     age: {
//         type: "number",
//         required: true
//     },
//     hobbies: {
//         type: "object",
//         required: true
//     }
// }, connectDb());

// const objectIdHexRegexp = /^[0-9A-Fa-f]{24}$/;
