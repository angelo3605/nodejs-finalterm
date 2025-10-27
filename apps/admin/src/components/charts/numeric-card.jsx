import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "../ui/card";

export function NumericCard({ title, value, Icon, footer }) {
  return (
    <Card className="grid grid-cols-[1fr_min-content] gap-x-2 gap-y-0 shadow-none p-4 *:p-0">
      <CardHeader>
        <CardTitle className="font-normal truncate">{title}</CardTitle>
        <CardDescription className="text-2xl font-bold truncate text-foreground">
          {value}
        </CardDescription>
      </CardHeader>
      <CardContent className="row-span-2">
        <Icon className="size-12 text-input" />
      </CardContent>
      <CardFooter className="text-sm truncate text-muted-foreground">
        {footer}
      </CardFooter>
    </Card>
  );
}
