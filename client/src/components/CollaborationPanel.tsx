import { useState } from 'react';
import { 
  Users, 
  X, 
  MessageSquare,
  Clock,
  UserPlus,
  Shield,
  History,
  Eye,
  Edit,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';

interface CollaborationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface Activity {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  timestamp: string;
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'active' | 'idle' | 'offline';
  cursor?: string;
}

export function CollaborationPanel({ isOpen, onClose }: CollaborationPanelProps) {
  const { gradientStyleValue, gradientClass } = useTheme();
  const [activeTab, setActiveTab] = useState<'comments' | 'activity' | 'team'>('comments');
  const [newComment, setNewComment] = useState('');

  if (!isOpen) return null;

  const collaborators: Collaborator[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@traceright.com',
      avatar: 'SC',
      role: 'owner',
      status: 'active',
      cursor: 'Dashboard View'
    },
    {
      id: '2',
      name: 'Michael Park',
      email: 'michael@traceright.com',
      avatar: 'MP',
      role: 'editor',
      status: 'active',
      cursor: 'Suppliers View'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily@traceright.com',
      avatar: 'ER',
      role: 'editor',
      status: 'idle'
    },
    {
      id: '4',
      name: 'James Wilson',
      email: 'james@traceright.com',
      avatar: 'JW',
      role: 'viewer',
      status: 'offline'
    }
  ];

  const comments: Comment[] = [
    {
      id: '1',
      user: 'Sarah Chen',
      avatar: 'SC',
      message: 'The Q2 revenue spike looks promising. Should we investigate what drove this increase?',
      timestamp: '10 min ago',
      resolved: false
    },
    {
      id: '2',
      user: 'Michael Park',
      avatar: 'MP',
      message: 'Updated the supplier performance metrics. Please review when you have a chance.',
      timestamp: '1 hour ago',
      resolved: false
    },
    {
      id: '3',
      user: 'Emily Rodriguez',
      avatar: 'ER',
      message: 'Fixed the date formatting issue in the shipments table.',
      timestamp: '2 hours ago',
      resolved: true
    }
  ];

  const activities: Activity[] = [
    {
      id: '1',
      user: 'Sarah Chen',
      avatar: 'SC',
      action: 'edited',
      target: 'Dashboard KPI widgets',
      timestamp: '5 min ago'
    },
    {
      id: '2',
      user: 'Michael Park',
      avatar: 'MP',
      action: 'added chart',
      target: 'Suppliers View - Performance Analysis',
      timestamp: '25 min ago'
    },
    {
      id: '3',
      user: 'Emily Rodriguez',
      avatar: 'ER',
      action: 'updated data',
      target: 'Raw Materials Inventory',
      timestamp: '1 hour ago'
    },
    {
      id: '4',
      user: 'Sarah Chen',
      avatar: 'SC',
      action: 'created',
      target: 'Q2 Revenue Analysis Dashboard',
      timestamp: '2 hours ago'
    },
    {
      id: '5',
      user: 'Michael Park',
      avatar: 'MP',
      action: 'commented on',
      target: 'Supplier Performance Widget',
      timestamp: '3 hours ago'
    }
  ];

  const getStatusColor = (status: Collaborator['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'offline': return 'bg-slate-300';
    }
  };

  const getRoleBadge = (role: Collaborator['role']) => {
    const colors = {
      owner: 'bg-violet-600',
      editor: 'bg-blue-600',
      viewer: 'bg-slate-600'
    };
    return (
      <Badge className={`text-white text-xs ${colors[role]}`}>
        {role}
      </Badge>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-[450px] h-full bg-white shadow-2xl pointer-events-auto overflow-y-auto">
        {/* Header */}
        <div className={`sticky top-0 z-10 p-6 ${gradientClass} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <div>
                <h2 className="text-xl">Collaboration</h2>
                <p className="text-sm text-white/90">Real-time teamwork</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 bg-white sticky top-[112px] z-10">
          <div className="flex">
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 px-4 py-3 text-sm transition-colors ${
                activeTab === 'comments'
                  ? 'border-b-2 text-violet-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              style={activeTab === 'comments' ? { borderColor: gradientStyleValue.split(',')[0].replace('rgba(', '').split(' ')[0] } : {}}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Comments
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 px-4 py-3 text-sm transition-colors ${
                activeTab === 'activity'
                  ? 'border-b-2 text-violet-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              style={activeTab === 'activity' ? { borderColor: gradientStyleValue.split(',')[0].replace('rgba(', '').split(' ')[0] } : {}}
            >
              <History className="w-4 h-4 inline mr-2" />
              Activity
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`flex-1 px-4 py-3 text-sm transition-colors ${
                activeTab === 'team'
                  ? 'border-b-2 text-violet-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              style={activeTab === 'team' ? { borderColor: gradientStyleValue.split(',')[0].replace('rgba(', '').split(' ')[0] } : {}}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Team
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <>
              {/* Add Comment */}
              <Card className="p-4 border-slate-200">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="mb-3 min-h-[80px]"
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => setNewComment('')}>
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    disabled={!newComment.trim()}
                    style={{ background: gradientStyleValue }}
                    className="text-white"
                  >
                    Comment
                  </Button>
                </div>
              </Card>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.map((comment) => (
                  <Card key={comment.id} className={`p-4 border-slate-200 ${comment.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-violet-100 text-violet-700 text-xs">
                          {comment.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-sm text-slate-900">{comment.user}</div>
                            <div className="text-xs text-slate-500">{comment.timestamp}</div>
                          </div>
                          {comment.resolved && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-700 mb-3">{comment.message}</p>
                        {!comment.resolved && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-xs">
                              Reply
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              Resolve
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              {activities.map((activity) => (
                <Card key={activity.id} className="p-4 border-slate-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {activity.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-900 mb-1">
                        <span>{activity.user}</span>
                        <span className="text-slate-600"> {activity.action} </span>
                        <span className="text-violet-600">{activity.target}</span>
                      </div>
                      <div className="text-xs text-slate-500">{activity.timestamp}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <>
              {/* Add Member */}
              <Card className="p-4 border-slate-200 bg-gradient-to-br from-violet-50 to-purple-50">
                <div className="flex items-center gap-3 mb-3">
                  <UserPlus className="w-5 h-5 text-violet-600" />
                  <h4 className="text-sm text-violet-900">Invite Team Members</h4>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Email address..."
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    style={{ background: gradientStyleValue }}
                    className="text-white"
                  >
                    Invite
                  </Button>
                </div>
              </Card>

              {/* Active Collaborators */}
              <div>
                <h4 className="text-sm text-slate-700 mb-3">Active Now</h4>
                <div className="space-y-2">
                  {collaborators.filter(c => c.status === 'active').map((user) => (
                    <Card key={user.id} className="p-3 border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-violet-100 text-violet-700">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-sm text-slate-900">{user.name}</div>
                            {getRoleBadge(user.role)}
                          </div>
                          {user.cursor && (
                            <div className="text-xs text-slate-600">
                              <Eye className="w-3 h-3 inline mr-1" />
                              {user.cursor}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* All Team Members */}
              <div>
                <h4 className="text-sm text-slate-700 mb-3">All Members ({collaborators.length})</h4>
                <div className="space-y-2">
                  {collaborators.map((user) => (
                    <Card key={user.id} className="p-3 border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-slate-100 text-slate-700">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-sm text-slate-900">{user.name}</div>
                            {getRoleBadge(user.role)}
                          </div>
                          <div className="text-xs text-slate-600">{user.email}</div>
                        </div>
                        {user.role !== 'owner' && (
                          <Button size="sm" variant="ghost">
                            <Shield className="w-4 h-4 text-slate-400" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Permissions Info */}
              <Card className="p-4 border-blue-200 bg-blue-50">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm text-blue-900 mb-2">Permission Levels</h4>
                    <div className="space-y-1 text-xs text-blue-700">
                      <div><strong>Owner:</strong> Full access and management control</div>
                      <div><strong>Editor:</strong> Can view and edit all data</div>
                      <div><strong>Viewer:</strong> Read-only access</div>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
