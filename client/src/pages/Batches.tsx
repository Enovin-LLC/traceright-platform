import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Boxes } from "lucide-react";

export default function Batches() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Batch Management</h1>
        <p className="text-muted-foreground mt-2">Track production batches and their lifecycle</p>
      </div>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Boxes className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <CardTitle>Production Batches</CardTitle>
              <CardDescription>Monitor batch production status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Batch management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
