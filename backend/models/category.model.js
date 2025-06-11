const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String
}, { timestamps: true })
