import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function NumericCard({ title, value }) {
  return (
    <Card className="shadow-none gap-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl">{value}</CardContent>
    </Card>
  );
}
