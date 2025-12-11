import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "@zod";
import { HostUser, RegistrantUser } from "@type/user";

// Base user session hook
export function useUserSession(): [User | null, (user: User | null) => void] {
  const { data: session, update } = useSession();
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUserState(session.user as User);
    }
  }, [session]);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    update({ user: newUser });
  };

  return [user, setUser];
}

// Host-specific session hook
export function useHostSession(): [
  HostUser | null,
  (user: HostUser | null) => void
] {
  const { data: session, update } = useSession();
  const [user, setUserState] = useState<HostUser | null>(null);

  useEffect(() => {
    if (session?.user) {
      const sessionUser = session.user as User;
      if (sessionUser.role === "HOST") {
        setUserState(sessionUser as HostUser);
      } else {
        setUserState(null);
      }
    }
  }, [session]);

  const setUser = (newUser: HostUser | null) => {
    setUserState(newUser);
    update({ user: newUser });
  };

  return [user, setUser];
}

// Registrant-specific session hook
export function useRegistrantSession(): [
  RegistrantUser | null,
  (user: RegistrantUser | null) => void
] {
  const { data: session, update } = useSession();
  const [user, setUserState] = useState<RegistrantUser | null>(null);

  useEffect(() => {
    if (session?.user) {
      const sessionUser = session.user as User;
      if (sessionUser.role === "REGISTRANT") {
        setUserState(sessionUser as RegistrantUser);
      } else {
        setUserState(null);
      }
    }
  }, [session]);

  const setUser = (newUser: RegistrantUser | null) => {
    setUserState(newUser);
    update({ user: newUser });
  };

  return [user, setUser];
}
