import { useAuth } from "../auth/AuthContext";

// The landing page for signed-in users. The groups sections stay empty until
// the group issues fill them with real data.
export function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <section className="mb-8">
        <h1 className="mb-1 text-2xl leading-tight font-medium">
          Welcome, {user?.userName}
        </h1>
        <p className="text-muted">Find a study group or manage your own.</p>
      </section>
    </>
  );
}
