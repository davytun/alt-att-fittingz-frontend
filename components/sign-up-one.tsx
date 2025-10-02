import { LogoIcon } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="bg-linear-to-b from-muted to-background flex min-h-screen px-4 py-16 md:py-32">
      <form action="" className="max-w-92 m-auto h-fit w-full">
        <div className="p-6">
          <div>
            <Link href="/mist" aria-label="go home">
              <LogoIcon />
            </Link>
            <h1 className="mt-6 text-balance text-xl font-semibold">
              <span className="text-muted-foreground">
                Welcome to Fittingz!
              </span>{" "}
              Create an Account to Get Started
            </h1>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                placeholder="Your email"
                className="ring-foreground/15 border-transparent ring-1"
              />
            </div>

            <Button className="w-full" size="default">
              Continue
            </Button>
          </div>

          <hr className="mb-5 mt-6" />
        </div>
        <div className="px-6">
          <p className="text-muted-foreground text-sm">
            Already have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="#">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
