import { model, models, Schema } from "mongoose";

const attendanceSchema = new Schema(
    {
        member: {
            type: Schema.Types.ObjectId,
            ref: "Member",
            required: true,
        },
    },
    { timestamps: true },
);

attendanceSchema.index({ member: 1, createdAt: -1 });

const Attendance = models.Attendance || model("Attendance", attendanceSchema);

export default Attendance;
