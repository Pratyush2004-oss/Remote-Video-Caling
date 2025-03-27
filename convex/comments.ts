import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createComment = mutation({
  args: {
    interviewId: v.id("interviews"),
    content: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("comments", {
      content: args.content,
      rating: args.rating,
      interviewId: args.interviewId,
      interviewerId: identity.subject,
    });
  },
});

// get all the comments for an interview
export const getComments = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_interview_id", (q) =>
        q.eq("interviewId", args.interviewId)
      )
      .collect();
  },
});
