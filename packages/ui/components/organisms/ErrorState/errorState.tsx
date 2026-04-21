import { Card } from "../../molecules/Card/card";
import { Text } from "../../atoms/Text/text";

interface ErrorStateProps {
  title?: string;
  description?: string;
}

export function ErrorState({
  title = "Oops, you're not authorized to see this page",
  description = "Your current session does not include the permissions required to access this area.",
}: ErrorStateProps) {
  return (
    <Card description={description} eyebrow="Access denied" title={title}>
      <Text tone="danger">Please sign in with the right role or permissions and try again.</Text>
    </Card>
  );
}
