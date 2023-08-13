import mongoose, { Document, Model, Schema, model } from "mongoose";
import { Password } from "../services/password";

interface IUser {
	email: string;
	password: string;
}

interface UserModel extends Model<UserDoc> {
    build(attrs: IUser): any;
}
 
interface UserDoc extends Document {
    email: string;
    password: string;
}

export class userDoc extends Document implements IUser {
	email: string;
	password: string;
	constructor(data: IUser) {
		super();
		this.email = data.email;
		this.password = data.password;
	}
}

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
}, {
	toJSON: {
		transform(doc, ret){
			ret.id = ret._id;
			delete ret._id;
			delete ret.password;
			delete ret.__v;
		}	
	}
});

userSchema.pre("save", async function(done) {
	if(this.isModified("password")){
		const hashed = await Password.toHash(this.get("password"));
		this.set("password", hashed);
	}
	done();
})

userSchema.statics.build = (attrs: IUser) => {
    return new User(attrs);
}

const User = model<UserDoc, UserModel>("User", userSchema);

export { User };