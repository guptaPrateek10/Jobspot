import { auth, signIn } from "@/app/utils/auth";
import Github from "../icons/Github";
import Google from "../icons/Google";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { redirect } from "next/navigation";
import { GeneralSubmitButtons } from "../general/SubmitButtons";

export async function LoginForm() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <form
                action={async () => {
                  "use server";
                  await signIn("github");
                  redirect("/");
                }}
              >
                <GeneralSubmitButtons
                  text="Login with Github"
                  width="w-full"
                  variant={"outline"}
                  icon={<Github />}
                />
              </form>
              <form
                action={async () => {
                  "use server";
                  await signIn("google");
                }}
              >
                <GeneralSubmitButtons
                  text="Login with Google"
                  width="w-full"
                  variant={"outline"}
                  icon={<Google />}
                />
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
