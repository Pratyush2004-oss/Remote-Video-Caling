import { SignInButton } from "@clerk/nextjs";
import { Button } from "../components/ui/button";

const page = () => {
  return (
    <div>
      <Button>Button</Button>
      <SignInButton>Login</SignInButton>
    </div>
  );
};

export default page;
