import { LoadingOverlay } from "@/components/refine-ui/layout/loading-overlay";
import {
  ListView,
  ListViewHeader,
} from "@/components/refine-ui/views/list-view";

export function Dashboard() {
  const isLoading = false;
  const error = null;

  return (
    <ListView>
      <ListViewHeader title="Dashboard" />
    </ListView>
  );
}
