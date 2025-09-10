import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { toast } from "sonner";
import {redirect} from "next/navigation";

const Page = async () => {
  const user = await getCurrentUser();
  if(!user){
    toast.error("You must be signed in to generate an interview.");
    redirect("/sign-in");
  }

  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName={user?.name}
        userId={user?.id}
        type="generate"
      />
    </>
  );
};

export default Page;