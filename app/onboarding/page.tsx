import { OnboardingForm } from "@/components/forms/onboarding/OnboardingForm";
import { prisma } from "../utils/prisma";
import { redirect } from "next/navigation";
import { requireUser } from "../utils/requireUser";

async function isOnboardingFinished(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      onboardingCompleted: true,
    },
  });
  if (user && user.onboardingCompleted === true) {
    return redirect("/");
  }
  return user;
}
export default async function Onboarding() {
  const user = await requireUser();
  await isOnboardingFinished(user.id as string);
  return (
    <div className="min-h-screen w-screen py-10 flex flex-col items-center justify-center">
      <OnboardingForm />
    </div>
  );
}
