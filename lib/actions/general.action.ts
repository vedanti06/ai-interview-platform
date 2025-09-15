"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import z from "zod";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;
  console.log(interviewId, userId, transcript, feedbackId);  

  try {
    // const formattedTranscript = transcript
    //   .map(
    //     (sentence: { role: string; content: string }) =>
    //       `- ${sentence.role}: ${sentence.content}\n`
    //   )
    //   .join("");

    const { object } = await generateObject({
      model: google("gemini-2.5-pro"),
      schema: z.object({
        totalScore: z.number(),
        categoryScores: z.array(
          z.object({
            name: z.enum([
              "Communication Skills",
              "Technical Knowledge",
             
              "Problem Solving",
              "Cultural Fit",
              "Confidence and Clarity",
            ]),
            score: z.number(),
            comment: z.string(),
          })
        ),
        strengths: z.array(z.string()),
        areasForImprovement: z.array(z.string()),
        finalAssessment: z.string(),
      }),
      prompt:  `You are an AI interviewer analyzing a mock interview. 
        Return JSON that matches the schema exactly.

        Transcript:
        '${transcript.map((t) => `${t.role}: ${t.content}`).join("\n")}'

        Provide:
        - totalScore (0–100)
        - categoryScores (5 objects with name, score, comment)
        - strengths (array of strings)
        - areasForImprovement (array of strings)
        - finalAssessment (string)
      `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });
 console.log("Generated object raw:", JSON.stringify(object, null, 2));

    console.log({ object });
   

    if (!object || !object.totalScore) {
      throw new Error("Failed to generate feedback. Please try again.");
    } 
    console.log(object.totalScore); 
    console.log(object.categoryScores);
    console.log(object.strengths);
    console.log(object.areasForImprovement);
    console.log(object.finalAssessment);  


    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

   let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } 
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
  console.error("Error saving feedback:", error?.message, error);
  return { success: false, error: error?.message || "Unknown error" };
}


  
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;
  if (!userId) 
    return {} as Feedback;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;
  if (!userId) 
    return null;
  const interviews = await db
    .collection("interviews")
    .where("finalized", "==", true)
    .orderBy("userId")
    .where("userId", "!=", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  if (!userId) return null;

  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}