import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Warehouse } from "lucide-react";

export default function WarehousePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Warehouse Operations</h1>
        <p className="text-muted-foreground mt-2">Manage warehouse locations and inventory</p>
      </div>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Warehouse className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>Warehouse Management</CardTitle>
              <CardDescription>Optimize storage and operations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Warehouse management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
