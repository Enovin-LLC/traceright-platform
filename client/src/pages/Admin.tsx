import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Settings, Shield, Flag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Admin() {
  const { user, loading: authLoading } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newFlag, setNewFlag] = useState({
    key: "",
    name: "",
    description: "",
    category: "",
    requiredRole: "user" as "user" | "admin",
  });

  const { data: featureFlags, isLoading, refetch } = trpc.featureFlags.list.useQuery();
  const toggleMutation = trpc.featureFlags.toggle.useMutation({
    onSuccess: () => {
      toast.success("Feature flag toggled successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to toggle: ${error.message}`);
    },
  });

  const createMutation = trpc.featureFlags.create.useMutation({
    onSuccess: () => {
      toast.success("Feature flag created successfully");
      setIsCreateDialogOpen(false);
      setNewFlag({ key: "", name: "", description: "", category: "", requiredRole: "user" });
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create: ${error.message}`);
    },
  });

  const deleteMutation = trpc.featureFlags.delete.useMutation({
    onSuccess: () => {
      toast.success("Feature flag deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You do not have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleCreateFlag = () => {
    if (!newFlag.key || !newFlag.name) {
      toast.error("Key and name are required");
      return;
    }
    createMutation.mutate({
      ...newFlag,
      enabled: 0,
    });
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage feature flags, security settings, and system configuration
          </p>
        </div>
      </div>

      {/* Feature Flags Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5" />
                Feature Flags
              </CardTitle>
              <CardDescription>
                Control feature visibility and access across the platform
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Flag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Feature Flag</DialogTitle>
                  <DialogDescription>
                    Add a new feature flag to control feature visibility
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">Key *</Label>
                    <Input
                      id="key"
                      placeholder="feature_name"
                      value={newFlag.key}
                      onChange={(e) => setNewFlag({ ...newFlag, key: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Feature Name"
                      value={newFlag.name}
                      onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this feature does..."
                      value={newFlag.description}
                      onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., AI, Analytics, UI"
                      value={newFlag.category}
                      onChange={(e) => setNewFlag({ ...newFlag, category: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Required Role</Label>
                    <Select
                      value={newFlag.requiredRole}
                      onValueChange={(value: "user" | "admin") => setNewFlag({ ...newFlag, requiredRole: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFlag} disabled={createMutation.isPending}>
                    {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {featureFlags && featureFlags.length > 0 ? (
            <div className="space-y-4">
              {featureFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{flag.name}</h3>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{flag.key}</code>
                      {flag.category && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {flag.category}
                        </span>
                      )}
                      {flag.requiredRole === "admin" && (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Admin Only
                        </span>
                      )}
                    </div>
                    {flag.description && (
                      <p className="text-sm text-muted-foreground">{flag.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={flag.enabled === 1}
                        onCheckedChange={() => toggleMutation.mutate({ id: flag.id })}
                        disabled={toggleMutation.isPending}
                      />
                      <span className="text-sm font-medium">
                        {flag.enabled === 1 ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${flag.name}"?`)) {
                          deleteMutation.mutate({ id: flag.id });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Flag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No feature flags yet. Create one to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Settings Section - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security & Governance
          </CardTitle>
          <CardDescription>
            Manage security settings, user permissions, and audit logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Security management coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
