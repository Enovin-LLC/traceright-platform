import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function Logistics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Logistics & Shipping</h1>
        <p className="text-muted-foreground mt-2">Track shipments and delivery status</p>
      </div>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Truck className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <CardTitle>Shipment Tracking</CardTitle>
              <CardDescription>Monitor logistics operations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Logistics features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
