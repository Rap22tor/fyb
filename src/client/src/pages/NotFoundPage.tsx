import { AuthLayout } from "../components/AuthLayout";
import { ButtonLink } from "../components/ButtonLink";

export function NotFoundPage() {
  return (
    <AuthLayout
      title="Uh oh, this page does not exist!"
      subtitle="The link may be broken, or the page may have moved."
    >
      <ButtonLink to="/">Back to home</ButtonLink>
    </AuthLayout>
  );
}
