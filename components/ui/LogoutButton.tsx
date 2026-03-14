import { signOutAction } from "@/app/actions/auth";
import FormButton from "@/components/ui/FormButton";

export default function LogoutButton() {
  return (
    <form action={signOutAction}>
      <FormButton label="Sign out" pendingLabel="Signing out..." variant="ghost" className="min-w-[112px]" />
    </form>
  );
}
