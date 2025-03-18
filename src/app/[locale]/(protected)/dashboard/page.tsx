import { auth } from "@/actions/auth";
import { User } from "@/app/interface/user";
import { LogoutButton } from "@/components/ui/buttons";

export default async function Home() {
  const session: User = await auth();

  return (
    <div>
      <h1>Hello</h1>
      <p className="text-red-600">Welcome {session?.name}</p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <img
        src={session.profilePictureUrl}
        alt="profile picture"
        className="w-20 h-20 rounded-full"
      />
      <LogoutButton />
    </div>
  );
}
