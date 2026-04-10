import { model, models, Schema } from "mongoose";

const memberSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        gymCode: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

const Member = models.Member || model("Member", memberSchema);

export default Member;
