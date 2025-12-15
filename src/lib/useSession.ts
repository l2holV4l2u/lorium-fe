import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "@type";
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
  const [host, setHostState] = useState<HostUser | null>(null);

  useEffect(() => {
    if (session?.user) {
      const sessionUser = session.user as User;
      if (sessionUser.role === "HOST") {
        setHostState(sessionUser as HostUser);
      } else {
        setHostState(null);
      }
    }
  }, [session]);

  const setHost = (newUser: HostUser | null) => {
    setHostState(newUser);
    update({ user: newUser });
  };

  return [host, setHost];
}

// Registrant-specific session hook
export function useRegistrantSession(): [
  RegistrantUser | null,
  (user: RegistrantUser | null) => void
] {
  const { data: session, update } = useSession();
  const [registrant, setRegistrantState] = useState<RegistrantUser | null>(
    null
  );

  useEffect(() => {
    if (session?.user) {
      const sessionUser = session.user as User;
      if (sessionUser.role === "REGISTRANT") {
        setRegistrantState(sessionUser as RegistrantUser);
      } else {
        setRegistrantState(null);
      }
    }
  }, [session]);

  const setRegistrant = (newUser: RegistrantUser | null) => {
    setRegistrantState(newUser);
    update({ user: newUser });
  };

  return [registrant, setRegistrant];
}
