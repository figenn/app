import { auth } from "@/actions/auth";
import { User } from "@/app/interface/user";

export default async function Home() {
  const user = (await auth()) as User;
  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between">
      <h1 className="text-xl">Mon App</h1>
    </nav>
  );
}
