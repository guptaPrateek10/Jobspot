"use server";

import { z } from "zod";
import { companySchema, jobSchema, jobSeekerSchema } from "./utils/zodSchemas";
import { requireUser } from "./utils/requireUser";
import { prisma } from "./utils/prisma";
import { redirect } from "next/navigation";
import arcjet, { detectBot, shield } from "./utils/arcjet";
import { ArcjetNextRequest, request } from "@arcjet/next";

const aj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  );

export async function createCompany(data: z.infer<typeof companySchema>) {
  try {
    //getting the user from the session
    const user = await requireUser();

    //creating a request object from arcjet
    const req: ArcjetNextRequest = await request();
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      throw new Error("Forbidden");
    }

    if (!user?.id) {
      throw new Error("User not found");
    }

    const validatedData = companySchema.parse(data);

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        onboardingCompleted: true,
        userType: "COMPANY",
        Company: {
          create: {
            ...validatedData,
          },
        },
      },
    });

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }
  } catch (error) {
    console.error("Create company error:", error);
    throw error;
  }

  return redirect("/");
}

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
  const user = await requireUser();

  //creating a request object from arcjet
  const req: ArcjetNextRequest = await request();
  const decision = await aj.protect(req);
  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  const validatedData = jobSeekerSchema.parse(data);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      onboardingCompleted: true,
      userType: "JOB_SEEKER",
      JobSeeker: {
        create: {
          ...validatedData,
        },
      },
    },
  });

  return redirect("/");
}

export async function createJob(data: any) {
  const user = await requireUser();

  //creating a request object from arcjet
  const req: ArcjetNextRequest = await request();
  const decision = await aj.protect(req);

  if (decision.isDenied()) {
    throw new Error("Forbidden");
  }

  //validate the inputted data.
  const validatedData = await jobSchema.parse(data);

  const company = await prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!company?.id) {
    redirect("/");
  }

  const jobPost = await prisma.jobPost.create({
    data: {
      companyId: company?.id,
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
    },
  });
}
